// src/services/habitService.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export type HabitIcon = 'Dumbbell' | 'BookOpen' | 'GlassWater' | 'BrainCircuit';

export interface Habit {
    id: string;
    name: string;
    icon: HabitIcon;
    streak: number;
    lastCompleted: string | null;
    userId: string;
}

const habitsCollection = collection(db, 'habits');

export const getHabits = async (userId: string): Promise<Habit[]> => {
    const q = query(habitsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const habits: Habit[] = [];
    querySnapshot.forEach((doc) => {
        habits.push({ id: doc.id, ...doc.data() } as Habit);
    });
    return habits;
};

export const addHabit = async (habit: Omit<Habit, 'id'>) => {
    try {
        await addDoc(habitsCollection, {
            ...habit,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding habit: ", error);
    }
};

export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    const habitDoc = doc(db, 'habits', habitId);
    try {
        await updateDoc(habitDoc, updates);
    } catch (error) {
        console.error("Error updating habit: ", error);
    }
};

export const deleteHabit = async (habitId: string) => {
    const habitDoc = doc(db, 'habits', habitId);
    try {
        await deleteDoc(habitDoc);
    } catch (error) {
        console.error("Error deleting habit: ", error);
    }
};
