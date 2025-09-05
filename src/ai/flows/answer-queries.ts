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
import { getHabits } from '@/services/habitService';
import { getNotes } from '@/services/noteService';
import { getGoals } from '@/services/goalService';
import {z} from 'genkit';

const getTasksTool = ai.defineTool(
    {
      name: 'getTasks',
      description: 'Returns a comprehensive list of tasks for the current user with detailed information.',
      inputSchema: z.object({
        userId: z.string().describe('The ID of the user to fetch tasks for.'),
      }),
      outputSchema: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        priority: z.enum(['High', 'Medium', 'Low']),
        completed: z.boolean(),
        dueDate: z.string().optional(),
        createdAt: z.string(),
        completedAt: z.string().optional(),
        category: z.string().optional(),
      })),
    },
    async (input) => {
      try {
        const tasks = await getTasks(input.userId);
        return tasks.map(task => ({
          ...task,
          createdAt: task.createdAt?.seconds ? new Date(task.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
          completedAt: task.completedAt?.seconds ? new Date(task.completedAt.seconds * 1000).toISOString() : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  )

const getHabitsTool = ai.defineTool(
    {
      name: 'getHabits',
      description: 'Returns a list of habits and their completion status for the current user.',
      inputSchema: z.object({
        userId: z.string().describe('The ID of the user to fetch habits for.'),
      }),
      outputSchema: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        streak: z.number(),
        completedToday: z.boolean(),
        category: z.string().optional(),
      })),
    },
    async (input) => {
      try {
        return await getHabits(input.userId);
      } catch (error) {
        console.error('Error fetching habits:', error);
        return [];
      }
    }
  )

const getNotesTool = ai.defineTool(
    {
      name: 'getNotes',
      description: 'Returns a list of notes for the current user.',
      inputSchema: z.object({
        userId: z.string().describe('The ID of the user to fetch notes for.'),
      }),
      outputSchema: z.array(z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        category: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })),
    },
    async (input) => {
      try {
        const notes = await getNotes(input.userId);
        return notes.map(note => ({
          ...note,
          createdAt: note.createdAt?.seconds ? new Date(note.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
          updatedAt: note.updatedAt?.seconds ? new Date(note.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
      }
    }
  )

const getGoalsTool = ai.defineTool(
    {
      name: 'getGoals',
      description: 'Returns a list of goals and their progress for the current user.',
      inputSchema: z.object({
        userId: z.string().describe('The ID of the user to fetch goals for.'),
      }),
      outputSchema: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        progress: z.number(),
        target: z.number(),
        deadline: z.string().optional(),
        category: z.string().optional(),
      })),
    },
    async (input) => {
      try {
        const goals = await getGoals(input.userId);
        return goals.map(goal => ({
          ...goal,
          deadline: goal.deadline ? new Date(goal.deadline).toISOString() : undefined,
        }));
      } catch (error) {
        console.error('Error fetching goals:', error);
        return [];
      }
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
  tools: [getTasksTool, getHabitsTool, getNotesTool, getGoalsTool],
  prompt: `You are an intelligent productivity assistant for Orbital Flow, a comprehensive productivity platform. Your role is to help users understand and optimize their productivity by analyzing their tasks, habits, notes, and goals.

**Available Tools:**
- getTasks: Fetch user's tasks with priorities, due dates, and completion status
- getHabits: Get user's habits with streaks and daily completion
- getNotes: Access user's notes and content
- getGoals: Retrieve user's goals with progress tracking

**User Context:**
User ID: {{{userId}}}
Query: {{{query}}}

**Instructions:**
1. Analyze the user's query to determine which data sources are relevant
2. Use appropriate tools to fetch the user's data
3. Provide insightful, actionable responses based on the data
4. Focus on productivity insights, patterns, and recommendations
5. Be conversational, helpful, and encouraging
6. If data shows concerning patterns (like many overdue tasks), offer constructive advice
7. Celebrate achievements and progress
8. Suggest specific actions when appropriate

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
    const {output} = await prompt(input);
    return output!;
  }
);
