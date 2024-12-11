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
      const response = await axios.post("https://chatbot-one-lac.vercel.app/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // Save login status and user data to localStorage
        localStorage.setItem("isLoggedIn", true); // Set login status flag
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data

        // Update the user state in the parent component
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
