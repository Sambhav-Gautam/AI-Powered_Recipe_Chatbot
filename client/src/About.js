import React from 'react';
import './About.css';

function About({ handleBack }) {
  return (
    <div className="about-container">
      <button onClick={handleBack} className="back-button">Back to Chat</button>
      <h1>About the AI-Powered Recipe Chatbot</h1>
      <p className="intro">
        The AI-Powered Recipe Chatbot is a cutting-edge web application that recommends personalized recipes based on ingredients, titles, and user preferences. Powered by advanced Natural Language Processing (NLP), it offers a seamless, conversational interface for an engaging experience.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Ingredient-Based Recipe Search</li>
        <li>Title-Based Search</li>
        <li>Dietary & Cuisine Preferences</li>
        <li>Interactive Chat Interface</li>
        <li>Recipe Saving</li>
      </ul>

      <h2>Technologies Used</h2>
      <p>
        <strong>Frontend:</strong> React, Material UI<br />
        <strong>Backend:</strong> Node.js, Express.js<br />
        <strong>Database:</strong> MongoDB<br />
        <strong>NLP Framework:</strong> Rasa/Dialogflow<br />
        <strong>Deployment:</strong> Vercel
      </p>

      <p className="credits">
        Created by <strong>Sambhav Gautam</strong>
      </p>
    </div>
  );
}

export default About;
