import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAc-g3kLguUfx8X2zOgNHF5onE_QcOoaf0",
  authDomain: "heso-hrm.firebaseapp.com",
  projectId: "heso-hrm",
  storageBucket: "heso-hrm.firebasestorage.app",
  messagingSenderId: "243212199762",
  appId: "1:243212199762:web:a5ddddcd9236e525547c8b",
  measurementId: "G-HGJZP0NJ77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { storage, auth };
