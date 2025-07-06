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

  return (
    <div className="chat-app">
      {/* Header con título y botón limpiar */}
      <ChatHeader
        title={title}
        onClearChat={handleClearChat}
        hasMessages={messages.length > 0}
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