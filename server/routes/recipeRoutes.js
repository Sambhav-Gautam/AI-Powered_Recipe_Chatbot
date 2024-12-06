const Recipe = require('../models/Recipe'); // Add your model file

router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Fetch all recipes
    res.json(recipes);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
