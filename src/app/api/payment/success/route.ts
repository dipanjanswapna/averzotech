
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { tran_id, value_a: userId, value_b } = body;
    
    if (!tran_id) {
        return NextResponse.redirect(new URL('/payment/fail', req.url));
    }

    try {
        const orderData = JSON.parse(value_b as string); // This should contain all order details passed from initiate
        const batch = writeBatch(db);
        
        // This is where you would retrieve the full order details.
        // For this example, we assume `value_b` contains the necessary items.
        const items = JSON.parse(value_b as string);

        const orderRef = doc(collection(db, "orders"), tran_id);
        
        // You would typically get the full order details from a temporary storage or pass it through `value_` fields.
        // Here's a simplified version.
        batch.set(orderRef, {
            ...orderData, // This should contain the full order details
            status: 'Processing',
            createdAt: serverTimestamp(),
            paymentDetails: body
        });
        
        // Update stock
        for (const item of items) {
            const productRef = doc(db, 'products', item.id);
            // In a real scenario, you would decrement stock. This is a simplified example.
            // const newStock = ...
            // batch.update(productRef, { "inventory.stock": newStock });
        }

        await batch.commit();

        return NextResponse.redirect(new URL(`/order-confirmation?orderId=${tran_id}`, req.url));

    } catch (error) {
        console.error("Error processing successful payment:", error);
        return NextResponse.redirect(new URL('/payment/fail', req.url));
    }
}
