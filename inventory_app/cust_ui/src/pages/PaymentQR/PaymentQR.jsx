import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PaymentQR.css";
import { useLocation } from "react-router-dom";

const PaymentQR = () => {
  const location = useLocation();
  const totalAmount = location.state?.totalAmount || 0;
  const upiID = "yourupi@upi"; // Replace with actual UPI ID

  const [amount, setAmount] = useState(totalAmount);

  useEffect(() => {
    setAmount(totalAmount);
  }, [totalAmount]);

  const paymentLink = `upi://pay?pa=${upiID}&pn=YourName&am=${amount}&cu=INR`;

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="title">Scan & Pay</h2>

        <div className="amount-display">
          <span>Amount: ₹{amount}</span>
        </div>

        <div className="qr-box">
          <QRCodeCanvas value={paymentLink} size={200} />
        </div>

        <p className="scan-text">Scan using UPI apps (GPay, PhonePe, Paytm) to complete payment.</p>
      </div>
    </div>
  );
};

export default PaymentQR;
