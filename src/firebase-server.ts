
'use server';

import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
    // We are throwing an error here which will stop the build process.
    // This is intentional. The app CANNOT run without this config.
    // In a real production environment, this would be a hard failure.
    // For local dev, ensure .env.local has FIREBASE_SERVICE_ACCOUNT set.
    throw new Error("Firebase service account is not configured. Set the FIREBASE_SERVICE_ACCOUNT environment variable.");
}

const serviceAccount = JSON.parse(serviceAccountString);

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
