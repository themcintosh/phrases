// Serverless function to generate random phrases
// Words are stored server-side to keep them private

// Word lists (hidden from clients)
const WORDS = {
  columnA: [
    "Swift",
    "Ancient",
    "Digital",
    "Cosmic",
    "Silent",
    "Golden",
    "Hidden",
    "Electric",
    "Frozen",
    "Endless"
  ],
  columnB: [
    "Mountain",
    "River",
    "Phoenix",
    "Dragon",
    "Garden",
    "Ocean",
    "Forest",
    "Desert",
    "Valley",
    "Storm"
  ]
};

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
    const maxA = WORDS.columnA.length;
    const maxB = WORDS.columnB.length;

    // Get random.org API key from environment variables
    const randomOrgApiKey = process.env.RANDOM_ORG_API_KEY || '00000000-0000-0000-0000-000000000000';

    let randomInts;
    let usingFallback = false;

    try {
      // Call random.org API
      const response = await fetch('https://api.random.org/json-rpc/4/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'generateIntegers',
          params: {
            apiKey: randomOrgApiKey,
            n: 2,
            min: 0,
            max: Math.max(maxA - 1, maxB - 1),
            replacement: true
          },
          id: 1
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      // Get the random integers and ensure they're within bounds
      randomInts = data.result.random.data;
      randomInts[0] = randomInts[0] % maxA;
      randomInts[1] = randomInts[1] % maxB;

    } catch (error) {
      console.error('Random.org API error:', error);
      // Fallback to Math.random if random.org fails
      randomInts = [
        Math.floor(Math.random() * maxA),
        Math.floor(Math.random() * maxB)
      ];
      usingFallback = true;
    }

    // Select words using the random indices
    const wordA = WORDS.columnA[randomInts[0]];
    const wordB = WORDS.columnB[randomInts[1]];
    const phrase = `${wordA} ${wordB}`;

    return res.status(200).json({
      success: true,
      phrase: phrase,
      indices: randomInts,
      fallback: usingFallback
    });

  } catch (error) {
    console.error('Phrase generation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate phrase'
    });
  }
}
