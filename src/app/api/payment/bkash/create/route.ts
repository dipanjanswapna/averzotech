

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, serverTimestamp, writeBatch, increment, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { createPayment } from '@/lib/bkash';
import { db } from '@/firebase-server';

export async function POST(req: NextRequest) {
    const orderData = await req.json();
    const { total, items } = orderData;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const orderId = nanoid();

    try {
        const batch = writeBatch(db);
        const pendingOrderRef = doc(db, 'pending_orders', orderId);
        
        // Reserve stock
        for (const item of items) {
            const productRef = doc(db, 'products', item.id);
            const productSnap = await getDoc(productRef);
            if (!productSnap.exists() || productSnap.data().inventory.stock < item.quantity) {
                throw new Error(`Not enough stock for ${item.name}.`);
            }
            batch.update(productRef, { "inventory.stock": increment(-item.quantity) });
        }

        // Create pending order
        batch.set(pendingOrderRef, {
             ...orderData,
             orderId: orderId,
             createdAt: serverTimestamp()
        });

        await batch.commit();
        
        const createPaymentData = await createPayment(
            String(total),
            orderId,
            'sale',
            `${appUrl}/api/payment/bkash/callback`
        );

        if (createPaymentData.bkashURL) {
            return NextResponse.json({ paymentUrl: createPaymentData.bkashURL });
        } else {
            console.error("bKash create payment failed:", createPaymentData);
            // Ideally, revert stock changes here if payment initiation fails.
            return NextResponse.json({
                error: 'Failed to create bKash payment session.',
                statusMessage: createPaymentData.statusMessage || createPaymentData.errorMessage
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("bKash payment initiation error:", error);
        return NextResponse.json({ error: `An error occurred during bKash payment initiation: ${error.message}` }, { status: 500 });
    }
}

