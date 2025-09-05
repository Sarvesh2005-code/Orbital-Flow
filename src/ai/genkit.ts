
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const geminiApiKey = process.env.GOOGLEAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export const ai = genkit({
  plugins: [googleAI({ apiKey: geminiApiKey })],
  model: 'googleai/gemini-1.5-flash',
});
