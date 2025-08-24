exports.handler = async (event, context) => {
  console.log('Function invoked:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    hasBody: !!event.body
  });

  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling CORS preflight request');
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
    console.log('Method not allowed:', event.httpMethod);
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
    console.log('Processing POST request');
    console.log('Request body:', event.body);
    
    const { query } = JSON.parse(event.body || '{}');
    console.log('Parsed query:', query);

    if (!query || query.trim().length === 0) {
      console.log('Empty query provided');
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
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('GEMINI')),
      nodeEnv: process.env.NODE_ENV,
      context: context.clientContext
    });

    if (!apiKey) {
      console.error('API key not found in environment');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: "Gemini API key not configured",
          response: "Sorry, the AI service is not available at the moment. Please contact support.",
          debug: `Env keys: ${Object.keys(process.env).filter(k => k.includes('GEMINI')).join(', ')}. All keys: ${Object.keys(process.env).length}`
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

    console.log('Making request to Gemini API');
    console.log('Request URL:', url);

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Gemini API response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: `Gemini API error: ${response.status}`,
          response: 'Sorry, the AI service encountered an error. Please try again later.',
          debug: errorText.substring(0, 200) // First 200 chars of error
        }),
      };
    }

    const data = await response.json();
    console.log('Gemini API response data:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      console.log('Successfully extracted AI response');
      
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
      console.error('Invalid response structure from Gemini API');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Invalid response from Gemini API',
          response: 'Sorry, received an unexpected response format from the AI service.',
          debug: JSON.stringify(data).substring(0, 200)
        }),
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to get AI response',
        response: 'Sorry, I was unable to process your health question at the moment. Please try again later or contact our support team for assistance.',
        debug: error.message
      }),
    };
  }
};