// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTasks, addTask } from '@/services/taskService';

// To handle a GET request to /api/tasks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  
  try {
    const tasks = await getTasks(userId);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// To handle a POST request to /api/tasks
export async function POST(request: NextRequest) {
    try {
      const task = await request.json();
      await addTask(task);
      return NextResponse.json({ message: 'Task added successfully' }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
    }
}
