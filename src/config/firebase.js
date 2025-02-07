import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDf8eFL5YQ74T5QEWaG12o6My_H_yg0ReA",
  authDomain: "skincare-system.firebaseapp.com",
  projectId: "skincare-system",
  storageBucket: "skincare-system.firebasestorage.app",
  messagingSenderId: "623687579165",
  appId: "1:623687579165:web:5b0e55210c27a90520f8f4",
  measurementId: "G-4X9DQM260K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { storage, auth };
