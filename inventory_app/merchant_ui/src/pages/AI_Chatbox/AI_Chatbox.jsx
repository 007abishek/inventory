import React from "react";
import { useNavigate } from "react-router-dom";
import "./AI_Chatbox.css";

const AI_Chatbox = () => {
  const navigate = useNavigate();

  return (
    <div className="chatbox-container">
      <h2>AI Chatbot Assistant</h2>
      <p>Select an option to proceed:</p>

      <div className="chatbox-buttons">
        <button className="chatbox-button" onClick={() => navigate("/low-stock-alerts")}>
          🤖 Low Stock Alerts – Notify the owner when stock is low.
        </button>
        <button className="chatbox-button" onClick={() => navigate("/best-selling-products")}>
          📈 Best-Selling Products Insights – Show top-selling products.
        </button>
        <button className="chatbox-button" onClick={() => navigate("/demand-forecasting")}>
          🔮 Demand Forecasting – Predict future demand based on trends.
        </button>
      </div>
    </div>
  );
};

export default AI_Chatbox;
