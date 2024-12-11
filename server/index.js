const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Initialize the express app
const app = express();

// Allowed origin
const allowedOrigin = 'https://ai-powered-recipe-chatbot.vercel.app';

// Configure CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);  // Allow access
    } else {
      callback(new Error('Not allowed by CORS'));  // Deny access
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],  // Allow all methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow all necessary headers
  credentials: true,  // Allow cookies and headers
}));

// Handle preflight (OPTIONS) requests globally
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);  // Respond to preflight request
});

app.use(express.json());  // Parse incoming JSON requests

// Load recipes from JSON file
let recipes = [];
try {
  const data = fs.readFileSync('processed_recipes_with_tags.json', 'utf8');
  recipes = JSON.parse(data);
  console.log('Recipes loaded successfully');
} catch (error) {
  console.error('Error loading recipes:', error);
  process.exit(1);  // Exit if loading fails
}

// API route to fetch recipes based on query
app.get('/api/recipes', (req, res) => {
  try {
    const { query } = req.query;

    console.log("Backend received query: ", query);  // Log received query

    const filteredRecipes = query
      ? recipes.filter(recipe =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.ingredients.some(ingredient =>
            ingredient.toLowerCase().includes(query.toLowerCase())
          )
        )
      : recipes;

    const limitedRecipes = filteredRecipes.slice(0, 5);  // Limit to 5 results

    console.log("Found recipes: ", limitedRecipes);  // Log found recipes

    res.json(limitedRecipes);  // Send results
  } catch (error) {
    console.error('Error fetching recipes:', error);  // Log error if any
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// Root route for server status
app.get('/', (req, res) => {
  res.send('AI Recipe Chatbot Backend is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
