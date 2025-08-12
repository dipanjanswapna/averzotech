
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { tran_id, value_b } = body;
    
    if (!tran_id || !value_b) {
        console.error("Transaction ID or order data missing in success response");
        return NextResponse.redirect(new URL('/payment/fail?reason=data_missing', req.url));
    }

    try {
        const orderData = JSON.parse(value_b as string);
        const batch = writeBatch(db);
        
        const orderRef = doc(db, "orders", tran_id as string);
        
        batch.set(orderRef, {
            ...orderData,
            status: 'Processing',
            createdAt: serverTimestamp(),
            paymentDetails: body
        });
        
        // Update stock
        for (const item of orderData.items) {
            const productRef = doc(db, 'products', item.id);
            batch.update(productRef, { "inventory.stock": increment(-item.quantity) });
        }

        await batch.commit();

        // Redirecting is handled by SSLCommerz `success_url` directly
        // This POST handler is for server-to-server confirmation
        // For simplicity in this setup, we'll let the success_url handle the user redirect.
        // A robust app would validate the transaction here before trusting the front-end redirect.
        
        // This return is for the server-to-server call, not the user.
        return new NextResponse('OK', { status: 200 });

    } catch (error) {
        console.error("Error processing successful payment:", error);
        // This redirect won't affect the user, who is already at the success_url.
        // This is for logging/debugging.
        return NextResponse.redirect(new URL('/payment/fail?reason=processing_error', req.url));
    }
}
