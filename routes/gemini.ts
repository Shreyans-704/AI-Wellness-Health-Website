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

    // Construct adaptive health-focused prompt based on query complexity
    const healthPrompt = `You are an AI Health Assistant.

Your response style must adapt based on the user's input:

1. If the user input is short, simple, or casual (e.g., "hi", "fever?", "headache"), 
   → respond in a short, friendly, and concise way (2–4 lines maximum).
   → avoid long explanations, sections, or formatting.

2. If the user asks a detailed or complex question, 
   → provide a structured, detailed response with headings, explanations, and helpful insights.

3. Always maintain a polite, supportive, and easy-to-understand tone.

4. Avoid overwhelming the user with unnecessary information unless asked.

5. Only include disclaimers when the query is serious or medical-related. 
   Do NOT include long disclaimers for casual greetings or simple questions.

6. Never provide diagnosis or prescriptions. Keep responses informational.

Examples for reference:

User: "hi"
→ "Hello! How can I help you with your health today?"

User: "fever"
→ "A fever is usually a sign your body is fighting an infection. Are you experiencing any other symptoms?"

User: "Explain diabetes in detail"
→ Provide a structured, detailed explanation with sections.

Your goal is to match the user's intent and keep responses appropriately sized.

---

User Question: "${query}"

Please respond appropriately based on the complexity and length of the question above.`;

    // Safe: don't log key in URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

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
        maxOutputTokens: 2000,
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
