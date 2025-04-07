import React, { useState, useEffect } from "react";
import axios from "axios";
import "./salesReport.css";

const SalesReport = () => {
  const [period, setPeriod] = useState("daily");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSalesReport();
  }, [period]);

  const fetchSalesReport = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://inventory-backend-buxd.onrender.com/api/sales/sales-report?period=${period}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSalesData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sales report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sales-report-container">
      <h2>Sales Report</h2>
      <div className="filter">
        <label>Period: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      {loading && <p>Loading sales data...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Total Amount</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {salesData.length > 0 ? (
              salesData.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>Rs {item.totalSales.toFixed(2)}</td>
                  <td>{item.totalOrders}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No sales data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesReport;
