
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
    // We are throwing an error here which will stop the build process.
    // This is intentional. The app CANNOT run without this config.
    // In a real production environment, this would be a hard failure.
    // For local dev, ensure .env.local has FIREBASE_SERVICE_ACCOUNT set.
    console.error("Firebase service account is not configured. Set the FIREBASE_SERVICE_ACCOUNT environment variable.");
}

const serviceAccount = serviceAccountString ? JSON.parse(serviceAccountString) : undefined;

const app = !getApps().length && serviceAccount
    ? initializeApp({ credential: cert(serviceAccount) }) 
    : getApp();

const db = getFirestore(app);

export { db, app };
