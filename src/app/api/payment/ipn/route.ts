
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment, getDoc, deleteDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { tran_id, status } = body;

    console.log("IPN Received for tran_id:", tran_id, "with status:", status);

    if (status === 'VALID') {
        const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
        const pendingOrderSnap = await getDoc(pendingOrderRef);
        
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
             
             for (const item of orderData.items) {
                 const productRef = doc(db, 'products', item.id);
                 batch.update(productRef, { "inventory.stock": increment(-item.quantity) });
             }
             
             batch.delete(pendingOrderRef);

             try {
                await batch.commit();
                console.log("IPN processed successfully for tran_id:", tran_id);
             } catch (error) {
                 console.error("Error processing IPN:", error);
             }
        }
    } else if (status === 'FAILED' || status === 'CANCELLED') {
         const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
         const docSnap = await getDoc(pendingOrderRef);
         if(docSnap.exists()){
             await deleteDoc(pendingOrderRef);
             console.log("IPN: Pending order deleted for failed/cancelled tran_id:", tran_id);
         }
    }

    return NextResponse.json({ message: 'IPN Processed' }, { status: 200 });
}
