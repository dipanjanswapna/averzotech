

import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, writeBatch, doc, getDoc, deleteDoc, query, where, getDocs, limit } from 'firebase/firestore';
import { Order } from '@/types';
import { db } from '@/firebase-server';

async function findOrder(tran_id: string): Promise<string | null> {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('paymentDetails.tran_id', '==', tran_id), limit(1));
    const existingOrderSnap = await getDocs(q);

    if (!existingOrderSnap.empty) {
        return existingOrderSnap.docs[0].id;
    }
    return null;
}

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { tran_id } = body;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    if (!tran_id) {
        console.error("Transaction ID missing in success response", {body});
        return NextResponse.redirect(new URL(`/payment/fail?reason=data_missing`, appUrl), { status: 302 });
    }

    try {
        let existingOrderId = await findOrder(tran_id as string);
        if (existingOrderId) {
            console.log(`Order with tran_id ${tran_id} already exists with ID: ${existingOrderId}. Redirecting to confirmation.`);
            return NextResponse.redirect(new URL(`/order-confirmation?orderId=${existingOrderId}`, appUrl), { status: 302 });
        }

        const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
        const pendingOrderSnap = await getDoc(pendingOrderRef);
        
        if (!pendingOrderSnap.exists()) {
             await new Promise(resolve => setTimeout(resolve, 3000));
             existingOrderId = await findOrder(tran_id as string);
             if (existingOrderId) {
                 return NextResponse.redirect(new URL(`/order-confirmation?orderId=${existingOrderId}`, appUrl), { status: 302 });
             }
             console.error("Could not find order even after waiting. Redirecting with transaction ID for final lookup.");
             const orderConfirmationUrl = new URL(`/order-confirmation`, appUrl);
             orderConfirmationUrl.searchParams.set('tran_id', tran_id as string);
             return NextResponse.redirect(orderConfirmationUrl, { status: 302 });
        }

        const orderData = pendingOrderSnap.data() as Order;
        const batch = writeBatch(db);
        const newOrderRef = doc(collection(db, "orders"));
        
        const finalOrderData = {
            ...orderData,
            status: 'Processing',
            paymentDetails: body,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            trackingId: '',
        };

        batch.set(newOrderRef, finalOrderData);
        
        // Stock was already decremented at payment initiation. Now we just delete the pending order.
        batch.delete(pendingOrderRef);

        await batch.commit();

        return NextResponse.redirect(new URL(`/order-confirmation?orderId=${newOrderRef.id}`, appUrl), { status: 302 });

    } catch (error) {
        console.error("Error processing successful payment:", error);
        return NextResponse.redirect(new URL(`/payment/fail?reason=processing_error&tran_id=${tran_id}`, appUrl), { status: 302 });
    }
}
