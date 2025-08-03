'use client';
// src/services/taskService.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

export interface Task {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    completed: boolean;
    userId: string;
    createdAt: any;
    completedAt?: Timestamp;
}

const tasksCollection = collection(db, 'tasks');

export const getTasks = async (userId: string): Promise<Task[]> => {
    const q = query(tasksCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    return tasks;
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
        await addDoc(tasksCollection, {
            ...task,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding task: ", error);
    }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const taskDoc = doc(db, 'tasks', taskId);
    const updateData: Partial<Task> = { ...updates };
    if (updates.completed) {
        updateData.completedAt = Timestamp.now();
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
