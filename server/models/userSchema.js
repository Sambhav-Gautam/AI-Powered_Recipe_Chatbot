// user.js (Updated schema for favorites)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ 
    title: String,
    ingredients: String,
    details: String,
    directions: String,
    url: String,
    nutritionFacts: String,
    tags: String
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
