const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/userSchema'); // Corrected import path
const axios = require('axios'); // For calling HuggingFace API
const unidecode = require('unidecode');

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
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));  // Deny access
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Enable preflight requests for all routes
app.options('*', cors());

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

// Function to call HuggingFace API for intent classification
async function classifyIntent(query) {
  const hfApiUrl = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
  const response = await axios.post(
    hfApiUrl,
    {
      inputs: query,
      parameters: { candidate_labels: ["search_by_ingredients", "search_by_title", "search_by_tags"] },
    },
    { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
  );
  return response.data.labels[0]; // Return the highest ranked label (intent)
}

// Function to clean ingredient names (similar to Python's clean_ingredient_name)
function cleanIngredientName(name) {
  // Remove non-alphabetic characters and normalize the name
  return unidecode(name.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase());
}

// Modified extractIngredients function
function extractIngredients(query) {
  const ingredientRegex = /\b(?:apricots|almonds|onion|potatoes|tomato|chicken|beef|carrots|garlic|cucumber|spices|soup|chili|salt|pepper|butter|cheese|cream|flour|egg|bacon|pasta|rice|beans|spinach|lettuce|avocado|olive oil|lemon|pumpkin|zucchini|honey|apple|orange|broccoli|cabbage|parsley|basil|rosemary|thyme|paprika|ginger|cinnamon|turmeric|soy sauce|vinegar|sugar|pomegranate|tuna|fish|beef|pork|lamb|cheddar|mozzarella|sourdough|bread|crust|mushroom)\b/gi;
  
  // Extract raw ingredients using the regular expression
  const rawIngredients = query.match(ingredientRegex) || [];
  
  // Clean the extracted ingredients
  const cleanedIngredients = rawIngredients.map(cleanIngredientName);

  // Return unique ingredients (no duplicates)
  return [...new Set(cleanedIngredients)];
}

// API route for getting recipes based on query
app.get('/api/recipes', async (req, res) => {
  const query = req.query.query;  // Get the query from URL parameter
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    // Call the same logic as in /api/query to process the query
    const response = await axios.post('https://chatbot-one-lac.vercel.app/api/query', { query });
    res.json(response.data);  // Forward the result to the client
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error processing the query' });
  }
});

// API route to fetch recipes based on query
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  try {
    console.log("Backend received query:", query);

    // Classify the intent of the user's query
    const intent = await classifyIntent(query);
    console.log("Classified intent:", intent);

    // Connect to MongoDB
    const recipes = await Recipe.find();

    let searchResults;

    if (intent === "search_by_ingredients") {
      const ingredients = extractIngredients(query);
      console.log("Extracted ingredients:", ingredients);
      searchResults = recipes.filter(recipe => {
        return ingredients.every(ingredient => recipe.ingredients.includes(ingredient));
      });
    } else if (intent === "search_by_title") {
      searchResults = recipes.filter(recipe => recipe.title.toLowerCase().includes(query.toLowerCase()));
    } else if (intent === "search_by_tags") {
      searchResults = recipes.filter(recipe => recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
    }

    // Limit the results to 1 recipe per intent
    searchResults = searchResults.slice(0, 1);  // This limits the array to only the first recipe

    res.json(searchResults); // Send results back to the client
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ message: 'Error processing the query', error: error.message });
  }
});


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the AI-Powered Recipe Chatbot API');
});

// Server setup
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// User routes (register and login)
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


// API route to get user favorites


// Route to add a favorite recipe
app.put('/api/users/favorites', async (req, res) => {
  const { userId, recipe } = req.body;  // Extract userId from the request body
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.favorites.push(recipe);  // Add the recipe to the favorites array
    await user.save();
    res.status(200).json({ message: 'Recipe added to favorites!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add recipe to favorites' });
  }
});



