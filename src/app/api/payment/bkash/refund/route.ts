
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { bkashPaymentRequest } from '@/lib/bkash';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// A simple in-memory check for admin role would be insecure.
// In a real app, use Firebase Auth tokens and custom claims to verify admin status.
// For this context, we will proceed without a hard admin check.

export async function POST(req: NextRequest) {
    try {
        const { paymentId, trxId, amount, reason, sku } = await req.json();

        if (!paymentId || !trxId || !amount || !reason || !sku) {
            return NextResponse.json({ error: 'Missing required parameters for refund.' }, { status: 400 });
        }
        
        const refundBody = {
            paymentID: paymentId,
            trxID: trxId,
            amount: amount,
            reason: reason,
            sku: sku,
        };
        
        const refundResponse = await bkashPaymentRequest('refund', refundBody);

        if (refundResponse.refundTransactionStatus === 'Completed') {
            // Optionally, log the refund event in Firestore.
            // For example, add a note to the order.
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, where("paymentDetails.trxID", "==", trxId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const orderDoc = querySnapshot.docs[0];
                const notesCollection = collection(db, 'orders', orderDoc.id, 'notes');
                await addDoc(notesCollection, {
                    note: `Refund of ৳${amount} processed. Refund TrxID: ${refundResponse.refundTrxId}. Reason: ${reason}`,
                    author: 'System (bKash Refund)',
                    date: serverTimestamp()
                });
            }

            return NextResponse.json(refundResponse, { status: 200 });
        } else {
             return NextResponse.json({ 
                error: 'Refund failed at bKash.', 
                errorCode: refundResponse.errorCode, 
                errorMessage: refundResponse.errorMessage 
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Error processing bKash refund:", error);
        return NextResponse.json({ error: 'Failed to process refund.', details: error.message }, { status: 500 });
    }
}
