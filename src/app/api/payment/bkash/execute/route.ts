
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, writeBatch, increment, collection, serverTimestamp } from 'firebase/firestore';
import { bkashPaymentRequest } from '@/lib/bkash';

async function finalizeOrder(paymentID: string, paymentDetails: any) {
    const pendingOrderRef = doc(db, 'pending_orders', paymentID);
    const pendingOrderSnap = await getDoc(pendingOrderRef);
    
    if (!pendingOrderSnap.exists()) {
        console.error("Could not find pending order to finalize for paymentID:", paymentID);
        // This could happen if the order is already processed.
        // We will let the final redirect handle the user experience.
        return null;
    }

    const orderData = pendingOrderSnap.data();
    const batch = writeBatch(db);
    const newOrderRef = doc(collection(db, "orders"));
    
    batch.set(newOrderRef, { ...orderData, status: 'Processing', paymentDetails, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    
    for (const item of orderData.items) {
        const productRef = doc(db, 'products', item.id);
        batch.update(productRef, { "inventory.stock": increment(-item.quantity) });
    }
    
    batch.delete(pendingOrderRef);
    await batch.commit();
    return newOrderRef.id;
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get('paymentID');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!paymentID) {
        return NextResponse.redirect(new URL(`/payment/fail?reason=Invalid_request`, appUrl), { status: 302 });
    }

    try {
        const executeData = await bkashPaymentRequest('execute', { paymentID });

        if (executeData.statusCode === '0000' && executeData.transactionStatus === 'Completed') {
            const orderId = await finalizeOrder(paymentID, executeData);
            if (orderId) {
                return NextResponse.redirect(new URL(`/order-confirmation?orderId=${orderId}`, appUrl), { status: 302 });
            } else {
                 // Fallback if order processing failed but payment was successful
                 return NextResponse.redirect(new URL(`/order-confirmation?orderId_fallback=${paymentID}`, appUrl), { status: 302 });
            }
        } else {
             // If execute fails, query the payment status as a fallback
             console.warn("bKash execute payment failed, querying payment status as fallback. Reason:", executeData.statusMessage);
             await new Promise(resolve => setTimeout(resolve, 1000)); // Short delay before querying

             const queryData = await bkashPaymentRequest('query', { paymentID });
             if (queryData.statusCode === '0000' && queryData.transactionStatus === 'Completed') {
                 const orderId = await finalizeOrder(paymentID, queryData);
                 if (orderId) {
                    return NextResponse.redirect(new URL(`/order-confirmation?orderId=${orderId}`, appUrl), { status: 302 });
                 } else {
                     return NextResponse.redirect(new URL(`/order-confirmation?orderId_fallback=${paymentID}`, appUrl), { status: 302 });
                 }
             }
             
             console.error("bKash execute and query failed:", { executeData, queryData });
             return NextResponse.redirect(new URL(`/payment/fail?reason=${executeData.statusMessage || queryData.statusMessage || 'Payment_failed'}`, appUrl), { status: 302 });
        }

    } catch (error) {
        console.error("Error executing bKash payment:", error);
        return NextResponse.redirect(new URL(`/payment/fail?reason=Internal_server_error`, appUrl), { status: 302 });
    }
}
