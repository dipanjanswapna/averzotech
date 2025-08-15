
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const bKashConfig = {
    baseURL: process.env.BKASH_IS_LIVE === 'true' ? 'https://tokenized.pay.bka.sh/v1.2.0-beta' : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
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

// In-memory cache for the token
let cachedToken: Token | null = null;


async function grantToken(): Promise<Token> {
    const response = await fetch(`${bKashConfig.baseURL}/tokenized/checkout/token/grant`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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
    if (!data.id_token || data.statusCode !== '0000') {
        console.error("bKash grant token error response:", data);
        throw new Error(`bKash token grant failed: ${data.statusMessage || 'Unknown error'}`);
    }
    const expires_in_seconds = parseInt(data.expires_in, 10);
    const token: Token = {
        id_token: data.id_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + (expires_in_seconds * 1000)
    };
    
    cachedToken = token; // Store in cache
    return token;
}


async function refreshToken(existingRefreshToken: string): Promise<Token> {
     const response = await fetch(`${bKashConfig.baseURL}/tokenized/checkout/token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'username': bKashConfig.username,
            'password': bKashConfig.password,
        },
        body: JSON.stringify({
            app_key: bKashConfig.app_key,
            app_secret: bKashConfig.app_secret,
            refresh_token: existingRefreshToken
        }),
        cache: 'no-store'
    });
    const data = await response.json();
     if (!data.id_token || data.statusCode !== '0000') {
        console.error("bKash refresh token error response:", data);
        // If refresh fails, try granting a new token from scratch
        return grantToken();
    }
    const expires_in_seconds = parseInt(data.expires_in, 10);
     const token: Token = {
        id_token: data.id_token,
        refresh_token: data.refresh_token,
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

    // If token is expired or close to expiring, try to refresh it
    if(cachedToken?.refresh_token) {
        try {
            const newToken = await refreshToken(cachedToken.refresh_token);
            return newToken.id_token;
        } catch (error) {
             console.error("bKash refresh token failed, granting a new one.", error);
             // If refresh fails, fall through to grant a new token
        }
    }
    
    // Otherwise, grant a new token
    const newToken = await grantToken();
    return newToken.id_token;
}

export const bkashPaymentRequest = async (endpoint: 'create' | 'execute' | 'query' | 'searchTransaction', body: object) => {
     const token = await getBkashToken();
     let url;
     if (endpoint === 'query') {
        url = `${bKashConfig.baseURL}/tokenized/checkout/payment/status`;
     } else if (endpoint === 'searchTransaction') {
        url = `${bKashConfig.baseURL}/tokenized/checkout/general/searchTransaction`;
     } else {
        url = `${bKashConfig.baseURL}/tokenized/checkout/${endpoint}`;
     }
     
     const response = await fetch(url, {
         method: 'POST',
         headers: {
             'Accept': 'application/json',
             'Authorization': token,
             'X-App-Key': bKashConfig.app_key,
             ...(endpoint === 'create' && {'Content-Type': 'application/json'}),
         },
         body: JSON.stringify(body),
         cache: 'no-store'
     });

     return await response.json();
}
