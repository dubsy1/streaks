import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiTgmI_kW6ofnyPwlFDB6S-PdJAwJZDw0",
  authDomain: "streaks-f084b.firebaseapp.com",
  projectId: "streaks-f084b",
  storageBucket: "streaks-f084b.firebasestorage.app",
  messagingSenderId: "1073569357982",
  appId: "1:1073569357982:web:2c66510fd23aa7f0649b8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
