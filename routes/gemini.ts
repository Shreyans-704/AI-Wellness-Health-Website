import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleGeminiQuery: RequestHandler = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key missing" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ ONLY THIS MODEL WORKS RELIABLY
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text, query });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({
      error: "Failed to get AI response",
      response: "Something went wrong. Try again.",
    });
  }
};