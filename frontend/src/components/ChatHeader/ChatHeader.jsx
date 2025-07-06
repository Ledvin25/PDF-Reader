import React, { useEffect, useState } from "react";
import "./ChatHeader.css";

// Header del chat: muestra el título, estado online y botón limpiar
const ChatHeader = ({ title, onClearChat, hasMessages }) => {
  // Estado para saber si el backend está online
  const [online, setOnline] = useState(true);

  useEffect(() => {
    // Función para chequear el endpoint /health periódicamente
    const checkHealth = async () => {
      try {
        const res = await fetch("http://localhost:3001/health");
        const data = await res.json();
        setOnline(data.status === "ok");
      } catch {
        setOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handler para limpiar la conversación
  const handleClearClick = () => {
    if (window.confirm("¿Estás seguro de que quieres limpiar toda la conversación?")) {
      onClearChat();
    }
  };

  return (
    <header className="chat-header">
      <div className="header-content">
        <div className="header-info">
          {/* Título del chat */}
          <h1>{title}</h1>
          {/* Estado online/offline */}
          <span className="status-indicator">
            <span className={`status-dot ${online ? "online" : "offline"}`}></span>
            {online ? "En línea" : "Fuera de línea"}
          </span>
        </div>
        {/* Botón limpiar conversación */}
        <button
          className="clear-button"
          onClick={handleClearClick}
          disabled={!hasMessages}
          title="Limpiar conversación"
          aria-label="Limpiar conversación"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
