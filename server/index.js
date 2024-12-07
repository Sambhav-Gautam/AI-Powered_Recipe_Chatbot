// server/index.js

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
  'https://ai-powered-recipe-chatbot-frontend.vercel.app',
  'https://ai-powered-recipe-chatbot-git-aca66a-sambhavs-projects-6e3ec3d4.vercel.app',
  'https://ai-powered-recipe-chatbot-frontend-sambhavs-projects-6e3ec3d4.vercel.app',
  'https://ai-powered-recipe-chatbot-2u7m.vercel.app',
  'https://ai-powered-recipe-chatbot-eiqv.vercel.app',
];

// Configure CORS middleware dynamically
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow access
    } else {
      callback(new Error('Not allowed by CORS'));  // Deny access
    }
  },
  methods: ['GET', 'POST'],  // Allowed methods
}));

app.use(express.json());  // Parse incoming JSON requests

// Connect to MongoDB using the hardcoded URI
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

    console.log("Backend received query: ", query);  // Log received query

    const filter = query
      ? {
          $or: [
            { title: { $regex: query, $options: 'i' } },  // Search by title
            { ingredients: { $regex: query, $options: 'i' } },  // Search by ingredients
          ],
        }
      : {};

    const recipes = await Recipe.find(filter).limit(5);  // Limit to 5 results

    console.log("Found recipes: ", recipes);  // Log found recipes

    res.json(recipes);  // Send results
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
