import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import Login from './login';
import Register from './register';
import Chat from './chat';

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("user");

    if (isLoggedIn && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div className="App">
        <h1>Welcome to the RecipeChatbot 🦇</h1>
        <div className="login-container">
          <Login setUser={setUser} />
          <Register setUser={setUser} />
        </div>
      </div>
    );
  }

  return <Chat user={user} setUser={setUser} />;  {/* Pass setUser here */}
}

export default App;
