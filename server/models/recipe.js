const mongoose = require('mongoose');

// Define your Mongoose Schema
const recipeSchema = new mongoose.Schema({
  id: Number,
  url: String,
  title: String,
  details: {
    prepTime: Number, // Note: details contain prep, cook, total time etc.
    cookTime: Number,
    totalTime: Number,
    servings: String,
    yield: String
  },
  ingredients: [String], // Array of ingredients
  directions: [String], // Array of directions
  nutrition_facts: {
    calories: String,
    fat: String,
    carbs: String,
    protein: String
  },
  author_info: {
    name: String,
    link: String,
    bio: String
  },
  update_date: String,
  tags: [String], // Array of tags
  cuisine: String,
  combined_text: String // This is a combined string for full recipe text
});

// Create the model based on the schema
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
