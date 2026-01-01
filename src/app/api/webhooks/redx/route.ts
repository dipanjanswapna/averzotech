

import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase-server';

const REDX_STATUS_MAP: { [key: string]: string } = {
    'ready-for-delivery': 'Shipped',
    'delivery-in-progress': 'Shipped',
    'delivered': 'Fulfilled',
    'agent-returning': 'Returning',
    'returned': 'Returned',
    'cancelled': 'Cancelled',
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("RedX Webhook Received:", body);

        const { tracking_number, status, invoice_number } = body;

        if (!tracking_number || !status) {
            return NextResponse.json({ error: 'Missing tracking_number or status' }, { status: 400 });
        }

        const newStatus = REDX_STATUS_MAP[status];

        if (!newStatus) {
            console.log(`No status mapping found for RedX status: ${status}`);
            return NextResponse.json({ message: 'No action taken for this status.' }, { status: 200 });
        }
        
        let orderRef: any;
        const ordersRef = collection(db, 'orders');
        
        // Find order by tracking ID first
        const q = query(ordersRef, where("trackingId", "==", tracking_number));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            orderRef = querySnapshot.docs[0].ref;
        } else if (invoice_number) {
            // Fallback to merchant invoice ID if provided
            const qInvoice = query(ordersRef, where("id", "==", invoice_number));
            const invoiceSnapshot = await getDocs(qInvoice);
            if(!invoiceSnapshot.empty) {
                orderRef = invoiceSnapshot.docs[0].ref;
            }
        }
        
        if (orderRef) {
            await updateDoc(orderRef, {
                status: newStatus,
                updatedAt: serverTimestamp(),
            });
            console.log(`Order ${orderRef.id} status updated to ${newStatus} based on RedX webhook.`);
            return NextResponse.json({ message: 'Order status updated successfully' }, { status: 200 });
        } else {
            console.warn(`No order found for tracking_number: ${tracking_number} or invoice_number: ${invoice_number}`);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

    } catch (error: any) {
        console.error("Error processing RedX webhook:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

