import { useNavigate } from "react-router-dom";
import "./reports.css"; 

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-2 gap-4">
        <button
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => navigate("/sales-report")}
        >
          📊 Sales Reports
        </button>
        <button
          className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={() => navigate("/trending-products")}
        >
          🔥 Trending Products
        </button>
        <button
          className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={() => navigate("/revenue-dashboard")}
        >
          💰 Revenue Dashboard
        </button>
        <button
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          onClick={() => navigate("/stock-analysis")}
        >
          📦 Stock Analysis
        </button>
      </div>
    </div>
  );
};

export default Reports;
