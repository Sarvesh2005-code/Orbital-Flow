'use server';

/**
 * @fileOverview An AI agent that answers productivity-related questions.
 *
 * - answerProductivityQueries - A function that answers user queries about their productivity.
 * - AnswerProductivityQueriesInput - The input type for the answerProductivityQueries function.
 * - AnswerProductivityQueriesOutput - The return type for the answerProductivityQueries function.
 */

import {ai} from '@/ai/genkit';
import { getTasks } from '@/services/taskService';
import {z} from 'genkit';

const getTasksTool = ai.defineTool(
    {
      name: 'getTasks',
      description: 'Returns a list of tasks for the current user.',
      inputSchema: z.object({
        userId: z.string().describe('The ID of the user to fetch tasks for.'),
      }),
      outputSchema: z.array(z.object({
        id: z.string(),
        title: z.string(),
        priority: z.string(),
        completed: z.boolean(),
      })),
    },
    async (input) => {
      return await getTasks(input.userId);
    }
  )


const AnswerProductivityQueriesInputSchema = z.object({
  query: z.string().describe('The user query about their productivity.'),
  userId: z.string().describe('The ID of the user making the query.'),
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
  tools: [getTasksTool],
  prompt: `You are a personal productivity assistant. Your goal is to answer questions about the user's productivity.
  If the user asks about their tasks, use the getTasks tool to fetch their tasks and answer based on the result.

  User ID: {{{userId}}}
  Query: {{{query}}}

  Answer the query based on the user's data. Focus on providing actionable insights and summaries.
  If you cannot answer the query based on the given information, please respond that you are unable to answer the query.
  `,
});

const answerProductivityQueriesFlow = ai.defineFlow(
  {
    name: 'answerProductivityQueriesFlow',
    inputSchema: AnswerProductivityQueriesInputSchema,
    outputSchema: AnswerProductivityQueriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
