import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StockAnalysis.css";

const StockAnalysis = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStockAnalysis = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/api/sales/stock-analysis", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStockData(response.data.data);
      } catch (err) {
        setError("Failed to fetch stock analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockAnalysis();
  }, []);

  return (
    <div className="stock-analysis-container">
      <h2>Stock Analysis</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && stockData.length === 0 && <p>No data available.</p>}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Total Sold</th>
            <th>Stock Left</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.totalSold}</td>
              <td>{item.stockLeft}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockAnalysis;
