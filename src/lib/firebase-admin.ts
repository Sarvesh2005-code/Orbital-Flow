import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // If FIREBASE_SERVICE_ACCOUNT_KEY is present, it will initialize from it
  // Otherwise, fallback to try relying on application default credentials
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

export const adminDb = admin.firestore();
