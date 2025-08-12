
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment, getDoc, deleteDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { tran_id } = body;
    
    if (!tran_id) {
        console.error("Transaction ID missing in success response", {body});
        return NextResponse.redirect(new URL(`/payment/fail?reason=data_missing`, req.url));
    }

    try {
        // 1. Get the pending order data from Firestore
        const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
        const pendingOrderSnap = await getDoc(pendingOrderRef);
        
        if (!pendingOrderSnap.exists()) {
             console.error("Pending order not found for tran_id:", tran_id);
             return NextResponse.redirect(new URL(`/payment/fail?reason=order_not_found&tran_id=${tran_id}`, req.url));
        }

        const orderData = pendingOrderSnap.data();

        // 2. Create the final order and update stock in a batch
        const batch = writeBatch(db);
        const orderRef = doc(db, "orders", tran_id as string);
        
        batch.set(orderRef, {
            ...orderData,
            status: 'Processing',
            createdAt: orderData.createdAt, // Preserve original creation time
            paymentDetails: body,
            updatedAt: serverTimestamp()
        });
        
        // Update stock for each item in the order
        for (const item of orderData.items) {
            const productRef = doc(db, 'products', item.id);
            batch.update(productRef, { "inventory.stock": increment(-item.quantity) });
        }
        
        // 3. Delete the pending order
        batch.delete(pendingOrderRef);

        // 4. Commit the batch
        await batch.commit();

        // 5. Redirect user to the frontend confirmation page
        return NextResponse.redirect(new URL(`/order-confirmation?orderId=${tran_id}`, req.url));

    } catch (error) {
        console.error("Error processing successful payment:", error);
        return NextResponse.redirect(new URL(`/payment/fail?reason=processing_error&tran_id=${tran_id}`, req.url));
    }
}
