// src/services/goalService.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';

export type GoalStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Goal {
    id: string;
    title: string;
    description: string;
    status: GoalStatus;
    targetDate: string;
    userId: string;
    createdAt: Timestamp;
}

const goalsCollection = collection(db, 'goals');

export const getGoals = async (userId: string): Promise<Goal[]> => {
    const q = query(goalsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const goals: Goal[] = [];
    querySnapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() } as Goal);
    });
    return goals;
};

export const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    try {
        const validGoalData = Object.fromEntries(
            Object.entries(goal).filter(([_, v]) => v !== undefined)
        );

        await addDoc(goalsCollection, {
            ...validGoalData,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding goal: ", error);
        throw error;
    }
};

export const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    const goalDoc = doc(db, 'goals', goalId);
    
    const validUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    try {
        await updateDoc(goalDoc, validUpdates);
    } catch (error) {
        console.error("Error updating goal: ", error);
        throw error;
    }
};

export const deleteGoal = async (goalId: string) => {
    const goalDoc = doc(db, 'goals', goalId);
    try {
        await deleteDoc(goalDoc);
    } catch (error) {
        console.error("Error deleting goal: ", error);
        throw error;
    }
};
