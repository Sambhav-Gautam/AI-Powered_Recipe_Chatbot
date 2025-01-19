---

### **AI-Powered Recipe Chatbot Project Report**

---

#### **1. Introduction**

This project involves the development of an AI-powered recipe chatbot that provides personalized recipe recommendations based on user input, such as ingredients, titles, or tags. The chatbot interacts with a fully preprocessed recipe database and is implemented with a backend API using Node.js and Express, integrated with a React frontend. Key features include NLP-powered query handling, user authentication, and a recipe favorites system.

---

#### **2. Deliverables Promised**

The following deliverables were initially promised:

- **Fully Preprocessed Recipe Database**: A database of recipes processed for efficient search and retrieval.
- **Web Interface for User Interaction (Frontend and Backend)**: A responsive web interface and backend API for user interaction.
- **NLP-Powered Query Handling**: A system powered by NLP to understand and process user queries.
- **Interactive Ingredient-Based Recipe Chatbot**: A chatbot interface that allows users to search recipes based on ingredients, titles, and tags.

---

#### **3. Deliverables Achieved**

The following objectives were successfully accomplished:

- **Fully Preprocessed Recipe Database**: MongoDB was used to set up a structured database storing details like title, ingredients, directions, and nutrition facts.
- **Web Interface for User Interaction**: A complete web application was developed using React for the frontend and Node.js/Express for the backend, featuring a chatbot, user authentication, and dynamic recipe search.
- **NLP-Powered Query Handling**: Integrated NLP services (via Hugging Face APIs) to classify user intents and extract ingredients or keywords from queries.
- **Interactive Ingredient-Based Recipe Chatbot**: A chatbot interface was created for users to search recipes by ingredients, titles, or tags, with real-time interactions.

---

#### **4. Dataset Used**

The dataset utilized includes various recipe attributes:

- **Title**: The name of the recipe.
- **Ingredients**: A list of ingredients required for the recipe.
- **Directions**: Step-by-step instructions for preparation.
- **Nutrition Facts**: Nutritional details for the recipe.

The dataset was preprocessed for consistency, including normalizing ingredient names and ensuring efficient querying.

---

#### **5. Methodology**

The following steps were employed:

1. **Data Preprocessing**: The dataset was cleaned, and ingredients were normalized by removing non-alphabetic characters and accents.
2. **Database Setup**: MongoDB was used to store recipe data, and Mongoose was used for interaction.
3. **API Development**: The backend was built using Node.js and Express to handle user queries, searches, and authentication.
4. **NLP Integration**: Hugging Face’s BART and DistilBERT models were used for intent classification and keyword extraction.
5. **Frontend Development**: A React-based frontend was developed, including a chatbot to handle user queries and display recipe results.
6. **User Authentication**: A simple authentication system was implemented to allow users to register, log in, and save favorite recipes.
7. **Ingredient Tagging**: A dictionary-based approach was used to tag ingredients with categories (e.g., "vegetable," "spice," "protein"). Ingredients were matched to predefined lists in the tag dictionary, making it easier to filter recipes based on ingredients or categories.

---

#### **6. Results**

- **Recipe Search**: The chatbot accurately retrieves recipes based on ingredients, titles, or tags.
- **NLP Query Handling**: The Hugging Face API effectively classifies intents and extracts relevant keywords.
- **User Features**: Users can register, log in, and save their favorite recipes.
- **Chat History Export**: Users can export their chat history as a PDF for later reference.

---

#### **7. Conclusions**

This project successfully created a functional AI-powered recipe chatbot capable of processing and retrieving recipes based on user queries. The integration of NLP models enhanced the user experience, making query handling more intuitive. Additionally, the system supports user authentication and favorites management, which personalizes recipe search.

---

#### **8. Future Scope**

- **Expanded Recipe Dataset**: Incorporating a larger variety of recipes to enhance chatbot recommendations.
- **Improved NLP Models**: Using more advanced or domain-specific NLP models for better query handling.
- **Dietary Preferences**: Adding filters for dietary restrictions (e.g., vegan, gluten-free) for improved recipe recommendations.
- **Mobile Application**: Developing a mobile version for enhanced accessibility.
- **AI-Driven Cooking Assistant**: Implementing a step-by-step guided cooking assistant to assist users during cooking.

---
