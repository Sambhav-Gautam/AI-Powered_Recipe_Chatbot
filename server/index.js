// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // To load environment variables

// Use environment variables for sensitive data like the MongoDB URI
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;  // Port from environment or default to 5000

const app = express();

// Define allowed origins in a more manageable way
const allowedOrigins = [
  'https://ai-powered-recipe-chatbot.vercel.app',
  'https://ai-powered-recipe-chatbot-frontend.vercel.app',
  'https://ai-powered-recipe-chatbot-git-aca66a-sambhavs-projects-6e3ec3d4.vercel.app',
  'https://ai-powered-recipe-chatbot-frontend-sambhavs-projects-6e3ec3d4.vercel.app',
  'https://ai-powered-recipe-chatbot-2u7m.vercel.app',
  'https://ai-powered-recipe-chatbot-eiqv.vercel.app',
];

// Configure CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  cuisine: String,
  dietary: String,
});
const Recipe = mongoose.model('Recipe', recipeSchema);

// API route to fetch recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const { query } = req.query;
    const filter = query ? {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { ingredients: { $regex: query, $options: 'i' } },
      ],
    } : {};

    const recipes = await Recipe.find(filter).limit(5);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// API route to add a new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisine, dietary } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Title, ingredients, and instructions are required' });
    }

    const newRecipe = new Recipe({ title, ingredients, instructions, cuisine, dietary });
    await newRecipe.save();
    res.status(201).json(newRecipe);
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
