import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Worker_dashboard.css";

const WorkerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = "https://inventory-backend-buxd.onrender.com";
  const navigate = useNavigate();
  const workerId = localStorage.getItem("workerId");

  useEffect(() => {
    if (!workerId) {
      navigate("/");
      return;
    }

    const fetchWorkerProducts = async () => {
      try {
        const productResponse = await axios.get(`${apiUrl}/api/products/shop/${workerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching worker's products:", error);
      }
    };

    const fetchCart = async () => {
      try {
        const cartResponse = await axios.get(`${apiUrl}/api/cart/get`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCartItems(cartResponse.data.cartData || {});
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchWorkerProducts();
    fetchCart();
  }, [workerId, navigate]);

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${apiUrl}/api/cart/add`,
        { itemIds: [productId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setCartItems((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (cartItems[productId] > 0) {
      try {
        await axios.post(
          `${apiUrl}/api/cart/remove`,
          { itemId: productId },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        setCartItems((prev) => {
          const updatedCart = { ...prev, [productId]: prev[productId] - 1 };
          if (updatedCart[productId] === 0) delete updatedCart[productId];
          return updatedCart;
        });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/api/worker/logout`, {}, { withCredentials: true });

      localStorage.removeItem("workerId");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="worker-dashboard">
      <div className="header">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <button onClick={() => addToCart(item._id)}>Add</button>
                    {cartItems[item._id] > 0 && (
                      <>
                        <span> {cartItems[item._id]} </span>
                        <button onClick={() => removeFromCart(item._id)}>Remove</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate("/cart")} disabled={Object.keys(cartItems).length === 0}>
        Go to Cart
      </button>
    </div>
  );
};

export default WorkerDashboard;
