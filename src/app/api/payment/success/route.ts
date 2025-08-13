
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment, getDoc, deleteDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { tran_id } = body;
    
    if (!tran_id) {
        console.error("Transaction ID missing in success response", {body});
        return NextResponse.redirect(new URL(`/payment/fail?reason=data_missing`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    }

    try {
        const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
        const pendingOrderSnap = await getDoc(pendingOrderRef);
        
        if (!pendingOrderSnap.exists()) {
             // This can happen if the IPN has already processed the order.
             // We can assume the process was successful and redirect the user.
             // For a more robust solution, we could query the `orders` collection for the `tran_id`.
             console.log("Pending order not found for tran_id (already processed by IPN?):", tran_id);
             const orderConfirmationUrl = new URL(`/order-confirmation`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
             orderConfirmationUrl.searchParams.set('tran_id', tran_id as string); // Pass tran_id to find the order
             return NextResponse.redirect(orderConfirmationUrl);
        }

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

        await batch.commit();

        return NextResponse.redirect(new URL(`/order-confirmation?orderId=${orderRef.id}`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));

    } catch (error) {
        console.error("Error processing successful payment:", error);
        return NextResponse.redirect(new URL(`/payment/fail?reason=processing_error&tran_id=${tran_id}`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    }
}
