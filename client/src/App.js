import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the updated CSS

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`https://ai-powered-recipe-chatbot.vercel.app/api/recipes?query=${query}`);
      
      // Assuming response.data is an array of recipes, we can format it into a more readable format
      const recipes = response.data.map(recipe => ({
        title: recipe.title,
        url: recipe.url,
        ingredients: recipe.ingredients.join(', '), // Join ingredients into a single string
        details: `Prep Time: ${recipe.details['Prep Time:']} | Cook Time: ${recipe.details['Cook Time:']} | Servings: ${recipe.details['Servings:']}`,
        directions: recipe.directions.slice(0, 3).join(' | ') // Show only the first few directions
      }));
  
      const formattedRecipes = recipes.map(r => `
  Title: ${r.title.trim()}
  URL: ${r.url.trim()}
  Ingredients: ${r.ingredients.trim()}
  Details: ${r.details.trim()}
  Directions: ${r.directions.trim()}
      `).join('\n\n'); // Trim the output to remove leading/trailing spaces
  
      setMessages([
        ...messages,
        { text: `You asked for: ${query}`, type: 'user' },
        { text: formattedRecipes, type: 'bot' }
      ]);
    } catch (error) {
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
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
              <path d="M32,10.927c-17.944,0-32,9.444-32,21.5s14.056,21.5,32,21.5s32-9.444,32-21.5C64,20.572,49.645,10.927,32,10.927z M52.517,40.264c-1.569,1.433-3.62,3.516-6.034,4.558c3.983-6.251-3.742-9.376-7.242-2.604c-1.327-5.47-5.913-1.693-7.241,5.209c-1.328-6.902-5.914-10.679-7.241-5.209c-3.5-6.772-11.224-3.647-7.241,2.604c-2.414-1.042-4.466-3.125-6.034-4.688c-2.173-2.214-3.5-4.819-3.621-7.293c0.121-5.47,5.914-10.679,14.483-12.763c-6.035,8.596,3.741,14.716,5.431,7.033l0.724-7.684l1.69,1.953h3.62l1.69-1.953l0.724,7.684c1.69,7.553,11.466,1.563,5.431-7.033c8.569,2.214,14.362,7.423,14.483,12.893C56.017,35.446,54.69,38.05,52.517,40.264z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
