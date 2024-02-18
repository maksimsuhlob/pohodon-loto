// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0bjw4z7AS98SYwa6rvAT7oUMWBGUaMJ0",
    authDomain: "pohodon-loto.firebaseapp.com",
    databaseURL: "pohodon-loto-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pohodon-loto",
    storageBucket: "pohodon-loto.appspot.com",
    messagingSenderId: "270697512623",
    appId: "1:270697512623:web:19eeaec6650538284e1e5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const fbDatabase = getDatabase(app);
export const getGameRef = (gameId) => ref(fbDatabase, 'games/' + gameId)
