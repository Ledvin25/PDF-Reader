import React, { useState } from "react";
import ChatHeader from "../ChatHeader/ChatHeader";
import MessagesList from "../MessagesList/MessagesList";
import ChatInput from "../ChatInput/ChatInput";
import { useChat } from "../../hooks/useChat";
import TokenCostDisplay from "../TokenCostDisplay/TokenCostDisplay";
import "./ChatApp.css";

// Componente principal de la app de chat
const ChatApp = ({
  title = "PDF Reader",
  placeholder = "Escribe tu mensaje aquí...",
  onMessageSent,
  onChatCleared,
  customResponses = null,
}) => {
  // Estado local para tokens/costo acumulativo
  const [tokenStats, setTokenStats] = useState({ tokens: 0, cost: 0 });

  // Callback para acumular tokens/costo
  const handleUsageUpdate = ({ tokens, cost }) => {
    setTokenStats((prev) => ({
      tokens: prev.tokens + tokens,
      cost: prev.cost + cost,
    }));
  };

  // Hook personalizado para manejar la lógica del chat y el estado
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isTyping,
    handleSendMessage,
    handleClearChat,
    messagesEndRef,
  } = useChat({
    onMessageSent,
    onChatCleared,
    customResponses,
    onUsageUpdate: handleUsageUpdate,
  });

  // Exportar conversación a Markdown
  const handleExportConversation = () => {
    if (!messages.length) return;

    let md = `# Conversación\n\n`;

    messages.forEach((msg) => {
      if (msg.sender === "user") {
        md += `**Usuario:** ${msg.text}\n\n`;
      } else {
        md += `**Asistente:** ${msg.text}\n\n`;
      }
    });

    // Descargar como archivo .md
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversacion_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="chat-app">
      {/* Header con título y botón limpiar y exportar */}
      <ChatHeader
        title={title}
        onClearChat={handleClearChat}
        hasMessages={messages.length > 0}
        onExportConversation={handleExportConversation}
      />
      {/* Token/cost display debajo del header */}
      <TokenCostDisplay tokens={tokenStats.tokens} cost={tokenStats.cost} />
      {/* Lista de mensajes y typing indicator */}
      <MessagesList
        messages={messages}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
      />
      {/* Input para escribir y enviar mensajes */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder={placeholder}
      />
    </div>
  );
};

export default ChatApp;