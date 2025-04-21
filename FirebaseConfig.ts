import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  
import { getFirestore } from 'firebase/firestore';  
import { getAnalytics, isSupported } from 'firebase/analytics';  // Import isSupported

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

// Function to initialize Firebase Analytics conditionally
const initializeAnalytics = async () => {
  let analytics;
  // Wait for isSupported() to resolve
  const supported = await isSupported();
  if (supported) {
    analytics = getAnalytics(app);
  }
  return analytics;
};

// Call the function to initialize analytics
initializeAnalytics().then((analytics) => {
  // analytics will be undefined if analytics is not supported
  if (analytics) {
    console.log("Analytics initialized");
  } else {
    console.log("Analytics not supported in this environment");
  }
});

export { auth, firestore };
