// src/services/userService.ts
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, getDocs, query, where } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface UserProfile {
  displayName?: string;
  email?: string;
  photoURL?: string;
  name?: string;
  bio?: string;
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  lastActive?: any; // FirebaseFirestore.Timestamp
  createdAt?: any; // FirebaseFirestore.Timestamp
  updatedAt?: any; // FirebaseFirestore.Timestamp
}

// Create a new user document in Firestore
export const createUserDocument = async (user: User, additionalData: Record<string, any> = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    
    try {
      const userData: UserProfile = {
        displayName: displayName || undefined,
        email: email || undefined,
        photoURL: photoURL || undefined,
        name: additionalData.name || displayName || undefined,
        theme: 'system',
        emailNotifications: true,
        pushNotifications: true,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData
      };
      
      await setDoc(userRef, userData);
      console.log('User document created successfully');
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  } else {
    // Update last active timestamp
    await updateDoc(userRef, {
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

// Get a user document from Firestore
export const getUserDocument = async (uid: string) => {
  if (!uid) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? { uid, ...userDoc.data() } : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Update a user profile
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  if (!uid) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Update user last active timestamp
export const updateUserActivity = async (uid: string) => {
  if (!uid) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastActive: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
};
