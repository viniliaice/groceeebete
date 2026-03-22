import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ============================================
// 🔥 FIREBASE CONFIGURATION
// ============================================
// 
// To connect to a real Firebase database:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Enable Firestore Database
// 4. Go to Project Settings > General > Your Apps
// 5. Register a web app and copy the config
// 6. Replace the values below with your actual credentials
//
// For now, the app uses localStorage as a fallback
// so it works without Firebase setup!
// ============================================

const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
