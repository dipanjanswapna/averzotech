
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment, getDoc, deleteDoc, query, where, getDocs, limit } from 'firebase/firestore';

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
        return NextResponse.redirect(new URL(`/payment/fail?reason=data_missing`, appUrl));
    }

    try {
        let existingOrderId = await findOrder(tran_id as string);

        if (existingOrderId) {
            console.log(`Order with tran_id ${tran_id} already exists with ID: ${existingOrderId}. Redirecting to confirmation.`);
            return NextResponse.redirect(new URL(`/order-confirmation?orderId=${existingOrderId}`, appUrl));
        }

        const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
        const pendingOrderSnap = await getDoc(pendingOrderRef);
        
        if (!pendingOrderSnap.exists()) {
             console.log("Pending order not found for tran_id (already processed by IPN?):", tran_id);
             await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds for IPN to process
             existingOrderId = await findOrder(tran_id as string);
             if (existingOrderId) {
                 return NextResponse.redirect(new URL(`/order-confirmation?orderId=${existingOrderId}`, appUrl));
             }

             console.error("Could not find order even after waiting. Redirecting with transaction ID for final lookup.");
             const orderConfirmationUrl = new URL(`/order-confirmation`, appUrl);
             orderConfirmationUrl.searchParams.set('tran_id', tran_id as string); 
             return NextResponse.redirect(orderConfirmationUrl);
        }

        const orderData = pendingOrderSnap.data();
        const batch = writeBatch(db);
        const newOrderRef = doc(collection(db, "orders"));
        
        batch.set(newOrderRef, {
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

        return NextResponse.redirect(new URL(`/order-confirmation?orderId=${newOrderRef.id}`, appUrl));

    } catch (error) {
        console.error("Error processing successful payment:", error);
        return NextResponse.redirect(new URL(`/payment/fail?reason=processing_error&tran_id=${tran_id}`, appUrl));
    }
}
