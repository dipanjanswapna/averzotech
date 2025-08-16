
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
    refresh_token: string;
    expires_at: number; // Store expiry time as a timestamp
}

async function grantToken(): Promise<Token> {
    const tokenDocRef = doc(db, 'bkash_tokens', 'app_token');
    const tokenSnap = await getDoc(tokenDocRef);
    const now = Date.now();

    if (tokenSnap.exists()) {
        const tokenData = tokenSnap.data() as Token;
        // Check if token is valid for at least 5 more minutes
        if (tokenData.expires_at > now + 5 * 60 * 1000) {
            return tokenData;
        }
    }
    
    // If no valid token, grant a new one
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
    const newToken: Token = {
        id_token: data.id_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (expires_in_seconds * 1000)
    };
    
    await setDoc(tokenDocRef, newToken);
    return newToken;
}

export async function getBkashToken(): Promise<string> {
    const tokenData = await grantToken();
    return tokenData.id_token;
}

export async function bkashPaymentRequest(endpoint: 'create' | 'execute' | 'query' | 'search' | 'refund' | 'refundStatus', body: object) {
    const token = await getBkashToken();
    
    const urlMap = {
        create: `${bKashConfig.baseURL}/checkout/payment/create`,
        execute: `${bKashConfig.baseURL}/checkout/payment/execute`,
        query: `${bKashConfig.baseURL}/checkout/payment/status`,
        search: `${bKashConfig.baseURL}/checkout/payment/search`,
        refund: `${bKashConfig.baseURL}/checkout/payment/refund`,
        refundStatus: `${bKashConfig.baseURL}/checkout/payment/refund`,
    };

    const response = await fetch(urlMap[endpoint], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Corrected: Added 'Bearer ' prefix
            'X-App-Key': bKashConfig.app_key,
        },
        body: JSON.stringify(body),
        cache: 'no-store'
    });
    
    return response.json();
}

export const createPayment = async (amount: string, orderId: string, intent: string, callbackURL: string) => {
    return bkashPaymentRequest('create', {
        mode: 'checkout',
        amount: amount,
        currency: 'BDT',
        merchantInvoiceNumber: orderId,
        payerReference: orderId,
        callbackURL: callbackURL,
        intent: intent,
    });
};

export const executePayment = async (paymentID: string) => {
    return bkashPaymentRequest('execute', { paymentID });
};

export const queryPayment = async (paymentID: string) => {
    return bkashPaymentRequest('query', { paymentID });
};

export const searchTransaction = async (trxID: string) => {
    return bkashPaymentRequest('search', { trxID });
}

export const refundTransaction = async (paymentID: string, trxID: string, amount: string, reason: string, sku: string) => {
    return bkashPaymentRequest('refund', {
        paymentID,
        trxID,
        amount,
        reason,
        sku
    });
};

export const refundStatus = async (paymentID: string, trxID: string) => {
    return bkashPaymentRequest('refundStatus', {
        paymentID,
        trxID
    });
};
