const express = require("express");
const axios = require("axios");
const router = express.Router();

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyAu3rZbtPfed9cj6yq-JMRcmx0MI_Kgvg4";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Chat endpoint
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Received chat message:", message);
    console.log(
      "Using API key:",
      GEMINI_API_KEY ? "Key present" : "Key missing"
    );

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Create a context-aware prompt for the shopping assistant
    const systemPrompt = `You are a helpful shopping assistant for a sustainable marketplace platform. You help users find products, answer questions about sustainable shopping, provide recommendations, and assist with general shopping queries. 

Key information about the platform:
- It's a marketplace for pre-owned, sustainable products
- Users can buy and sell secondhand items
- Focus is on circular economy and environmental sustainability
- Categories include electronics, clothing, home goods, books, etc.
- Users can search, filter, and browse products
- There's a cart and wishlist functionality
- Location-based features for local pickup

Please provide helpful, friendly, and concise responses. If asked about specific products, suggest they use the search feature. Keep responses relevant to shopping, sustainability, or the platform features.

User message: ${message}`;

    console.log("Making request to Gemini API...");

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const botResponse =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't process your request. Please try again.";

    res.json({ response: botResponse });
  } catch (error) {
    console.error("Gemini API error details:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("Full error:", error);

    // Fallback response
    const fallbackResponse =
      "I'm experiencing some technical difficulties right now. In the meantime, you can browse our sustainable products using the search feature above or filter by categories. Is there anything specific you're looking for?";

    res.json({ response: fallbackResponse });
  }
});

module.exports = router;
