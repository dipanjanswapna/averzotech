
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

const app = !getApps().length 
    ? initializeApp({ credential: cert(serviceAccount!) }) 
    : getApp();

const db = getFirestore(app);

export { db };
