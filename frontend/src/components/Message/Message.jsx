import React from "react";
import { SENDER_TYPES } from "../../constants/chatConstants";
import "./Message.css";

// Componente para renderizar un mensaje individual (usuario o AI)
const Message = ({ message }) => {
  // Desestructuramos las propiedades del mensaje
  const { text, sender, timestamp, isError } = message;
  const isUser = sender === SENDER_TYPES.USER;
  const isAI = sender === SENDER_TYPES.AI;

  // Formatear el timestamp para mostrar solo hora y minutos (HH:MM)
  let timeOnly = timestamp;
  if (timestamp && timestamp.length >= 5) {
    // Si viene en formato HH:MM:SS, tomar solo HH:MM
    timeOnly = timestamp.split(":").slice(0, 2).join(":");
  }

  return (
    <div className={`message ${sender} ${isError ? "error" : ""}`}>
      {/* Avatar según el tipo de mensaje */}
      <div className="message-avatar">{isUser ? "👤" : "🤖"}</div>
      <div className="message-content">
        {/* Texto del mensaje */}
        <div className="message-text">{text}</div>
        {/* Timestamp solo hora:minutos */}
        <div className="message-timestamp">{timeOnly}</div>
      </div>
    </div>
  );
};

export default Message;
