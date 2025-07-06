import React from "react";
import "./ErrorBanner.css";

// Banner de error visual para mostrar mensajes críticos
// Props:
//   error: string (mensaje de error a mostrar)
//   onClose: función para cerrar el banner
const ErrorBanner = ({ error, onClose }) => {
  // Si no hay error, no renderizar nada
  if (!error) return null;

  return (
    <div className="error-banner">
      {/* Mensaje de error */}
      <span>{error}</span>

      {/* Botón para cerrar el banner */}
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default ErrorBanner;
