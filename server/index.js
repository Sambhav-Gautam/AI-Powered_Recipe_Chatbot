// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Environment variables (hardcoded for this example)
const MONGO_URI = 'mongodb+srv://recipess:Sambhav@recipe.m78ka.mongodb.net/?retryWrites=true&w=majority&appName=Recipe';
const PORT = process.env.PORT || 5000;

// Initialize the express app
const app = express();

// Middleware for CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: 'https://ai-powered-recipe-chatbot-2u7m.vercel.app/', // Only allow requests from the frontend at localhost:3000
  methods: ['GET', 'POST'], // Allowed HTTP methods
}));
app.use(express.json()); // Parse incoming JSON requests

// Validate environment variables
if (!MONGO_URI) {
  console.error('MONGO_URI is not defined.');
  process.exit(1); // Exit if MONGO_URI is not set
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB')) // Success
  .catch((err) => {
    console.log('Error connecting to MongoDB: ', err); // Error in case of failure
    process.exit(1); // Exit if MongoDB connection fails
  });

// Define the recipe schema for MongoDB
const recipeSchema = new mongoose.Schema({
  title: String, // Recipe title
  ingredients: [String], // List of ingredients
  instructions: String, // Recipe instructions
  cuisine: String, // Type of cuisine (e.g., Italian, Indian)
  dietary: String, // Dietary preferences (e.g., Vegan, Gluten-Free)
});

// Create a model for the recipe schema
const Recipe = mongoose.model('Recipe', recipeSchema);

// API route to fetch recipes based on search query (title or ingredients)
app.get('/api/recipes', async (req, res) => {
  try {
    const { query } = req.query; // Extract search query from the request
    let filter = {}; // Filter object to search in the database
    
    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Case-insensitive search by title
          { ingredients: { $regex: query, $options: 'i' } }, // Case-insensitive search by ingredients
        ],
      };
    }

    // Fetch matching recipes with a limit of 5
    const recipes = await Recipe.find(filter).limit(5); // Limit to 5 recipes
    res.json(recipes); // Respond with the list of recipes
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// API route to add a new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisine, dietary } = req.body; // Extract recipe details from request body
    
    // Validate that required fields are provided
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Title, ingredients, and instructions are required' });
    }

    const newRecipe = new Recipe({ title, ingredients, instructions, cuisine, dietary });
    await newRecipe.save(); // Save the new recipe to the database
    res.status(201).json(newRecipe); // Respond with the created recipe
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ message: 'Error adding recipe', error: error.message });
  }
});

// Sample route to check if the server is running
app.get('/', (req, res) => {
  res.send('AI Recipe Chatbot Backend is running!');
});

// Error handling middleware (catch all errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Set up the server to listen on a port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
