
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const bKashConfig = {
    baseURL: process.env.BKASH_IS_LIVE === 'true' ? 'https://checkout.pay.bka.sh/v1.2.0-beta' : 'https://checkout.sandbox.bka.sh/v1.2.0-beta',
    tokenURL: process.env.BKASH_IS_LIVE === 'true' ? 'https://token.pay.bka.sh/v1.2.0-beta/token' : 'https://token.sandbox.bka.sh/v1.2.0-beta/token',
    app_key: process.env.BKASH_APP_KEY || '',
    app_secret: process.env.BKASH_APP_SECRET || '',
    username: process.env.BKASH_USERNAME || '',
    password: process.env.BKASH_PASSWORD || '',
};

interface Token {
    id_token: string;
    expires_at: number; // Store expiry time as a timestamp
}

let cachedToken: Token | null = null;

async function grantToken(): Promise<Token> {
    const response = await fetch(bKashConfig.tokenURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'username': bKashConfig.username,
            'password': bKashConfig.password,
        },
        body: JSON.stringify({
            app_key: bKashConfig.app_key,
            app_secret: bKashConfig.app_secret,
        }),
        cache: 'no-store'
    });
    const data = await response.json();
    if (!data.id_token) {
        console.error("bKash grant token error response:", data);
        throw new Error(`bKash token grant failed: ${data.statusMessage || 'Unknown error'}`);
    }
    const expires_in_seconds = parseInt(data.expires_in, 10) || 3600;
    const token: Token = {
        id_token: data.id_token,
        expires_at: Date.now() + (expires_in_seconds * 1000)
    };
    
    cachedToken = token;
    return token;
}

export async function getBkashToken(): Promise<string> {
    const now = Date.now();
    // Add a 5-minute buffer before expiry
    if (cachedToken && cachedToken.expires_at > now + 5 * 60 * 1000) {
        return cachedToken.id_token;
    }
    
    const newToken = await grantToken();
    return newToken.id_token;
}

export const createPayment = async (amount: string, orderId: string, intent: string, callbackURL: string) => {
    const token = await getBkashToken();
    const response = await fetch(`${bKashConfig.baseURL}/checkout/payment/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-App-Key': bKashConfig.app_key,
        },
        body: JSON.stringify({
            mode: 'checkout',
            amount: amount,
            currency: 'BDT',
            orderId: orderId,
            payerReference: orderId,
            callbackURL: callbackURL,
            intent: intent,
        }),
        cache: 'no-store'
    });
    return response.json();
};

export const executePayment = async (paymentID: string) => {
    const token = await getBkashToken();
    const response = await fetch(`${bKashConfig.baseURL}/checkout/payment/execute/${paymentID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-App-Key': bKashConfig.app_key,
        },
        cache: 'no-store'
    });
    return response.json();
};
