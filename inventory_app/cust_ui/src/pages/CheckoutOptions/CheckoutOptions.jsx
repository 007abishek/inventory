import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutOptions.css";

const CheckoutOptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalAmount = location.state?.totalAmount || 0;

  // Handle case where total amount is missing
  if (!totalAmount) {
    return (
      <div className="checkout-options">
        <h2>Invalid Checkout</h2>
        <p>No amount found. Please go back to your cart and try again.</p>
        <button onClick={() => navigate("/")}>Go to Cart</button>
      </div>
    );
  }

  return (
    <div className="checkout-options">
      <h2>Choose Payment Method</h2>

      <div className="payment-buttons">
        <button
          className="upi-button"
          onClick={() => navigate("/payment-qr", { state: { totalAmount } })}
        >
          Pay via UPI (QR Code)
        </button>

        <button
          className="stripe-button"
          onClick={() => navigate("/stripe-payment", { state: { totalAmount } })}
        >
          Pay via Stripe (Card)
        </button>
      </div>
    </div>
  );
};

export default CheckoutOptions;
