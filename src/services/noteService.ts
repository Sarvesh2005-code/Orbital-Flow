// src/services/noteService.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, orderBy, Timestamp } from 'firebase/firestore';

export interface Note {
    id: string;
    title: string;
    content: string;
    userId: string;
    createdAt: Timestamp;
}

const notesCollection = collection(db, 'notes');

export const getNotes = async (userId: string): Promise<Note[]> => {
    const q = query(notesCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const notes: Note[] = [];
    querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() } as Note);
    });
    return notes;
};

export const addNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    try {
        const validNoteData = Object.fromEntries(
            Object.entries(note).filter(([_, v]) => v !== undefined)
        );

        await addDoc(notesCollection, {
            ...validNoteData,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding note: ", error);
        throw error;
    }
};

export const updateNote = async (noteId: string, updates: Partial<Note>) => {
    const noteDoc = doc(db, 'notes', noteId);
    
    const validUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    try {
        await updateDoc(noteDoc, validUpdates);
    } catch (error) {
        console.error("Error updating note: ", error);
        throw error;
    }
};

export const deleteNote = async (noteId: string) => {
    const noteDoc = doc(db, 'notes', noteId);
    try {
        await deleteDoc(noteDoc);
    } catch (error) {
        console.error("Error deleting note: ", error);
        throw error;
    }
};
