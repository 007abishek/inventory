import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TrendingProducts.css";


const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: Please log in");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://inventory-backend-buxd.onrender.com/api/sales/trending-products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrendingProducts(response.data.data);
      } catch (err) {
        setError("Error fetching trending products");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  if (loading) return <p>Loading trending products...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h2>Trending Products</h2>
      <ul>
        {trendingProducts.map((product) => (
          <li key={product.productId}>
            {product.name} - Sold: {product.totalSold}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingProducts;
