import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8I3J7iPN3eP-m4SbX0D8MABCM1Ne3bk4",
  authDomain: "aarogya-sahayak-acf0f.firebaseapp.com",
  projectId: "aarogya-sahayak-acf0f",
  storageBucket: "aarogya-sahayak-acf0f.firebasestorage.app",
  messagingSenderId: "80950145879",
  appId: "1:80950145879:web:c4a2ff416fe3ab6d858412",
  measurementId: "G-QPZNPZDYJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage, googleProvider };
export default app;
