import React, { useEffect, useState } from "react";
import "./ChatHeader.css";

// Header del chat: muestra el título, estado online y botón limpiar y exportar
const ChatHeader = ({ title, onClearChat, hasMessages, onExportConversation }) => {
  // Estado para saber si el backend está online
  const [online, setOnline] = useState(true);

  useEffect(() => {
    // Solo chequear el endpoint /health una vez al montar
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
  }, []);

  // Handler para limpiar la conversación
  const handleClearClick = () => {
    if (window.confirm("¿Estás seguro de que quieres limpiar toda la conversación?")) {
      onClearChat();
    }
  };

  // Handler para exportar conversación
  const handleExportClick = () => {
    if (onExportConversation) onExportConversation();
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
        {/* Botón exportar conversación */}
        <button
          className="export-button"
          onClick={handleExportClick}
          disabled={!hasMessages}
          title="Exportar conversación"
          aria-label="Exportar conversación"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 16V4M12 16l-4-4M12 16l4-4" />
            <rect x="4" y="18" width="16" height="2" rx="1" />
          </svg>
        </button>
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
