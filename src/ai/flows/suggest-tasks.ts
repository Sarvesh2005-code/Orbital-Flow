'use server';

/**
 * @fileOverview Suggests tasks based on user's calendar events and goals.
 *
 * - suggestTasks - A function that suggests tasks based on context.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  calendarEvents: z.string().describe('Current calendar events of the user.'),
  goals: z.string().describe('Current goals of the user.'),
});

export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.object({
  suggestedTasks: z.string().describe('Suggested tasks based on the provided context.'),
});

export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are an AI assistant designed to suggest tasks to users based on their current calendar events and goals.

  Calendar Events: {{{calendarEvents}}}
  Goals: {{{goals}}}

  Based on the provided information, suggest a list of tasks that the user should consider.
  Tasks must be concise and actionable.
  Return the suggested tasks as a string.
  `,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
