// server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allows your website to make requests to this server
app.use(express.json()); // Allows the server to understand JSON data

// IMPORTANT: Get your API key from an environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("AIzaSyAFTp3ZgpR4-eiytjBp8AVFwo7VynmJOGo environment variable is not set.");
}

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Change it to this:
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
const chat = model.startChat();

// Define the /chat endpoint
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        res.json({ reply: text });
    } catch (error) {
        console.error("Error with Gemini API:", error);
        res.status(500).json({ error: 'Failed to get response from AI' });
    }
});

app.listen(port, () => {
    console.log(`Chatbot server listening on http://localhost:${port}`);
});