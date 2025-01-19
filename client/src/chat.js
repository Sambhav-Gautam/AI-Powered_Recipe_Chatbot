  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { jsPDF } from "jspdf"; 
  import './Chat.css';
  import About from './About'; 
  import { FaUserCircle } from 'react-icons/fa'; 

  axios.defaults.withCredentials = true;

  function Chat({ currentUser }) {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [confirmDownload, setConfirmDownload] = useState(false);

    useEffect(() => {
      const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
      if (savedMessages) {
        setMessages(savedMessages);
      }

      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        console.log("User is not logged in, redirecting to login...");
      }
    }, []);

    useEffect(() => {
      if (messages.length > 0) {
        const messagesToSave = messages.slice(-50);  
        localStorage.setItem("chatMessages", JSON.stringify(messagesToSave));
      }
    }, [messages]);

    const searchRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`https://chatbot-one-lac.vercel.app/api/recipes?query=${query}`);
        // const response = await axios.get(
        //   `http://localhost:5000/api/recipes?query=${query}`
        // );

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

          const randomMessages = [
            "Oops! I couldn't find any recipes. Try again with different ingredients or titles! 🍽️",
            "No recipes found! Maybe check your query and try again 🧐",
            "Hmm, I couldn't find any matching recipes. Want to try something else? 🤔",
            "Sorry, no recipes matched your request. Please refine your search! 🔍"
          ];
          
          const getRandomMessage = () => {
            const randomIndex = Math.floor(Math.random() * randomMessages.length);
            return randomMessages[randomIndex];
          };
          
          setMessages([
            ...messages,
            { text: `🌟 Let's get started! 🌟 You asked for: ${query} ✨`, type: "user" },
            {
              text: formattedRecipes.length > 0 
                ? `✨ Here are your recipes! ✨ \n${formattedRecipes} 🌟`
                : `✨ ${getRandomMessage()} ✨`, 
              type: "bot", 
              recipes: recipes
            },
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
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      clearChat();
      setMessages([]);
      window.location.reload();
      console.log("Logged out");
    };

    const handleAbout = () => {
      setShowAbout(true);
    };

    const handleBack = () => {
      setShowAbout(false);
    };

    const exportChatAsPDF = () => {
      if (confirmDownload) {
        const doc = new jsPDF();
        const currentTime = new Date().toLocaleString();
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("Chat History", 20, 20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Exported on: ${currentTime}`, 20, 30);

        let y = 40;
        messages.forEach((message, index) => {
          const time = new Date().toLocaleString();
          const formattedMessage = `${time} - ${message.type === "user" ? "You" : "Bot"}: ${message.text}`;

          const lines = doc.splitTextToSize(formattedMessage, 180);

          if (message.type === "user") {
            doc.setTextColor(0, 102, 204);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setTextColor(255, 87, 34);
            doc.setFont("helvetica", "italic");
          }

          if (y + lines.length * 10 > 270) {
            doc.addPage();
            y = 20;
          }
    
    
          // Add the lines to the page

          // Add the lines to the page
          lines.forEach((line, i) => {
            doc.text(line, 20, y + i * 10);
          });

          y += lines.length * 10;
        });

        doc.save("chat_history.pdf");
      } else {
        alert("Are you sure you want to download the chat history as a PDF?");
        setConfirmDownload(true);
      }
    };

    const handleFavoriteRecipe = async (recipe , button) => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          alert("Please log in to add favorites.");
          return;
        }
    
        const user = JSON.parse(storedUser);
    
        const response = await axios.put(
          "https://chatbot-one-lac.vercel.app/api/users/favorites",
          { userId: user._id, recipe }
        );
    
        if (response.status === 200) {
          alert("Recipe added to favorites!");
          // button.classList.add("active"); 
        } else {
          alert("Failed to add the recipe. Please try again.");
        }
      } catch (error) {
        console.error("Error adding recipe to favorites:", error);
        alert("An error occurred while adding the recipe.");
      }
    };
    

    if (showAbout) {
      return <About handleBack={handleBack} />;
    }

    return (
      <div className="chat-container">
        <div className="chat-title">
          <h2>Recipe Chatbot</h2>
          <div className="profile-icon" onClick={toggleDropdown}>
            <FaUserCircle size={30} color="#fff" />
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Logout</button>
                <button onClick={handleAbout}>About</button>
              </div>
            )}
          </div>
          <button onClick={exportChatAsPDF} className="share-chat-button">
            Share Chat
          </button>
        </div>

        <div className="chat-history">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.type}`}>
              <pre>{message.text}</pre>
              {message.recipes && message.recipes.map((recipe, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFavoriteRecipe(recipe , this)}
                  className="favorite-button"
                >
                  ★
                </button>
              ))}
            </div>
          ))}
          {loading && <div className="chat-message bot">Loading...</div>}
          {error && (
            <div className="chat-message bot" style={{ color: "#FF1744" }}>
              {error}
            </div>
          )}
        </div>

        <div className="chat-input">
          <button className="clear-chat" onClick={clearChat}>Cls</button>
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
