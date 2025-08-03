// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'orbital-flow-cp8pz',
  appId: '1:526248072903:web:4330dcd3430df30ca850e2',
  storageBucket: 'orbital-flow-cp8pz.firebasestorage.app',
  apiKey: 'AIzaSyBwFwma-ltOCnJY-a_iHcE8-N0-3gt4BTw',
  authDomain: 'orbital-flow-cp8pz.firebaseapp.com',
  messagingSenderId: '526248072903',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
