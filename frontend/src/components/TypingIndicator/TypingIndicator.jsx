import React from "react";
import "./TypingIndicator.css";

// Indicador visual de que la IA está escribiendo (los 3 puntitos)
const TypingIndicator = () => {
  return (
    <div className="message ai typing">
      {/* Avatar de la IA */}
      <div className="message-avatar">🤖</div>
      <div className="message-content">
        {/* Animación de los 3 puntitos */}
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
