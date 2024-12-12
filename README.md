# AI-Powered Recipe Chatbot for Ingredient/Title-Based Retrieval
*(Under Development - Batman Theme)*

## Overview

The **AI-Powered Recipe Chatbot** is a smart web application designed to recommend recipes based on ingredients, titles, dietary needs, and cuisine preferences. By leveraging Natural Language Processing (NLP), this chatbot allows users to easily query a vast collection of recipes with a conversational interface. It includes a fully preprocessed recipe database, a responsive web interface, and advanced query handling to ensure a smooth and personalized user experience.

---

## Table of Contents

- [Project Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Deliverables](#deliverables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [License](#license)

---

## Technologies Used

- **Frontend**: 
  - React (MERN stack)
  - HTML5, CSS3, JavaScript
  - Material UI for design components
- **Backend**: 
  - Node.js
  - Express.js (API layer)
- **Database**: 
  - MongoDB (For storing recipes and user data)
- **NLP Framework**:
  - Rasa/Dialogflow (For NLP and query handling)
- **AI Models**:
  - Custom recipe recommendation models (For ingredient-based recipe retrieval)
- **Authentication**: 
  - JWT for secure login/signup
- **Hosting/Deployment**: 
  - Vercel for deployment

---

## Features

- **Ingredient-Based Recipe Search**: 
  - Users can input a list of available ingredients, and the chatbot suggests recipes that can be made with those ingredients.
- **Title-Based Search**: 
  - Users can search for recipes by title or keywords.
- **Dietary & Cuisine Preferences**: 
  - Personalized recipe recommendations based on dietary needs (e.g., vegetarian, gluten-free) and cuisine preferences.
- **Interactive Chat Interface**: 
  - A conversational interface where users can interact with the chatbot, asking for recipe suggestions or filtering by various parameters.
- **Responsive Web Interface**: 
  - Optimized for both desktop and mobile devices, providing a seamless user experience.
- **Recipe Saving**: 
  - Users can save their favorite recipes to their profile for easy access.

---

## Deliverables

- **Fully Preprocessed Recipe Database**: 
  - A structured and clean dataset containing recipes categorized by ingredients, cuisine, and dietary tags.
- **Web Interface (Frontend & Backend)**: 
  - A responsive and user-friendly web interface that enables users to interact with the chatbot and retrieve recipe suggestions.
- **NLP-Powered Query Handling**: 
  - Integration of Rasa/Dialogflow for intelligent query handling and user interaction.
- **Interactive Recipe Chatbot**: 
  - A dynamic chatbot capable of understanding and responding to ingredient/title-based queries with personalized recipe suggestions.

---

## Getting Started

To get started with the AI-Powered Recipe Chatbot, follow the steps below:

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v14 or higher)
- **MongoDB** (for local development, or use MongoDB Atlas for a cloud database)
- **React** (for frontend development)
- **Rasa/Dialogflow** (for NLP framework)

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/AI-Powered-Recipe-Chatbot.git
cd AI-Powered-Recipe-Chatbot
```

2. **Install dependencies for both frontend and backend**:

- Frontend:
  ```bash
  cd frontend
  npm install
  ```

- Backend:
  ```bash
  cd backend
  npm install
  ```

3. **Set up environment variables** (for database and API keys):
   - Create a `.env` file in the `backend` directory and add necessary keys:
     ```bash
     MONGO_URI=your_mongo_database_uri
     ```

4. **Run the backend server**:
   ```bash
   cd backend
   node index.js
   ```

5. **Run the frontend server**:
   ```bash
   cd frontend
   npm start
   ```

The application should now be live at `http://localhost:3000` (or another specified port).

---

## Usage

Once the application is running:

- Open the web interface in your browser.
- You can input a list of ingredients or recipe title in the chatbot interface.
- The chatbot will respond with personalized recipe suggestions based on your input.

---

## Folder Structure

```bash
AI-Powered-Recipe-Chatbot/
├── backend/                # Backend code (API, NLP)
│   ├── controllers/        # API controllers for recipe retrieval and user management
│   ├── models/             # MongoDB models for recipes and users
│   ├── routes/             # Routes for API endpoints
│   ├── index.js           # Main server file
│   └── .env                # Environment variables
│
├── frontend/               # Frontend code (React)
│   ├── public/             # Static assets (images, etc.)
│   ├── src/                # Source code for React components
│   ├── src/App.js              # Main React component
│   └── package.json        # Frontend dependencies
│
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Sambhav-Gautam/AI-Powered_Recipe_Chatbot?tab=MIT-1-ov-file) file for details.

---

**Best Regards,  
Sambhav Gautam**  
*(Creator of the AI-Powered Recipe Chatbot)*
