// Thay vì: import firebase from "firebase/app";
// Hãy dùng:
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Ví dụ cho Auth  
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAONJsTaj5vUSkIMgTHo9_qMppIDGQxPFo",
  authDomain: "otp-2-4dc2a.firebaseapp.com",
  projectId: "otp-2-4dc2a",
  // storageBucket: "otp-2-4dc2a.firebasestorage.app",
  storageBucket: "otp-2-4dc2a.appspot.com",
  messagingSenderId: "797041623234",
  appId: "1:797041623234:web:30a956b32e9f80132ffb5b",
  measurementId: "G-HEBN6Q19CT"
};  
  
// Khởi tạo Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

