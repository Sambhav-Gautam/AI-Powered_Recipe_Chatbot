// client/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Enable sending cookies with requests
axios.defaults.withCredentials = true;

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);

    console.log("Frontend Query: ", query); // Log the query to see if it's being sent properly

    try {
      const response = await axios.get(`https://chatbot-one-lac.vercel.app/api/recipes?query=${query}`);

      console.log("Response from backend:", response.data); // Log the response from the backend

      const recipes = response.data.map(recipe => ({
        title: recipe.title,
        ingredients: recipe.ingredients.join(', '),
        details: `Cuisine: ${recipe.cuisine} | Dietary: ${recipe.dietary}`,
        directions: recipe.instructions.slice(0, 3).join(' | ')  // Show only first few instructions
      }));

      const formattedRecipes = recipes.map(r => ` 
        Title: ${r.title.trim()} 
        Ingredients: ${r.ingredients.trim()} 
        Details: ${r.details.trim()} 
        Directions: ${r.directions.trim()}`).join('\n\n');

      setMessages([
        ...messages,
        { text: `You asked for: ${query}`, type: 'user' },
        { text: formattedRecipes, type: 'bot' }
      ]);
    } catch (error) {
      console.error("Error fetching recipes from backend:", error); // Log the error from the backend
      setError('Error fetching recipes.');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSendMessage = () => {
    if (query.trim()) {
      setMessages([...messages, { text: query, type: 'user' }]);
      searchRecipes();
      setQuery('');
    }
  };

  return (
    <div className="App">
      <h1>AI-Powered Recipe Chatbot</h1>

      <div className="chat-container">
        <div className="chat-history">
          {messages.length === 0 && !loading && !error && <div>No chat history yet.</div>}
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.type}`}>
              <pre>{message.text}</pre>
            </div>
          ))}
          {loading && <div className="chat-message bot">Loading...</div>}
          {error && <div className="chat-message bot" style={{ color: '#FF1744' }}>{error}</div>}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={query}
            onChange={handleMessageChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>
            🕸️
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
