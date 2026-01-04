

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment, getDoc } from 'firebase/firestore';
import { Order } from '@/types';
import { db } from '@/firebase-server';


export async function POST(req: NextRequest) {
    try {
        const orderData: Order = await req.json();
        
        if (!orderData || !orderData.userId || !orderData.items || orderData.items.length === 0) {
            return NextResponse.json({ error: 'Missing required order data.' }, { status: 400 });
        }

        const batch = writeBatch(db);
        
        // Handle gift card logic
        if (orderData.payment?.giftCard?.code) {
             const giftCardRef = doc(db, 'giftCards', orderData.payment.giftCard.code);
             const giftCardSnap = await getDoc(giftCardRef);
             if(!giftCardSnap.exists() || giftCardSnap.data()?.currentBalance < orderData.payment.giftCard.usedAmount) {
                 return NextResponse.json({ error: 'Gift card is invalid or has insufficient balance.' }, { status: 400 });
             }
             const newBalance = giftCardSnap.data().currentBalance - orderData.payment.giftCard.usedAmount;
             batch.update(giftCardRef, { 
                 currentBalance: newBalance,
                 status: newBalance <= 0 ? 'Used' : 'Active' 
            });
        }
        
        // Create a new document in the "orders" collection
        const newOrderRef = doc(collection(db, "orders"));
        
        const finalOrderData = {
            ...orderData,
            status: 'Pending',
            paymentDetails: {
                status: 'Unpaid',
                method: 'COD'
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            trackingId: '', // Initialize trackingId as empty
        };

        batch.set(newOrderRef, finalOrderData);
        
        // Decrement stock for each item in the order
        for (const item of orderData.items) {
            const productRef = doc(db, 'products', item.id);
            batch.update(productRef, { 
                "inventory.warehouseStock": increment(-item.quantity),
                "inventory.stock": increment(-item.quantity) 
            });
        }
        
        await batch.commit();

        return NextResponse.json({ orderId: newOrderRef.id }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating COD order:", error);
        return NextResponse.json({ error: 'Failed to create order.', details: error.message }, { status: 500 });
    }
}
