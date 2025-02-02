import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBl4QS8AzcoX...",
  authDomain: "chat-68081.firebaseapp.com",
  databaseURL: "https://chat-68081-default-rtdb.firebaseio.com",
  projectId: "chat-68081",
  storageBucket: "chat-68081.appspot.com",
  messagingSenderId: "1059521286986",
  appId: "1:1059521286986:web:8485c81db425451697e7b3",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export default db;