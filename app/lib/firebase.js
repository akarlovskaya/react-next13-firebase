import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBhvWMXucX-rlkpw3dwhw8-OOTJbzqUhX8",
    authDomain: "react-next13-firebase.firebaseapp.com",
    projectId: "react-next13-firebase",
    storageBucket: "react-next13-firebase.firebasestorage.app",
    messagingSenderId: "262133091227",
    appId: "1:262133091227:web:7992df182f66ba84db2f3e"
  };

// Initialize Firebase
  function createFirebaseApp(config) {
    try {
      return getApp();
    } catch {
      return initializeApp(config);
    }
  }

const firebaseApp = createFirebaseApp(firebaseConfig);

// Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';

/// Helper functions

