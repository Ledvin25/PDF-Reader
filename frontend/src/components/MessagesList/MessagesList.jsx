import React from "react";
import Message from "../Message/Message";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import EmptyState from "../EmptyState/EmptyState";
import "./MessagesList.css";

// Lista de mensajes del chat y el indicador de typing
const MessagesList = ({ messages, isTyping, messagesEndRef }) => {
  // Si no hay mensajes y no está escribiendo, mostrar estado vacío
  if (messages.length === 0 && !isTyping) {
    return (
      <main className="messages-container">
        <EmptyState />
      </main>
    );
  }

  // Solo mostrar TypingIndicator si isTyping y el último mensaje AI está vacío
  const lastMessage = messages[messages.length - 1];
  const showTyping =
    isTyping &&
    (!lastMessage || lastMessage.sender !== "ai" || lastMessage.text === "");

  return (
    <main className="messages-container">
      <div className="messages-list">
        {/* Renderizar todos los mensajes */}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {/* Mostrar los 3 puntitos solo si corresponde */}
        {showTyping && <TypingIndicator />}
        {/* Ref para scroll automático al final */}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default MessagesList;
