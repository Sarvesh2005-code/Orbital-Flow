// src/services/taskService.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';

export interface Task {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    completed: boolean;
    userId: string;
    dueDate?: string;
    createdAt: Timestamp;
    completedAt?: Timestamp;
}

const tasksCollection = collection(db, 'tasks');

export const getTasks = async (userId: string): Promise<Task[]> => {
    const q = query(tasksCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    return tasks;
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => {
    try {
        await addDoc(tasksCollection, {
            ...task,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding task: ", error);
    }
};

export const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => {
    const taskDoc = doc(db, 'tasks', taskId);
    const updateData: any = { ...updates };
    if (updates.completed === true) {
        updateData.completedAt = serverTimestamp();
    } else if (updates.completed === false) {
        // Firestore does not allow 'undefined' so we have to handle this differently
        // or just let it be. If we want to remove the field, we need a different approach.
        // For now, we'll assume completedAt can stay. To remove it, you'd use `deleteField()`.
    }

    try {
        await updateDoc(taskDoc, updateData);
    } catch (error) {
        console.error("Error updating task: ", error);
    }
};

export const deleteTask = async (taskId: string) => {
    const taskDoc = doc(db, 'tasks', taskId);
    try {
        await deleteDoc(taskDoc);
    } catch (error) {
        console.error("Error deleting task: ", error);
    }
};

// Alias for backward compatibility
export const createTask = addTask;
