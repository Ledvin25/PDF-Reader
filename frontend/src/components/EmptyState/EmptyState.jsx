import React from "react";
import "./EmptyState.css";

// Estado vacío: se muestra cuando no hay mensajes en el chat
const EmptyState = ({
  icon = "💬",
  title = "¡Comienza una conversación!",
  description = "Escribe un mensaje para comenzar a chatear con la IA",
}) => {
  return (
    <div className="empty-state">
      {/* Icono principal */}
      <div className="empty-icon">{icon}</div>
      {/* Título */}
      <h2>{title}</h2>
      {/* Descripción */}
      <p>{description}</p>
    </div>
  );
};

export default EmptyState;
