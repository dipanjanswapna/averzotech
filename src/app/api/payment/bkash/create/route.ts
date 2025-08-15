'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';

const bKashConfig = {
    baseURL: process.env.BKASH_IS_LIVE === 'true' ? 'https://tokenized.pay.bka.sh/v1.2.0-beta' : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    app_key: process.env.BKASH_APP_KEY || '',
    app_secret: process.env.BKASH_APP_SECRET || '',
    username: process.env.BKASH_USERNAME || '',
    password: process.env.BKASH_PASSWORD || '',
};

async function getBkashToken() {
    const response = await fetch(`${bKashConfig.baseURL}/tokenized/checkout/token/grant`, {
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
    return data.id_token;
}

export async function POST(req: NextRequest) {
    const orderData = await req.json();
    const { total, items } = orderData;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        const id_token = await getBkashToken();
        const paymentID = nanoid();

        await setDoc(doc(db, 'pending_orders', paymentID), {
             ...orderData,
             paymentID: paymentID,
             createdAt: serverTimestamp()
        });
        
        const createPaymentResponse = await fetch(`${bKashConfig.baseURL}/tokenized/checkout/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': id_token,
                'X-App-Key': bKashConfig.app_key,
            },
            body: JSON.stringify({
                mode: '0011',
                payerReference: orderData.userId,
                callbackURL: `${appUrl}/api/payment/bkash/callback`,
                amount: total,
                currency: 'BDT',
                intent: 'sale',
                merchantInvoiceNumber: paymentID
            }),
            cache: 'no-store'
        });

        const createPaymentData = await createPaymentResponse.json();

        if (createPaymentData.statusCode === '0000' && createPaymentData.bkashURL) {
            return NextResponse.json({ bkashURL: createPaymentData.bkashURL });
        } else {
            console.error("bKash create payment failed:", createPaymentData);
            return NextResponse.json({
                error: 'Failed to create bKash payment session.',
                statusMessage: createPaymentData.statusMessage
            }, { status: 500 });
        }

    } catch (error) {
        console.error("bKash payment initiation error:", error);
        return NextResponse.json({ error: 'An error occurred during bKash payment initiation.' }, { status: 500 });
    }
}
