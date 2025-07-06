import React from "react";
import "./TokenCostDisplay.css";

const TokenCostDisplay = ({ tokens, cost }) => {
  return (
    <div className="token-cost-display">
      <span>Tokens: <strong>{tokens}</strong></span>
      <span> | </span>
      <span>Costo: <strong>${cost.toFixed(6)}</strong></span>
    </div>
  );
};

export default TokenCostDisplay;
