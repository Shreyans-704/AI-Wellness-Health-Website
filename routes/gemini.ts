import { RequestHandler } from "express";

interface GeminiRequest {
  query: string;
}

interface GeminiResponse {
  response: string;
  error?: string;
}

export const handleGeminiQuery: RequestHandler = async (req, res) => {
  try {
    const { query }: GeminiRequest = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        error: "Query is required",
        response: ""
      });
    }

    // Get API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: "Gemini API key not configured",
        response: "AI service is not available right now."
      });
    }

    // Prompt
    const healthPrompt = `You are an AI Health Assistant.

Respond based on user's query complexity:

- Short query → short answer (2–4 lines)
- Detailed query → structured detailed answer

Keep tone simple, helpful, and safe.

User Question: "${query}"
`;

    // ✅ CORRECT MODEL - gemini-1.5-flash-latest works with v1beta
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: healthPrompt
            }
          ]
        }
      ]
    };

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error("Gemini API failed");
    }

    const data = await response.json();

    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({
      response: aiResponse,
      query
    } as GeminiResponse);

  } catch (error) {
    console.error("Gemini API error:", error);

    res.status(500).json({
      error: "Failed to get AI response",
      response: "Something went wrong. Please try again."
    } as GeminiResponse);
  }
};