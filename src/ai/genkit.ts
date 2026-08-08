import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Vercel sometimes exposes keys with NEXT_PUBLIC prefix if user adds it that way
const geminiApiKey = 
  process.env.GOOGLEAI_API_KEY || 
  process.env.NEXT_PUBLIC_GOOGLEAI_API_KEY || 
  process.env.GEMINI_API_KEY || 
  process.env.GOOGLE_API_KEY ||
  ''; // Provide empty string to prevent crashing during build if missing

export const ai = genkit({
  plugins: [googleAI({ apiKey: geminiApiKey }) as any],
  model: 'googleai/gemini-1.5-flash',
});
