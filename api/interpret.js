// Serverless function to interpret phrases using OpenAI
// This keeps the OpenAI API key private

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phrase } = req.body;

    if (!phrase) {
      return res.status(400).json({ error: 'Phrase is required' });
    }

    // Get OpenAI API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return res.status(500).json({
        error: 'OpenAI API key not configured on server'
      });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative interpreter of phrase combinations. Provide interesting, thoughtful interpretations of the phrases given to you. Keep your response to 2-3 sentences.'
          },
          {
            role: 'user',
            content: `Interpret this phrase combination: "${phrase}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.choices[0].message.content.trim();

    return res.status(200).json({
      success: true,
      interpretation: interpretation
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to interpret phrase'
    });
  }
}
