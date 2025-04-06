import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StripePayment.css";

// Load Stripe with public key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const totalAmount = location.state?.totalAmount || 0;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  // Ensure Stripe is loaded before rendering the form
  useEffect(() => {
    if (stripe && elements) {
      setStripeLoaded(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!stripe || !elements) {
      setError("Stripe is still loading. Please wait a moment and try again.");
      setLoading(false);
      return;
    }
  
    try {
      // Step 1: Request a PaymentIntent from the backend
      const { data } = await axios.post("http://localhost:5001/api/payment/stripe", {
        amount: totalAmount * 100, // Convert to cents
      });
  
      // Step 2: Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/payment-success"), 2000); // Redirect to success page
      }
    } catch (err) {
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-payment">
      <h2>Pay with Stripe</h2>
      <p>Total Amount: ₹{totalAmount}</p>

      {!stripeLoaded ? (
        <p>Loading payment form...</p>
      ) : success ? (
        <p className="success-message">Payment Successful! 🎉 Redirecting...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardElement className="card-input" />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : `Pay ₹${totalAmount}`}
          </button>
        </form>
      )}
    </div>
  );
};

// Wrap with Elements provider
const StripePayment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default StripePayment;
