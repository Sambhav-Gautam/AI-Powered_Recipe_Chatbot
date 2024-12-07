// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Hardcoded MongoDB URI and Port
const MONGO_URI = 'mongodb+srv://recipess:Sambhav@recipe.m78ka.mongodb.net/?retryWrites=true&w=majority&appName=Recipe';
const PORT = 5000;

// Initialize the express app
const app = express();

// Define allowed origins
const allowedOrigins = [
  'https://ai-powered-recipe-chatbot.vercel.app',
  'http://localhost:3000',
  'https://ai-powered-recipe-chatbot-2u7m.vercel.app',
];

// Configure CORS middleware dynamically
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman/testing) or valid origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow access
    } else {
      callback(new Error('Not allowed by CORS'));  // Deny access
    }
  },
  methods: ['GET', 'POST'],  // Allowed methods
}));
app.use(express.json());  // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  // Exit if MongoDB connection fails
  });

// Define the recipe schema and model
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  cuisine: String,
  dietary: String,
});
const Recipe = mongoose.model('Recipe', recipeSchema);

// API route to fetch recipes based on query
app.get('/api/recipes', async (req, res) => {
  try {
    const { query } = req.query;
    const filter = query
      ? {
          $or: [
            { title: { $regex: query, $options: 'i' } },  // Search by title
            { ingredients: { $regex: query, $options: 'i' } },  // Search by ingredients
          ],
        }
      : {};

    const recipes = await Recipe.find(filter).limit(5);  // Limit to 5 results
    res.json(recipes);  // Send results
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// API route to add a new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisine, dietary } = req.body;

    // Validate required fields
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Title, ingredients, and instructions are required' });
    }

    const newRecipe = new Recipe({ title, ingredients, instructions, cuisine, dietary });
    await newRecipe.save();  // Save new recipe to MongoDB
    res.status(201).json(newRecipe);  // Respond with created recipe
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ message: 'Error adding recipe', error: error.message });
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
