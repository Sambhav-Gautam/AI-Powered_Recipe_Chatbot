import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './login';
import Register from './register';
import Chat from './chat';

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <div className="App">
        <h1>Welcome to the Batcave 🦇</h1>
        <div className="login-container">
          <Login setUser={setUser} />
          <Register setUser={setUser} />
        </div>
      </div>
    );
  }

  return <Chat user={user} />;
}

export default App;
