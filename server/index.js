const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/userSchema'); // Corrected import path

// Hardcoded MongoDB URI and Port
const MONGO_URI = process.env.MONGO_URI;
const PORT = 5000;

// Initialize the express app
const app = express();

// Allowed origin
const allowedOrigins = ['https://ai-powered-recipe-chatbot.vercel.app', 'http://localhost:3000', 'http://localhost:5000'];

// Configure CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
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
  url: { type: String, default: '' },
  title: { type: String, default: 'No Title' },
  details: {
    'Prep Time:': { type: Number, default: 0 },
    'Cook Time:': { type: Number, default: 0 },
    'Additional Time:': { type: Number, default: 0 },
    'Total Time:': { type: Number, default: 0 },
    'Servings:': { type: String, default: 'N/A' },
  },
  ingredients: { type: [String], default: [] },
  directions: { type: [String], default: [] },
  nutrition_facts: {
    'Calories': { type: String, default: '0' },
    'Fat': { type: String, default: '0g' },
    'Carbs': { type: String, default: '0g' },
    'Protein': { type: String, default: '0g' },
  },
  author_info: {
    name: { type: String, default: 'N/A' },
    link: { type: String, default: '' },
    bio: { type: String, default: 'N/A' },
  },
  update_date: { type: String, default: 'N/A' },
  tags: { type: [String], default: [] },
  cuisine: { type: String, default: 'N/A' },
  combined_text: { type: String, default: '' },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

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
            { combined_text: { $regex: query, $options: 'i' } }
          ],
        }
      : {};

    const recipes = await Recipe.find(filter).limit(1);
    console.log("Found recipes:", JSON.stringify(recipes, null, 2));
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the AI-Powered Recipe Chatbot API');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Import bcrypt for password hashing (optional, but recommended for security)
const bcrypt = require('bcryptjs');

// API route to register a new user
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ email, password });

    // Optionally hash the password (not done here since you don't want JWT or security)
    // const hashedPassword = await bcrypt.hash(password, 10);
    // user.password = hashedPassword;

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API route to login a user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password matches
    // Here, we're directly comparing the password, but it's recommended to hash and compare in production
    if (user.password !== password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
