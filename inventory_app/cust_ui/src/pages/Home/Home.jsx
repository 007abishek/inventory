import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Our Platform</h1>
        <p>Your one-stop solution for secure authentication and user management.</p>
        <div className="home-buttons">
          <Link to="/register" className="btn">
            Register
          </Link>
          <Link to="/login" className="btn">
            Login
          </Link>
        </div>
      </header>
      <section className="home-info">
        <div className="info-card">
          <h2>Why Choose Us?</h2>
          <p>
            We provide a secure, reliable, and easy-to-use authentication system
            that helps protect your data while delivering a seamless user
            experience.
          </p>
        </div>
        <div className="info-card">
          <h2>Features</h2>
          <ul>
            <li>Secure User Authentication</li>
            <li>Account Management</li>
            <li>Real-time Data Protection</li>
            <li>Responsive User Interface</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
