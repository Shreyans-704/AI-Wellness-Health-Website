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

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Gemini API key not configured",
        response: "Sorry, the AI service is not available at the moment. Please contact support."
      });
    }

    // Construct health-focused prompt
    const healthPrompt = `You are a helpful health assistant. The user has asked: "${query}". 
    
    Please provide a clear, informative response about their health question. Keep in mind:
    - Provide general health information and guidance
    - Always recommend consulting healthcare professionals for serious concerns
    - Be empathetic and supportive
    - Keep responses concise but comprehensive
    - Include disclaimers when appropriate
    
    Response:`;

    // Safe: don't log key in URL
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`;

    const requestBody = {
      contents: [{
        parts: [{
          text: healthPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      }
    };

    console.log('Calling Gemini API (endpoint only):', url);
    console.log('Request body preview:', JSON.stringify(requestBody).substring(0, 200) + "...");

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      res.json({
        response: aiResponse,
        query: query
      } as GeminiResponse);
    } else {
      throw new Error('Invalid response from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      response: 'Sorry, I was unable to process your health question at the moment. Please try again later or contact our support team for assistance.'
    } as GeminiResponse);
  }
};
