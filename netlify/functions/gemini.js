const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  console.log('Gemini function invoked:', { method: event.httpMethod });

  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { query } = JSON.parse(event.body || '{}');

    if (!query || query.trim().length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: "Query is required", response: "" }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: "API key missing", response: "AI service unavailable" }),
      };
    }

    // Use AI Studio-compatible model/endpoint
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [{ text: query }],
        },
      ],
    };

    const aiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const aiJson = await aiRes.json();

    if (!aiRes.ok) {
      throw new Error(JSON.stringify(aiJson));
    }

    const text =
      aiJson?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ response: text, query }),
    };

  } catch (error) {
    console.error('Gemini error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: "AI failed",
        response: error?.message || "Try again later",
        details: error?.stack || String(error),
      }),
    };
  }
};