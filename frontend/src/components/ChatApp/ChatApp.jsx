import React from "react";
import ChatHeader from "../ChatHeader/ChatHeader";
import MessagesList from "../MessagesList/MessagesList";
import ChatInput from "../ChatInput/ChatInput";
import { useChat } from "../../hooks/useChat";
import "./ChatApp.css";

// Componente principal de la app de chat
const ChatApp = ({
  title = "PDF Reader",
  placeholder = "Escribe tu mensaje aquí...",
  onMessageSent,
  onChatCleared,
  customResponses = null,
}) => {
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
  } = useChat({ onMessageSent, onChatCleared, customResponses });

  return (
    <div className="chat-app">
      {/* Header con título y botón limpiar */}
      <ChatHeader title={title} onClearChat={handleClearChat} hasMessages={messages.length > 0} />
      {/* Lista de mensajes y typing indicator */}
      <MessagesList messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef} />
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