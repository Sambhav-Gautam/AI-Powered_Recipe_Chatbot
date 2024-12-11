import React, { useState } from "react";
import axios from "axios";

function Register({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://chatbot-one-lac.vercel.app/register", {
        email,
        password,
      });

      if (response.status === 200) {
        alert("Registration successful! Please log in.");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        setError(error.response.data.message || "Error registering user.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="register-section">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Register;
