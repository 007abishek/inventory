import React from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Merchant Dashboard</h2>

      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={() => navigate("/product-home")}>
          🛍️ Products
        </button>
        <button className="dashboard-button" onClick={() => navigate("/sales")}>
          📦 Sales
        </button>
        <button className="dashboard-button" onClick={() => navigate("/reports")}>
          📊 Reports & Analytics
        </button>
        <button className="dashboard-button" onClick={() => navigate("/chatbot")}>
          🤖 AI Chatbot
        </button>
        <button className="dashboard-button" onClick={() => navigate("/settings")}>
          ⚙️ Settings
        </button>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
