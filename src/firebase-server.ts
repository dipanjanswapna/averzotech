
'use server';

import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
    throw new Error("Firebase service account is not configured. Please set the FIREBASE_SERVICE_ACCOUNT environment variable with the JSON key.");
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(serviceAccountString);
} catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON string.", error);
    throw new Error("The FIREBASE_SERVICE_ACCOUNT environment variable is not a valid JSON object.");
}


let app;
if (!getApps().length) {
    app = initializeApp({
        credential: cert(serviceAccount),
    });
} else {
    app = getApp();
}


const db = getFirestore(app);

export { db, app };
