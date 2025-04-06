import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RevenueDashboard.css";


const RevenueDashboard = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRevenueData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/api/sales/revenue-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRevenueData(response.data);
      } catch (err) {
        setError("Failed to fetch revenue data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Revenue Dashboard</h2>
      {revenueData ? (
        <div className="revenue-info">
          <p><strong>Total Earnings:</strong> ${revenueData.totalEarnings}</p>
          <p><strong>This Month:</strong> ${revenueData.monthlyTrend.thisMonth}</p>
          <p><strong>Last Month:</strong> ${revenueData.monthlyTrend.lastMonth}</p>
          <p>
            <strong>Change:</strong> 
            <span style={{ color: revenueData.monthlyTrend.change >= 0 ? "green" : "red" }}>
              {revenueData.monthlyTrend.change >= 0 ? " ↑" : " ↓"} ${Math.abs(revenueData.monthlyTrend.change)}
            </span>
          </p>
        </div>
      ) : (
        <p>No revenue data available.</p>
      )}
    </div>
  );
};

export default RevenueDashboard;
