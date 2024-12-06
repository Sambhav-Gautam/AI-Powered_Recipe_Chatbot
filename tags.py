import json

# Function to read the data from processed_data.json
def load_processed_data(filename="processed_data.json"):
    try:
        with open(filename, "r") as json_file:
            return json.load(json_file)
    except FileNotFoundError:
        print(f"File {filename} not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error decoding JSON from {filename}.")
        return []

# Function to get tags for a given recipe
def get_recipe_tags(ingredients, tags_dict, nutrition_facts):
    # Set to store tags
    tags = set()

    # Check for ingredient-based tags
    for ingredient in ingredients:
        for tag, items in tags_dict.items():
            if any(ingredient.lower() in item.lower() for item in items):
                tags.add(tag)

    # Check for nutritional fact-based tags
    # Iterate over nutrition_facts dictionary (format: "value": "nutrient name")
    for value, nutrient in nutrition_facts.items():
        try:
            # Process numeric values and associate them with tags
            value_float = float(value.replace("g", "").replace("ml", "").replace("mg", "").replace("kcal", ""))
            
            # Handle specific nutrients
            if "protein" in nutrient.lower():
                if value_float > 20:
                    tags.add("high_protein")
                elif value_float < 5:
                    tags.add("low_protein")
            elif "fat" in nutrient.lower():
                if value_float > 20:
                    tags.add("high_fat")
                elif value_float < 5:
                    tags.add("low_fat")
            elif "carbs" in nutrient.lower():
                if value_float > 30:
                    tags.add("high_carbs")
                elif value_float < 10:
                    tags.add("low_carbs")
            elif "calories" in nutrient.lower():
                if value_float > 500:
                    tags.add("high_calories")
                elif value_float < 150:
                    tags.add("low_calories")
        except ValueError:
            pass  # Skip if conversion fails

    return list(tags)

# Function to process the recipes from loaded JSON data and add tags
def process_recipes(recipe_data, tags_dict):
    processed_recipes = []
    for recipe in recipe_data:
        ingredients = recipe.get("ingredients", [])
        nutrition_facts = recipe.get("nutrition_facts", {})
        tags = get_recipe_tags(ingredients, tags_dict, nutrition_facts)
        # Adding tags to the recipe
        recipe["tags"] = tags
        processed_recipes.append(recipe)
    return processed_recipes

# Function to save the processed recipes to a JSON file
def save_to_json(processed_recipes, filename="processed_recipes_with_tags.json"):
    with open(filename, "w") as json_file:
        json.dump(processed_recipes, json_file, indent=4)

# Main function to run the processing
def main():
    # Load processed_data.json
    recipe_data = load_processed_data("processed_data.json")

    # Assuming tags_dict is defined and populated
    tags_dict = {
    "sweet": ["sugar", "honey", "chocolate", "maple syrup", "fruit", "vanilla", "cinnamon", "caramel", "cake", "muffin", "frosting", "sweetener", "brown sugar", "molasses", "agave", "dates", "jam", "syrup", "coconut sugar", "marshmallow", "ice cream", "baked goods"],
    "sour": ["vinegar", "lemon", "lime", "tamarind", "yogurt", "sour cream", "pickles", "cranberry", "pomegranate", "sauerkraut", "grapefruit", "green apple", "buttermilk", "tart cherries", "tamarind paste", "sour plum", "sour cherries"],
    "spicy": ["chili", "pepper", "jalapeno", "hot sauce", "cayenne", "paprika", "ginger", "mustard", "sriracha", "black pepper", "wasabi", "turmeric", "horseradish", "curry", "tabasco", "cayenne pepper", "red pepper flakes", "chili flakes", "chipotle"],
    "salty": ["salt", "soy sauce", "cheese", "fish sauce", "olives", "pickles", "anchovies", "salami", "bacon", "caviar", "miso", "seaweed", "sauerkraut", "feta", "blue cheese", "parmesan", "prosciutto", "brined olives", "salted butter", "prosciutto"],
    "bitter": ["kale", "arugula", "radicchio", "coffee", "dark chocolate", "grapefruit", "mushrooms", "beer", "endive", "mustard greens", "dandelion greens", "cocoa powder", "bitter melon", "radish", "brussels sprouts", "quinine", "hops", "green tea"],
    "vegetarian": ["tofu", "lentils", "beans", "cheese", "vegetables", "quinoa", "spinach", "zucchini", "eggplant", "mushrooms", "peas", "cauliflower", "carrot", "broccoli", "sweet potato", "chard", "cabbage", "avocado", "tempeh", "seitan"],
    "vegan": ["tofu", "lentils", "beans", "vegetables", "fruit", "quinoa", "seitan", "tempeh", "coconut milk", "almond milk", "avocado", "chia seeds", "hemp seeds", "nut butters", "soy milk", "oats", "nutritional yeast", "rice milk", "coconut yogurt", "banana", "mango"],
    "non_veg": ["chicken", "beef", "pork", "fish", "egg", "lamb", "turkey", "duck", "sausage", "shrimp", "crab", "caviar", "goat", "venison", "rabbit", "bison", "octopus", "squid", "mussels", "clams", "crawfish", "oysters", "chorizo"],
    "main_course": ["beef", "chicken", "pork", "fish", "rice", "pasta", "vegetables", "lamb", "turkey", "tofu", "quinoa", "casserole", "stew", "roast", "grilled", "baked", "stir-fry", "pot pie", "burger", "pizza", "lasagna", "curries"],
    "dessert": ["sugar", "chocolate", "fruit", "cream", "butter", "cake", "cookies", "ice cream", "pie", "pudding", "custard", "whipped cream", "brownie", "pastry", "tart", "cheesecake", "gelato", "mousse", "baked goods", "trifle", "caramel", "marzipan"],
    "appetizer": ["cheese", "bread", "salad", "chips", "salsa", "guacamole", "dip", "bruschetta", "olives", "stuffed mushrooms", "spring rolls", "tempura", "meatballs", "crostini", "shrimp cocktail", "cheese platter", "deviled eggs", "spinach dip", "antipasto"],
    "breakfast": ["egg", "bacon", "toast", "pancake", "waffle", "oatmeal", "fruit", "yogurt", "cereal", "muffin", "bagel", "smoothie", "croissant", "granola", "quiche", "scrambled eggs", "avocado toast", "french toast", "sausage", "hash browns"],
    "lunch": ["sandwich", "salad", "soup", "wrap", "quinoa", "rice", "vegetables", "chicken", "cheese", "burger", "pasta", "grilled cheese", "leftovers", "bowl", "pita", "panini", "chili", "roast", "tacos", "noodles", "rice bowl"],
    "dinner": ["steak", "chicken", "rice", "pasta", "vegetables", "fish", "casserole", "soup", "roast", "stew", "pizza", "lasagna", "stir-fry", "risotto", "sushi", "pork chops", "roast chicken", "curry", "bbq", "pot roast", "grilled fish", "tenderloin"],
    "gluten_free": ["rice", "quinoa", "potato", "corn", "almond flour", "coconut flour", "tapioca", "gluten-free bread", "oats", "buckwheat", "chia seeds", "gluten-free pasta", "gluten-free pizza crust", "arrowroot", "amaranth", "sorghum", "teff", "rice noodles", "millet"],
    "dairy_free": ["almond milk", "coconut milk", "soy milk", "tofu", "vegan cheese", "dairy-free butter", "non-dairy yogurt", "coconut cream", "oat milk", "cashew cream", "rice cheese", "coconut yogurt", "almond yogurt", "hazelnut milk", "flax milk", "hemp milk"],
    "keto": ["meat", "cheese", "fish", "eggs", "nuts", "avocado", "butter", "low-carb vegetables", "coconut oil", "almond flour", "olive oil", "bacon", "poultry", "coconut milk", "chia seeds", "cabbage", "zucchini", "broccoli", "asparagus", "spinach", "mushrooms"],
    "paleo": ["meat", "fish", "vegetables", "fruit", "eggs", "nuts", "seeds", "coconut", "olive oil", "root vegetables", "avocado", "coconut milk", "honey", "almond flour", "carrots", "beets", "sweet potatoes", "apples", "berries", "squash", "mango"],
    "whole30": ["meat", "fish", "vegetables", "fruit", "eggs", "olive oil", "coconut oil", "nuts", "seeds", "herbs", "avocado", "sweet potatoes", "almonds", "chia seeds", "coconut flour", "turmeric", "garlic", "lemon", "spinach", "broccoli", "cauliflower"],}

    # Process the recipes with tags
    processed_recipes = process_recipes(recipe_data, tags_dict)

    # Save the processed recipes with tags to a new JSON file
    save_to_json(processed_recipes)

    # Optionally print the processed recipes to check
    for recipe in processed_recipes:
        print(f"Title: {recipe['title']}")
        print(f"Ingredients: {', '.join(recipe['ingredients'])}")
        print(f"Tags: {', '.join(recipe['tags'])}")
        print("="*40)

if __name__ == "__main__":
    main()
