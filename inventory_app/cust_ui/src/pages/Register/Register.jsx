import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    shopKey: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const { email, password, phone } = formData;
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://inventory-backend-buxd.onrender.com/api/worker/register", formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard"); // Redirect to dashboard after successful registration
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Worker Registration</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone Number (10 digits)" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input type="password" name="shopKey" placeholder="Shop Key" value={formData.shopKey} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
        <p>
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
