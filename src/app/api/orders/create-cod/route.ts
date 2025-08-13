
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const orderData = await req.json();
        
        if (!orderData || !orderData.userId || !orderData.items || orderData.items.length === 0) {
            return NextResponse.json({ error: 'Missing required order data.' }, { status: 400 });
        }

        const batch = writeBatch(db);
        
        // Create a new document in the "orders" collection
        const newOrderRef = doc(collection(db, "orders"));
        
        // Set the order data
        batch.set(newOrderRef, {
            ...orderData,
            status: 'Processing', // Initial status for COD orders
            paymentDetails: {
                status: 'Unpaid',
                method: 'COD'
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        // Decrement stock for each item in the order
        for (const item of orderData.items) {
            const productRef = doc(db, 'products', item.id);
            batch.update(productRef, { "inventory.stock": increment(-item.quantity) });
        }
        
        // Commit the batch
        await batch.commit();

        // Return the new order ID
        return NextResponse.json({ orderId: newOrderRef.id }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating COD order:", error);
        return NextResponse.json({ error: 'Failed to create order.', details: error.message }, { status: 500 });
    }
}
