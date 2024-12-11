import React, { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        setUser(response.data.user);
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data.message || "Invalid email or password.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-section">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Login;
