import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './cart.css';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const apiUrl = "http://localhost:5001";

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    if (!customerId) {
      navigate("/"); // Redirect to login if not logged in
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/cart/get`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCartItems(response.data.cartData || {});
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCart();
    fetchProducts();
  }, [customerId, navigate]);

  useEffect(() => {
    const calculateTotalAmount = () => {
      const subtotal = products.reduce((total, item) => {
        return total + (cartItems[item._id] || 0) * item.price;
      }, 0);
      setTotalAmount(subtotal);
    };

    calculateTotalAmount();
  }, [cartItems, products]);

  const handleProceedToCheckout = () => {
    navigate("/checkout-options", { state: { totalAmount } });
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {Object.keys(cartItems).length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>₹{item.price}</td>
                    <td>{cartItems[item._id]}</td>
                    <td>₹{item.price * cartItems[item._id]}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      )}

      <div className="cart-summary">
        <h3>Total Amount: ₹{totalAmount}</h3>
        <button onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
