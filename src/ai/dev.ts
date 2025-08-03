import { config } from 'dotenv';
config();

import '@/ai/flows/answer-queries.ts';
import '@/ai/flows/suggest-tasks.ts';
import '@/ai/flows/summarize-notes.ts';