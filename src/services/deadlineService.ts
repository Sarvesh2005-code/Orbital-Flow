// src/services/deadlineService.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

export interface Deadline {
    id: string;
    title: string;
    date: string;
    userId: string;
}

const deadlinesCollection = collection(db, 'deadlines');

export const getDeadlines = async (userId: string): Promise<Deadline[]> => {
    const q = query(deadlinesCollection, where('userId', '==', userId), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    const deadlines: Deadline[] = [];
    querySnapshot.forEach((doc) => {
        deadlines.push({ id: doc.id, ...doc.data() } as Deadline);
    });
    return deadlines;
};

export const addDeadline = async (deadline: Omit<Deadline, 'id'>) => {
    try {
        await addDoc(deadlinesCollection, {
            ...deadline,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding deadline: ", error);
    }
};

export const deleteDeadline = async (deadlineId: string) => {
    const deadlineDoc = doc(db, 'deadlines', deadlineId);
    try {
        await deleteDoc(deadlineDoc);
    } catch (error) {
        console.error("Error deleting deadline: ", error);
    }
};
