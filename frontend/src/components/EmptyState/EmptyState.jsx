import React from "react";
import "./EmptyState.css";

// Estado vacío: se muestra cuando no hay mensajes en el chat
const EmptyState = ({
  icon = "💬",
  title = "¡Comienza una conversación!",
  description = "Escribe un mensaje para comenzar a chatear con la IA",
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "./Flowers_of_Costa_Rica_Simple.pdf"; // Ruta al documento original
    link.download = "Flowers_of_Costa_Rica_Simple.pdf";
    link.click();
  };

  return (
    <div className="empty-state">
      {/* Icono principal */}
      <div className="empty-icon">{icon}</div>
      {/* Título */}
      <h2>{title}</h2>
      {/* Descripción */}
      <p>{description}</p>
      {/* Botón para descargar el documento original */}
      <button className="download-button green-button" onClick={handleDownload}>
        Descargar Archivo de Entrada
      </button>
    </div>
  );
};

export default EmptyState;
