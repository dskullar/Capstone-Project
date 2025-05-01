import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Import Firebase Authentication
import { getFirestore, collection, addDoc } from 'firebase/firestore';  // Import Firestore

// Firebase configuration object (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyA1akc8CrYECWVbTfDQYNHO85-REeeEcfU",
  authDomain: "capstone-6835c.firebaseapp.com",
  projectId: "capstone-6835c",
  storageBucket: "capstone-6835c.firebasestorage.app",
  messagingSenderId: "893346789673",
  appId: "1:893346789673:web:54d8422673229b67d91f38",
  measurementId: "G-M7XC376LP8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Function to save log data to Firestore
const saveLiftData = async (userId: string, week: string, exercises: any) => {
  try {
    const docRef = await addDoc(collection(firestore, "lifts"), {
      userId,
      week,
      exercises,
      timestamp: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export { auth, firestore, saveLiftData };
