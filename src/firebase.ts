// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkIkQbOiGvZ5ApG1R6wgyAhfjrnrPGFKM",
  authDomain: "react-poke-app-2233c.firebaseapp.com",
  projectId: "react-poke-app-2233c",
  storageBucket: "react-poke-app-2233c.appspot.com",
  messagingSenderId: "967877066125",
  appId: "1:967877066125:web:2728db48b6966fc95e11c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app