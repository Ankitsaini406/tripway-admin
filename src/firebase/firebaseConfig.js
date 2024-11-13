
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyD2gTQL1E2_fkFMuZGF6oCRc_R9HwTqcz8",
    authDomain: "tripway-cabs.firebaseapp.com",
    databaseURL: "https://tripway-cabs-default-rtdb.firebaseio.com",
    projectId: "tripway-cabs",
    storageBucket: "tripway-cabs.firebasestorage.app",
    messagingSenderId: "389997330359",
    appId: "1:389997330359:web:08c37352599134af54b232",
    measurementId: "G-4KRWCCFEJS",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const functions = getFunctions(app);

export {
    app,
    auth,
    firestore,
    database,
    functions
}