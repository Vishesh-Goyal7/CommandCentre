import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      sessionStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="status-header">
        <div className="blink-light"></div>
        <span>ONLINE</span>
      </div>

      <div className="login-box breathing-card">
        <h2>Command Centre Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
