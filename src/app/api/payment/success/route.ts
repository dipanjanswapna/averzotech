
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { value_a: userId, value_b, value_c, value_d } = body;
    
    const tran_id_obj = JSON.parse(value_d as string);
    const tran_id = tran_id_obj.tran_id;

    if (!tran_id || !userId || !value_b || !value_c) {
        console.error("Transaction ID or critical order data missing in success response", {body});
        return NextResponse.redirect(new URL(`/payment/fail?reason=data_missing&tran_id=${tran_id}`, req.url));
    }

    try {
        const itemsData = JSON.parse(value_b as string);
        const otherData = JSON.parse(value_c as string);

        const orderData = {
            userId: userId as string,
            items: itemsData.items,
            ...otherData,
        };
        
        const batch = writeBatch(db);
        const orderRef = doc(db, "orders", tran_id as string);
        
        batch.set(orderRef, {
            ...orderData,
            status: 'Processing',
            createdAt: serverTimestamp(),
            paymentDetails: body
        });
        
        // Update stock
        for (const item of orderData.items) {
            const productRef = doc(db, 'products', item.id);
            batch.update(productRef, { "inventory.stock": increment(-item.quantity) });
        }

        await batch.commit();

        // Redirect user to the frontend confirmation page
        return NextResponse.redirect(new URL(`/order-confirmation?orderId=${tran_id}`, req.url));

    } catch (error) {
        console.error("Error processing successful payment:", error);
        return NextResponse.redirect(new URL(`/payment/fail?reason=processing_error&tran_id=${tran_id}`, req.url));
    }
}
