import csv
import re

# Read ingredients from the unique.csv file
ingredients = set()  # Use a set to automatically remove duplicates
file_path = 'AI-Powered_Recipe_Chatbot\\Data\\unique_ingredients.csv'

with open(file_path, 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        if row: 
            ingredients.add(row[1].lower())  # Add ingredient to set, converting to lowercase

# Generate the regex pattern
pattern = r'\b(?:' + '|'.join(map(re.escape, ingredients)) + r')\b'

# Print the generated regex pattern
print(pattern)
