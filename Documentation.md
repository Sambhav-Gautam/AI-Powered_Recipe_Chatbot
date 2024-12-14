# Chat.js Component Technical Documentation

## Abstract
The `Chat.js` component serves as the foundational element for a recipe-oriented chatbot application developed using React. It integrates libraries such as Axios for API communications and jsPDF for document generation, facilitating dynamic user interactions, search-based queries, and chat history management.

---

## Contents
1. [Component Imports](#component-imports)
2. [State Management](#state-management)
3. [Lifecycle Management](#lifecycle-management)
4. [Functional Implementations](#functional-implementations)
5. [Event Handling](#event-handling)
6. [Conditional Rendering Logic](#conditional-rendering-logic)
7. [JSX Structure Overview](#jsx-structure-overview)
8. [Component Export](#component-export)

---

## Component Imports
```javascript
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import './Chat.css';
import About from './About';
import { FaUserCircle } from 'react-icons/fa';
```

### Summary
- **React & Hooks:** Facilitate state and lifecycle management.
- **Axios:** Conducts REST API calls.
- **jsPDF:** Enables PDF export functionality.
- **CSS & Icons:** Provides custom styling and iconographic elements.

---

## State Management
```javascript
const [query, setQuery] = useState("");
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [dropdownVisible, setDropdownVisible] = useState(false);
const [showAbout, setShowAbout] = useState(false);
const [confirmDownload, setConfirmDownload] = useState(false);
```

### Purpose and Roles
- **query:** Tracks user input.
- **messages:** Manages chat history.
- **loading:** Monitors API request status.
- **error:** Stores error messages.
- **dropdownVisible:** Controls profile menu visibility.
- **showAbout:** Toggles the About page.
- **confirmDownload:** Confirms user intent for PDF export.

---

## Lifecycle Management
```javascript
useEffect(() => {
  const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
  if (savedMessages) setMessages(savedMessages);
  if (!localStorage.getItem("isLoggedIn")) {
    console.log("User not authenticated, redirecting...");
  }
}, []);

useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem("chatMessages", JSON.stringify(messages.slice(-50)));
  }
}, [messages]);
```

### Functional Intent
- Initializes the chat interface by loading saved messages from local storage.
- Persistently stores the last 50 chat messages upon updates.

---

## Functional Implementations

### searchRecipes()
Retrieves recipes matching user queries.
```javascript
const searchRecipes = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(`https://chatbot-one-lac.vercel.app/api/recipes?query=${query}`);
    const recipes = response.data.map(recipe => ({ ... }));
    setMessages([...messages, 
      { text: `Query: ${query}`, type: "user" },
      { text: formattedRecipes, type: "bot", recipes }
    ]);
  } catch (error) {
    console.error("Recipe fetch error:", error);
    setError("Failed to retrieve recipes.");
  } finally {
    setLoading(false);
  }
};
```

### exportChatAsPDF()
Generates and downloads chat history as a PDF.
```javascript
const exportChatAsPDF = () => {
  if (confirmDownload) {
    const doc = new jsPDF();
    doc.text("Chat History", 20, 20);
    let y = 40;
    messages.forEach(msg => { ... });
    doc.save("chat_history.pdf");
  } else {
    alert("Confirm download?");
    setConfirmDownload(true);
  }
};
```

### handleFavoriteRecipe()
Adds selected recipes to user favorites.
```javascript
const handleFavoriteRecipe = async (recipe) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    alert("Log in to save favorites.");
    return;
  }
  const user = JSON.parse(storedUser);
  const response = await axios.put("https://chatbot-one-lac.vercel.app/api/users/favorites", {
    userId: user._id, recipe
  });
  alert(response.status === 200 ? "Added to favorites!" : "Failed to save recipe.");
};
```

---

## Event Handling
- **handleMessageChange:** Updates query state.
- **handleSendMessage:** Processes user input.
- **clearChat:** Clears message history.
- **toggleDropdown:** Manages profile dropdown visibility.
- **handleLogout:** Logs out the user.
- **handleAbout:** Displays About section.

---

## Conditional Rendering Logic
- **Loading & Errors:** Displays real-time status messages.
- **Dynamic Views:** Renders main chat interface or About page based on state variables.

---

## JSX Structure Overview
```jsx
<div className="chat-container">
  <div className="chat-title">...</div>
  <div className="chat-history">...</div>
  <div className="chat-input">...</div>
</div>
```

---

## Component Export
```javascript
export default Chat;
```

---

This technical documentation comprehensively covers the `Chat.js` component's design, logic, and functional implementation. Suggestions for enhancements are welcome.

