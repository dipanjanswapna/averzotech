
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { createPayment } from '@/lib/bkash';

export async function POST(req: NextRequest) {
    const orderData = await req.json();
    const { total, items } = orderData;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        const orderId = nanoid();

        await setDoc(doc(db, 'pending_orders', orderId), {
             ...orderData,
             orderId: orderId,
             createdAt: serverTimestamp()
        });
        
        const createPaymentData = await createPayment(
            String(total),
            orderId,
            'sale',
            `${appUrl}/api/payment/bkash/callback`
        );

        if (createPaymentData.status === 'success' && createPaymentData.bkashURL) {
            return NextResponse.json({ paymentUrl: createPaymentData.bkashURL });
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
