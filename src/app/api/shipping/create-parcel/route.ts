
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { createParcel } from '@/lib/redx';
import { Order } from '@/types';
import { initializeFirebase } from '@/firebase';

const { firestore: db } = initializeFirebase();

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Missing order ID.' }, { status: 400 });
        }
        
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (!orderSnap.exists()) {
             return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
        }
        
        const orderData = orderSnap.data() as Order;

        const parcelResponse = await createParcel(orderData, orderId);

        if (parcelResponse.tracking_id) {
            await updateDoc(orderRef, { trackingId: parcelResponse.tracking_id });
            return NextResponse.json({ trackingId: parcelResponse.tracking_id }, { status: 200 });
        } else {
            console.error("Failed to get tracking ID from RedX for order:", orderId, "Response:", parcelResponse);
            throw new Error(parcelResponse.message || "Parcel created but no tracking ID received from RedX.");
        }

    } catch (error: any) {
        console.error("Error creating RedX parcel:", error);
        return NextResponse.json({ error: 'Failed to create parcel.', details: error.message }, { status: 500 });
    }
}
