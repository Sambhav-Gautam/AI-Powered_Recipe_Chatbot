const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const recipeSchema = new mongoose.Schema({}, { strict: false }); // Flexible schema
const Recipe = mongoose.model('Recipe', recipeSchema);

async function importData() {
  try {
    const data = JSON.parse(fs.readFileSync('./processed_recipes_with_tags.json', 'utf-8'));
    await Recipe.insertMany(data);
    console.log("Data imported successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error importing data:", error);
    mongoose.disconnect();
  }
}

importData();
