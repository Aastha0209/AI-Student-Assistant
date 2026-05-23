// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { 
  getDatabase 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// Firebase Config
const firebaseConfig = {

  apiKey: "AIzaSyBjeWzYtOUICwvuqtjvJNjEWBsfj7JJz9Y",

  authDomain: "ai-student-assistant-53e01.firebaseapp.com",

  databaseURL: "https://ai-student-assistant-53e01-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "ai-student-assistant-53e01",

  storageBucket: "ai-student-assistant-53e01.firebasestorage.app",

  messagingSenderId: "588266392480",

  appId: "1:588266392480:web:6360e98abe4ee7340632c5",

  measurementId: "G-3QNK0FE01R"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Auth
export const auth = getAuth(app);


// Realtime Database
export const database = getDatabase(app);