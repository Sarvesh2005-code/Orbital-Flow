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
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'none';
  lastActive?: any; // FirebaseFirestore.Timestamp
  createdAt?: any; // FirebaseFirestore.Timestamp
  updatedAt?: any; // FirebaseFirestore.Timestamp
}

export const createUserDocument = async (user: User, additionalData: Record<string, any> = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  let userSnap = null;
  
  try {
    userSnap = await getDoc(userRef);
  } catch (error) {
    console.warn('Warning: Could not fetch user doc (might be permission propagation delay):', error);
  }
  
  if (!userSnap || !userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    
    try {
      // Remove undefined values to prevent Firestore errors
      const userData: Record<string, any> = {
        theme: 'system',
        emailNotifications: true,
        pushNotifications: true,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData
      };

      if (displayName) userData.displayName = displayName;
      if (email) userData.email = email;
      if (photoURL) userData.photoURL = photoURL;
      if (additionalData.name || displayName) userData.name = additionalData.name || displayName;
      
      // Use merge: true so if the document does exist (and we couldn't read it), we don't overwrite completely
      await setDoc(userRef, userData, { merge: true });
      console.log('User document created successfully');
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  } else {
    // Update last active timestamp
    try {
      await setDoc(userRef, {
        lastActive: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user document:', error);
      throw error;
    }
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
    await setDoc(userRef, {
      lastActive: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
};
