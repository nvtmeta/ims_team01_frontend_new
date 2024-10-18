// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx7brrv6gMrMODRjqYShxJ6uu_YUQv1bM",
  authDomain: "ckh-shop-391608.firebaseapp.com",
  projectId: "ckh-shop-391608",
  storageBucket: "ckh-shop-391608.appspot.com",
  messagingSenderId: "44801376250",
  appId: "1:44801376250:web:8e8ea99c91c5abe1b5ae43",
  measurementId: "G-P5FRTHF9N6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);



// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
