// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Hardcoded MongoDB URI and Port
const MONGO_URI = 'mongodb+srv://recipess:Sambhav@recipe.m78ka.mongodb.net/?retryWrites=true&w=majority&appName=Recipe';
const PORT = 5000;

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
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());  // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define the recipe schema and model
const recipeSchema = new mongoose.Schema({
  title: { type: String, default: 'No Title' },
  ingredients: { type: [String], default: [] },
  directions: { type: [String], default: [] },
  cuisine: { type: String, default: 'N/A' },
});
const Recipe = mongoose.model('Recipe', recipeSchema);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the AI-Powered Recipe Chatbot API');
});

// API route to fetch recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Backend received query:", query);

    const filter = query
      ? {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { ingredients: { $regex: query, $options: 'i' } },
          ],
        }
      : {};

    const recipes = await Recipe.find(filter).limit(5);

    const formattedRecipes = recipes.map(recipe => ({
      title: recipe.title || 'No Title',
      ingredients: recipe.ingredients.length ? recipe.ingredients.join(', ') : 'No Ingredients Found',
      directions: recipe.directions.length ? recipe.directions.slice(0, 3).join(' | ') : 'No Directions Found'
    }));

    console.log("Formatted recipes:", JSON.stringify(formattedRecipes, null, 2));
    res.json(formattedRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
