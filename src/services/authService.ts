// src/services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserDocument, getUserDocument } from './userService';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  // Email/Password Authentication
  static async signUp({ name, email, password }: SignUpData): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    // Send email verification
    const actionCodeSettings = {
      url: process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
        : `${window.location.origin}/login?verified=true`,
      handleCodeInApp: false,
    };
    
    await sendEmailVerification(userCredential.user, actionCodeSettings);

    // Create user document in Firestore
    await createUserDocument(userCredential.user, { name });

    return userCredential;
  }

  static async signIn({ email, password }: SignInData): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  // Google Authentication
  static async signInWithGoogle(): Promise<UserCredential> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // Check if user document exists, create if not
    const userDoc = await getUserDocument(userCredential.user.uid);
    if (!userDoc) {
      await createUserDocument(userCredential.user, {
        name: userCredential.user.displayName || 'Google User',
      });
    }

    return userCredential;
  }

  // Password Reset
  static async sendPasswordReset(email: string): Promise<void> {
    const actionCodeSettings = {
      url: process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/login?reset=true`
        : `${window.location.origin}/login?reset=true`,
      handleCodeInApp: false,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  }

  // Email Verification
  static async resendEmailVerification(user: User): Promise<void> {
    const actionCodeSettings = {
      url: process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
        : `${window.location.origin}/login?verified=true`,
      handleCodeInApp: false,
    };
    
    await sendEmailVerification(user, actionCodeSettings);
  }

  // Profile Updates
  static async updateUserProfile(updates: { 
    displayName?: string; 
    photoURL?: string; 
  }): Promise<void> {
    if (!auth.currentUser) throw new Error('No authenticated user');
    await updateProfile(auth.currentUser, updates);
  }

  // Password Change
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No authenticated user');
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  }

  // Sign Out
  static async signOut(): Promise<void> {
    await signOut(auth);
  }

  // Check if email is verified
  static isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified ?? false;
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }
}
