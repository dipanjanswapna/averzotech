
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment, getDoc, deleteDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore: db } = initializeFirebase();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const { tran_id, status } = body;

        console.log("IPN Received for tran_id:", tran_id, "with status:", status);
        
        const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
        const pendingOrderSnap = await getDoc(pendingOrderRef);

        if (status === 'VALID') {
            if (pendingOrderSnap.exists()) {
                const orderData = pendingOrderSnap.data();
                const batch = writeBatch(db);
                const orderRef = doc(collection(db, "orders"));
                
                batch.set(orderRef, {
                    ...orderData,
                    status: 'Processing',
                    paymentDetails: body,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                
                // Stock was already decremented at payment initiation.
                // Now we just delete the pending order.
                batch.delete(pendingOrderRef);

                await batch.commit();
                console.log("IPN processed successfully for tran_id:", tran_id);
            }
        } else if (status === 'FAILED' || status === 'CANCELLED') {
            if(pendingOrderSnap.exists()){
                const orderData = pendingOrderSnap.data();
                const batch = writeBatch(db);

                 // Restore stock for each item in the failed/cancelled order
                for (const item of orderData.items) {
                    const productRef = doc(db, 'products', item.id);
                    batch.update(productRef, { "inventory.stock": increment(item.quantity) });
                }

                // Delete the pending order
                batch.delete(pendingOrderRef);
                
                await batch.commit();
                console.log("IPN: Pending order deleted and stock restored for failed/cancelled tran_id:", tran_id);
            }
        }
    } catch (error) {
        console.error("Error processing IPN:", error);
        return NextResponse.json({ message: 'Error processing IPN' }, { status: 500 });
    }

    return NextResponse.json({ message: 'IPN Processed' }, { status: 200 });
}
