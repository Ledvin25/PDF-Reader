import React from "react";
import "./ErrorBanner.css";

// Banner de error visual para mostrar mensajes críticos
// Props:
//   error: string (mensaje de error a mostrar)
//   onClose: función para cerrar el banner
//   onRetry: función opcional para reintentar (solo se muestra si está presente)
const ErrorBanner = ({ error, onClose, onRetry }) => {
  // Si no hay error, no renderizar nada
  if (!error) return null;

  // Detectar si el error es de rate limit (429)
  const isRateLimit =
    typeof error === "string" &&
    (error.includes("429") || error.toLowerCase().includes("rate limit"));

  return (
    <div className="error-banner">
      {/* Mensaje de error */}
      <span>{error}</span>

      {/* Botón para reintentar si es rate limit */}
      {isRateLimit && onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Reintentar
        </button>
      )}

      {/* Botón para cerrar el banner */}
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default ErrorBanner;
