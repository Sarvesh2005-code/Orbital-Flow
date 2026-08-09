// src/services/taskService.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';

export interface Task {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    completed: boolean;
    status?: 'todo' | 'in-progress' | 'done';
    order?: number;
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
        // Firestore rejects undefined values, so we filter them out
        const validTaskData = Object.fromEntries(
            Object.entries(task).filter(([_, v]) => v !== undefined)
        );

        await addDoc(tasksCollection, {
            ...validTaskData,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding task: ", error);
        throw error;
    }
};

export const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => {
    const taskDoc = doc(db, 'tasks', taskId);
    
    // Filter out undefined values
    const validUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    
    const updateData: any = { ...validUpdates };
    
    if (updates.completed === true) {
        updateData.completedAt = serverTimestamp();
    }

    try {
        await updateDoc(taskDoc, updateData);
    } catch (error) {
        console.error("Error updating task: ", error);
        throw error;
    }
};

export const deleteTask = async (taskId: string) => {
    const taskDoc = doc(db, 'tasks', taskId);
    try {
        await deleteDoc(taskDoc);
    } catch (error) {
        console.error("Error deleting task: ", error);
        throw error;
    }
};

// Alias for backward compatibility
export const createTask = addTask;
