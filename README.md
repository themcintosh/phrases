# Phrase Combinatorics

A web application that generates random phrase combinations and interprets them using AI. API keys are kept secure on the server side using Vercel serverless functions.

## Features

- **Random Phrase Generation**: Uses the random.org API to generate truly random numbers for selecting word combinations
- **AI Interpretation**: Leverages OpenAI's GPT models to provide creative interpretations of the generated phrases
- **Private Word Lists**: Word lists are stored server-side and never exposed to clients
- **Secure API Keys**: API keys are stored securely as environment variables on the server (never exposed to clients)
- **Serverless Architecture**: Runs on Vercel with serverless functions for all API calls

## How It Works

1. **Generate Random Phrase**: Click the button to call a serverless function, which:
   - Uses random.org API to generate two random numbers
   - Selects words from private server-side word lists
   - Returns the complete phrase to display
2. **Interpret with AI**: Click the second button to send the phrase to a serverless function, which calls OpenAI's API for creative interpretation
3. **View Result**: The AI's interpretation is displayed on the page

## Security & Privacy

- ✅ **API keys** are stored securely as environment variables on the server
- ✅ **Word lists** are stored inside serverless functions (never sent to clients)
- ✅ All sensitive operations happen server-side
- ✅ Users cannot see your word combinations or reverse-engineer them

## Deployment to Vercel

### Prerequisites

- A Vercel account (sign up at https://vercel.com)
- An OpenAI API key (get one at https://platform.openai.com/api-keys)
- (Optional) A random.org API key (get one at https://api.random.org/api-keys/beta)

### Step 1: Fork or Clone This Repository

```bash
git clone https://github.com/themcintosh/phrases.git
cd phrases
