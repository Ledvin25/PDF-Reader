import React, { useRef } from "react";
import "./ChatInput.css";

// Input de texto y botón para enviar mensajes
const ChatInput = ({
  value,
  onChange,
  onSendMessage,
  isLoading,
  placeholder = "Escribe tu mensaje aquí...",
}) => {
  const inputRef = useRef(null);

  // Handler para enviar el mensaje (submit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSendMessage(e);
  };

  // Handler para enviar con Enter (sin Shift)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handler para actualizar el valor del input
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <footer className="input-container">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-wrapper">
          {/* Textarea para escribir el mensaje */}
          <textarea
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="message-input"
            disabled={isLoading}
            rows="1"
            aria-label="Mensaje"
          />
          {/* Botón para enviar el mensaje */}
          <button
            type="submit"
            className="send-button"
            disabled={!value.trim() || isLoading}
            title="Enviar mensaje"
            aria-label="Enviar mensaje"
          >
            {isLoading ? (
              <div className="loading-spinner" aria-label="Enviando..."></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9 22,2" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </footer>
  );
};

export default ChatInput;
