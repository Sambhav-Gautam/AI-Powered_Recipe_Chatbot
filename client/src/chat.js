import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import './Chat.css';
import About from './About'; // Import the About component
import { FaUserCircle } from 'react-icons/fa'; // For profile icon

axios.defaults.withCredentials = true;

function Chat({ currentUser }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // State to control About component rendering
  const [confirmDownload, setConfirmDownload] = useState(false); // State to handle PDF confirmation

  // Retrieve saved messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    if (savedMessages) {
      setMessages(savedMessages);
    }

    // Check if the user is logged in (or any session state is set)
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      // Redirect to login or show login screen if the user is not logged in
      console.log("User is not logged in, redirecting to login...");
      // Implement redirection logic if needed
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
        const response = await axios.get(`https://chatbot-one-lac.vercel.app/api/recipes?query=${query}`);
    //   const response = await axios.get(
    //     `http://localhost:5000/api/recipes?query=${query}`
    //   );

      const recipes = response.data.map((recipe) => ({
        title: recipe.title || "No Title",
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients.join(", ")
          : "No Ingredients Found",
        details: `Cuisine: ${recipe.cuisine || "N/A"} | Author: ${
          recipe.author_info?.name || "N/A"
        } | Servings: ${recipe.details?.["Servings:"] || "N/A"}`,
        directions: Array.isArray(recipe.directions)
          ? recipe.directions.slice(0, 3).join(" | ")
          : "No Instructions Found",
        url: recipe.url || "No URL Found",
        nutritionFacts: recipe.nutrition_facts
          ? Object.entries(recipe.nutrition_facts)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" | ")
          : "No Nutrition Facts Found",
        tags: recipe.tags ? recipe.tags.join(", ") : "No Tags Found",
      }));

      const formattedRecipes = recipes
        .map(
          (r) =>
            `Title: ${r.title.trim()} \nIngredients: ${r.ingredients.trim()} \nDetails: ${r.details.trim()} \nDirections: ${r.directions.trim()} \nURL: ${r.url.trim()} \nNutrition Facts: ${r.nutritionFacts.trim()} \nTags: ${r.tags.trim()}`
        )
        .join("\n\n");

      setMessages([
        ...messages,
        { text: `You asked for: ${query}`, type: "user" },
        { text: formattedRecipes, type: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching recipes from backend:", error);
      setError("Error fetching recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (e) => setQuery(e.target.value);

  const handleSendMessage = () => {
    if (query.trim()) {
      setMessages([...messages, { text: query, type: "user" }]);
      searchRecipes();
      setQuery("");
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    // Clear user session only when logout is pressed
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    clearChat();
    setMessages([]);
    window.location.reload(); // Reload the page to reset the app
    console.log("Logged out");
  };

  const handleAbout = () => {
    setShowAbout(true); // Set the state to show About component
  };

  const handleBack = () => {
    setShowAbout(false); // Return to the chat
  };
  const exportChatAsPDF = () => {
    if (confirmDownload) {
      const doc = new jsPDF();
      const currentTime = new Date().toLocaleString();
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0); // Default color (black)
      doc.setFont("helvetica", "bold");
      doc.text("Chat History", 20, 20); // Title of the document
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Exported on: ${currentTime}`, 20, 30); // Timestamp of export
  
      let y = 40; // Starting position for the text
      messages.forEach((message, index) => {
        const time = new Date().toLocaleString(); // Get the current time for each message
        const formattedMessage = `${time} - ${message.type === "user" ? "You" : "Bot"}: ${message.text}`;
        
        // Split the message into smaller lines that fit the page width
        const lines = doc.splitTextToSize(formattedMessage, 180); // 180 is the width for wrapping text
  
        // Set colors and font styles based on the message type
        if (message.type === "user") {
          doc.setTextColor(0, 102, 204); // Blue color for user
          doc.setFont("helvetica", "bold"); // Bold font for user
        } else {
          doc.setTextColor(255, 87, 34); // Orange color for bot
          doc.setFont("helvetica", "italic"); // Italic font for bot
        }
  
        // Check if the text will fit on the current page
        if (y + lines.length * 10 > 270) { // 270 is the maximum height for the page
          doc.addPage(); // Add a new page if the text will overflow
          y = 20; // Reset y position to start at the top of the new page
        }
  
        // Add the lines to the page
        lines.forEach((line, i) => {
          doc.text(line, 20, y + i * 10);
        });
  
        y += lines.length * 10; // Update y position for the next message
      });
  
      doc.save("chat_history.pdf");
    } else {
      alert("Are you sure you want to download the chat history as a PDF?");
      setConfirmDownload(true); // Set the state to confirm download
    }
  };
  

  if (showAbout) {
    return <About handleBack={handleBack} />; // Pass handleBack to About
  }

  return (
    <div className="chat-container">
      {/* Title Section */}
      <div className="chat-title">
        <h2>Recipe Chatbot</h2>
        {/* Profile Icon and Dropdown */}
        <div className="profile-icon" onClick={toggleDropdown}>
          <FaUserCircle size={30} color="#fff" />
          {dropdownVisible && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
              <button onClick={handleAbout}>About</button>
            </div>
          )}
        </div>

        {/* Share Chat Button */}
        <button onClick={exportChatAsPDF} className="share-chat-button">
          Share Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="chat-history">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}`}>
            <pre>{message.text}</pre>
          </div>
        ))}
        {loading && <div className="chat-message bot">Loading...</div>}
        {error && (
          <div className="chat-message bot" style={{ color: "#FF1744" }}>
            {error}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input">
        <button className="clear-chat" onClick={clearChat}>
          Cls
        </button>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={query}
          onChange={handleMessageChange}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>🕸️</button>
      </div>
    </div>
  );
}

export default Chat;
