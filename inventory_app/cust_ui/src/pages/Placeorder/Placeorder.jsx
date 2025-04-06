import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import './PlaceOrder.css';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, totalAmount } = location.state || {};

  const [WorkerId, setWorkerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const apiUrl = "http://localhost:5001";

  useEffect(() => {
    const storedWorkerId = localStorage.getItem("workerId");
    if (!storedWorkerId || storedWorkerId === "undefined") {
      console.error("Invalid WorkerId detected in localStorage.");
      navigate("/login");
      return;
    }
    
    setWorkerId(storedWorkerId);

    if (!cartItems || totalAmount <= 0) {
      navigate("/cart");
    }
  }, [cartItems, totalAmount, navigate]);

  const handleChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!WorkerId) {
      alert("Worker not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      alert("Please fill in all customer details");
      return;
    }

    const orderData = {
      WorkerId,
      items: Object.entries(cartItems).map(([itemId, quantity]) => ({
        itemId,
        quantity,
      })),
      amount: totalAmount,
      customerDetails,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/sales/place-sale-cod`, orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/dashboard");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error placing order");
    }
  };

  return (
    <div className="place-order">
      <h2>Place Your Order</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={customerDetails.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Phone no:</label>
        <input type="text" name="phone" value={customerDetails.phone} onChange={handleChange} required />
      </div>
      <div>
        <label>Address:</label>
        <input type="text" name="address" value={customerDetails.address} onChange={handleChange} required />
      </div>
      <h3>Total Amount: ₹{totalAmount}</h3>
      <button onClick={handlePlaceOrder}>Proceed to Payment</button>
    </div>
  );
};

export default PlaceOrder;
