from transformers import pipeline
import json
import re
import spacy
import pandas as pd
import ijson
from unidecode import unidecode

# Load SpaCy NER model
nlp = spacy.load("en_core_web_sm")

# Load Hugging Face text classification pipeline
classifier = pipeline("text-classification", model="distilbert-base-uncased", return_all_scores=True)

# Define file paths
input_file = 'data.json'
output_file = 'processed_data.json'
ingredients_csv = 'unique_ingredients.csv'

# Function to convert time strings to minutes
def time_to_minutes(time_str):
    if not time_str:
        return 0
    time_mapping = {"day": 1440, "hour": 60, "minute": 1}
    total_minutes = 0
    for part in re.findall(r'(\d+)\s*(day|hour|minute)', time_str.lower()):
        value, unit = int(part[0]), part[1]
        total_minutes += value * time_mapping.get(unit, 0)
    return total_minutes

# Function to clean ingredient names
def clean_ingredient_name(name):
    cleaned_name = re.sub(r'[^a-zA-Z\s]', '', name)  # Keep only letters and spaces
    return unidecode(cleaned_name).strip().lower()

# Function to extract key ingredients
def extract_key_ingredients(ingredients):
    unique_ingredients = set()
    for ingredient_phrase in ingredients:
        doc = nlp(ingredient_phrase)
        ingredient_parts = [
            token.text.lower()
            for token in doc
            if token.pos_ in ['NOUN', 'PROPN'] and not token.text.isdigit()
        ]
        non_keywords = {
            'cups', 'cup', 'tablespoons', 'tablespoon', 'teaspoons', 'teaspoon',
            'optional', 'packed', 'all-purpose', 'inch', 'pie', 'shell',
            'divided', 'smoke', 'chopped', 'roast', 'sliced', 'crushed',
            'powder', 'pieces', 'taste', 'packet', 'chuck', ')', ',', '(',
            'thinly'
        }
        filtered_ingredients = [
            clean_ingredient_name(word)
            for word in ingredient_parts if word not in non_keywords
        ]
        if filtered_ingredients:
            unique_ingredients.add(filtered_ingredients[-1])  # Take the last word as the main ingredient
    return list(unique_ingredients)

# Function to predict tags using a pre-trained model
def predict_tags(text):
    # Use Hugging Face classifier to predict tags
    predictions = classifier(text)
    # Extract labels with scores above a threshold
    threshold = 0.5
    tags = [pred["label"] for pred in predictions[0] if pred["score"] > threshold]
    return tags

# Main preprocessing function
def preprocess_data(input_file, output_file, ingredients_csv):
    unique_ingredients_set = set()
    processed_data = []
    ids_seen = set()

    # Parse the large JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        recipes = ijson.items(f, 'item')

        for recipe in recipes:
            try:
                recipe_id = recipe.get("id")
                if recipe_id in ids_seen:
                    continue
                ids_seen.add(recipe_id)

                # Extract ingredients and preprocess them
                raw_ingredients = recipe.get('ingredients', [])
                key_ingredients = extract_key_ingredients(raw_ingredients)
                unique_ingredients_set.update((recipe_id, ingr) for ingr in key_ingredients)
                recipe['ingredients'] = key_ingredients

                # Convert time fields
                details = recipe.get('details', {})
                for time_key in ["Prep Time:", "Cook Time:", "Additional Time:", "Total Time:"]:
                    if time_key in details:
                        details[time_key] = time_to_minutes(details[time_key])

                # Predict tags using the title, ingredients, and directions
                combined_text = f"{recipe['title']} {' '.join(key_ingredients)} {' '.join(recipe.get('directions', []))}"
                predicted_tags = predict_tags(combined_text)
                recipe['tags'] = predicted_tags

                # Assign a cuisine tag based on ingredients or title
                recipe['cuisine'] = "French" if "bourguignon" in recipe['title'].lower() else "American"

                # Combine text fields for downstream tasks
                recipe['combined_text'] = combined_text
                processed_data.append(recipe)

            except Exception as e:
                print(f"Error processing recipe {recipe.get('id', 'unknown')}: {e}")

    # Save processed recipes
    with open(output_file, 'w', encoding='utf-8') as outfile:
        json.dump(processed_data, outfile, indent=4)

    # Save unique ingredients to CSV
    ingredients_df = pd.DataFrame(
        list(unique_ingredients_set), columns=["Recipe ID", "Ingredient"]
    ).drop_duplicates()
    ingredients_df.to_csv(ingredients_csv, index=False)
    print(f"Data preprocessing complete. Processed data saved to {output_file} and ingredients saved to {ingredients_csv}.")

# Run the preprocessing
preprocess_data(input_file, output_file, ingredients_csv)
