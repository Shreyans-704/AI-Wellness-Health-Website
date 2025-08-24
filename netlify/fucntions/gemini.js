exports.handler = async (event, context) => {
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { query } = JSON.parse(event.body || '{}');

    if (!query || query.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: "Query is required",
          response: ""
        }),
      };
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('GEMINI'))
    });

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: "Gemini API key not configured",
          response: "Sorry, the AI service is not available at the moment. Please contact support.",
          debug: `Env keys: ${Object.keys(process.env).filter(k => k.includes('GEMINI')).join(', ')}`
        }),
      };
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

    console.log('Calling Gemini API from Netlify function');

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
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          response: aiResponse,
          query: query
        }),
      };
    } else {
      throw new Error('Invalid response from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to get AI response',
        response: 'Sorry, I was unable to process your health question at the moment. Please try again later or contact our support team for assistance.'
      }),
    };
  }
};
