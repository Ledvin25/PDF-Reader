import { useState, useRef } from "react";
import { SENDER_TYPES, CHAT_CONFIG } from "../constants/chatConstants";

// Hook principal para manejar la lógica del chat AI
export function useChat({ onMessageSent, onChatCleared, customResponses = null }) {
  // Estado para los mensajes del chat
  const [messages, setMessages] = useState([]);
  // Estado para el valor del input de usuario
  const [inputValue, setInputValue] = useState("");
  // Estado para mostrar loading mientras responde el AI
  const [isLoading, setIsLoading] = useState(false);
  // Estado para mostrar el indicador de "escribiendo..."
  const [isTyping, setIsTyping] = useState(false);
  // Ref para hacer scroll automático al final de la lista de mensajes
  const messagesEndRef = useRef(null);

  // Maneja el envío de un mensaje por el usuario
  const handleSendMessage = async (e) => {
    e.preventDefault();
    // No enviar si el input está vacío o si ya está cargando
    if (!inputValue.trim() || isLoading) return;

    // Crear el mensaje del usuario
    const userMessage = {
      id: Date.now() + "-user",
      text: inputValue,
      sender: SENDER_TYPES.USER,
      timestamp: new Date().toLocaleTimeString(),
    };
    // Agregar el mensaje del usuario al estado
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);
    if (onMessageSent) onMessageSent(userMessage);

    // No agregar el mensaje AI vacío aquí
    let aiMessage = null;
    let aiMessageId = Date.now() + "-ai";

    try {
      // Llamada al backend usando fetch (SSE streaming)
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      if (!response.body) throw new Error("No stream body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";
      let firstTokenReceived = false;
      // Leer el stream línea por línea (SSE)
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        let lines = buffer.split("\n\n");
        buffer = lines.pop();
        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const payload = JSON.parse(line.replace("data: ", ""));
            // Si el backend envía contenido parcial
            if (payload.type === "content") {
              // Al recibir el primer token, crear el mensaje AI y ocultar el typing
              if (!firstTokenReceived) {
                aiMessage = {
                  id: aiMessageId,
                  text: payload.content,
                  sender: SENDER_TYPES.AI,
                  timestamp: new Date().toLocaleTimeString(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setIsTyping(false);
                firstTokenReceived = true;
              } else {
                aiMessage = {
                  ...aiMessage,
                  text: aiMessage.text + payload.content,
                };
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last && last.id === aiMessage.id) {
                    return [...prev.slice(0, -1), aiMessage];
                  } else {
                    return [...prev, aiMessage];
                  }
                });
              }
            // Si el backend indica que terminó
            } else if (payload.type === "done") {
              setIsLoading(false);
              setIsTyping(false);
            // Si hubo un error en el backend
            } else if (payload.type === "error") {
              aiMessage = {
                id: aiMessageId,
                text: "[Error: " + payload.content + "]",
                sender: SENDER_TYPES.AI,
                timestamp: new Date().toLocaleTimeString(),
              };
              setMessages((prev) => {
                // Si ya existe el mensaje AI, reemplazarlo
                const last = prev[prev.length - 1];
                if (last && last.id === aiMessage.id) {
                  return [...prev.slice(0, -1), aiMessage];
                } else {
                  return [...prev, aiMessage];
                }
              });
              setIsLoading(false);
              setIsTyping(false);
            }
          }
        }
      }
    } catch (err) {
      // Si hay error de red o conexión con el backend
      aiMessage = {
        id: aiMessageId,
        text: "[Error de conexión con el backend]",
        sender: SENDER_TYPES.AI,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.id === aiMessage.id) {
          return [...prev.slice(0, -1), aiMessage];
        } else {
          return [...prev, aiMessage];
        }
      });
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Limpia la conversación y notifica al padre si corresponde
  const handleClearChat = () => {
    setMessages([]);
    if (onChatCleared) onChatCleared();
  };

  // Retornar el API del hook para usar en el componente
  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isTyping,
    handleSendMessage,
    handleClearChat,
    messagesEndRef,
  };
}
