
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, writeBatch, increment, collection, serverTimestamp } from 'firebase/firestore';
import { executePayment } from '@/lib/bkash';

async function finalizeOrder(paymentDetails: any) {
    const orderId = paymentDetails.orderId;
    const pendingOrderRef = doc(db, 'pending_orders', orderId);
    const pendingOrderSnap = await getDoc(pendingOrderRef);
    
    if (!pendingOrderSnap.exists()) {
        console.error("Could not find pending order to finalize for orderId:", orderId);
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
    const status = searchParams.get('status');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (status !== 'success' || !paymentID) {
        let reason = 'Payment was not successful.';
        if (status === 'failure') reason = 'Payment failed. Please try again.';
        if (status === 'cancel') reason = 'Payment was cancelled.';
        
        const failUrl = new URL(`/payment/fail`, appUrl);
        failUrl.searchParams.set('reason', reason);
        return NextResponse.redirect(failUrl);
    } 

    try {
        const executeData = await executePayment(paymentID);

        if (executeData.status === 'success' && executeData.transactionStatus === 'Completed') {
            const newOrderId = await finalizeOrder(executeData);
            if (newOrderId) {
                return NextResponse.redirect(new URL(`/order-confirmation?orderId=${newOrderId}`, appUrl), { status: 302 });
            } else {
                 return NextResponse.redirect(new URL(`/payment/fail?reason=Order_processing_failed`, appUrl), { status: 302 });
            }
        } else {
             return NextResponse.redirect(new URL(`/payment/fail?reason=${executeData.statusMessage || 'Payment_execution_failed'}`, appUrl), { status: 302 });
        }

    } catch (error) {
        console.error("Error executing bKash payment:", error);
        return NextResponse.redirect(new URL(`/payment/fail?reason=Internal_server_error`, appUrl), { status: 302 });
    }
}
