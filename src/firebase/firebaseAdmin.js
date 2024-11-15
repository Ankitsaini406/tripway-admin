// firebaseAdmin.js

import admin from "firebase-admin";
import serviceAccount from './tripway-firebase-admin.json';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://tripway-cabs-default-rtdb.firebaseio.com", // replace with your actual database URL
    });
}

const database = admin.database();
const auth = admin.auth();

export { database, auth };
