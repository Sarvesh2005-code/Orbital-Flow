'use server';

/**
 * @fileOverview An AI agent that answers productivity-related questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerProductivityQueriesInputSchema = z.object({
  query: z.string().describe('The user query about their productivity.'),
  userId: z.string().describe('The ID of the user making the query.'),
  context: z.string().describe('A JSON string containing the user\'s tasks, habits, goals, and notes.').optional(),
});
export type AnswerProductivityQueriesInput = z.infer<typeof AnswerProductivityQueriesInputSchema>;

const AnswerProductivityQueriesOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type AnswerProductivityQueriesOutput = z.infer<typeof AnswerProductivityQueriesOutputSchema>;

export async function answerProductivityQueries(input: AnswerProductivityQueriesInput): Promise<AnswerProductivityQueriesOutput> {
  return answerProductivityQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerProductivityQueriesPrompt',
  input: {schema: AnswerProductivityQueriesInputSchema},
  output: {schema: AnswerProductivityQueriesOutputSchema},
  prompt: `You are an intelligent productivity assistant for Orbital Flow, a comprehensive productivity platform. Your role is to help users understand and optimize their productivity by analyzing their tasks, habits, notes, and goals.

**User Context Data:**
{{{context}}}

**User Query:**
{{{query}}}

**Instructions:**
1. Analyze the user's query and the provided context data to answer it accurately.
2. Provide insightful, actionable responses based on the data.
3. Focus on productivity insights, patterns, and recommendations.
4. Be conversational, helpful, and encouraging.
5. If data shows concerning patterns (like many overdue tasks), offer constructive advice.
6. Celebrate achievements and progress.
7. Suggest specific actions when appropriate.

**Response Style:**
- Use emojis sparingly but appropriately (📅 for deadlines, ✅ for completed items, 🎯 for goals, etc.)
- Be concise but comprehensive
- Offer specific, actionable advice
- Reference specific tasks, habits, or goals by name when relevant
- Maintain a positive, supportive tone

Analyze the query and provide a helpful response based on the user's actual productivity data.
  `,
});

const answerProductivityQueriesFlow = ai.defineFlow(
  {
    name: 'answerProductivityQueriesFlow',
    inputSchema: AnswerProductivityQueriesInputSchema,
    outputSchema: AnswerProductivityQueriesOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e: any) {
      console.error('AI Flow Error:', e);
      return { answer: `API_ERROR: ${e.message || String(e)}` };
    }
  }
);
