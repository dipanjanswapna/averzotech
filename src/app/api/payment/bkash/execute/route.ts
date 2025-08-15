
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, writeBatch, increment, collection, serverTimestamp } from 'firebase/firestore';

const bKashConfig = {
    baseURL: process.env.BKASH_IS_LIVE === 'true' ? 'https://tokenized.pay.bka.sh/v1.2.0-beta' : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    app_key: process.env.BKASH_APP_KEY || '',
    app_secret: process.env.BKASH_APP_SECRET || '',
    username: process.env.BKASH_USERNAME || '',
    password: process.env.BKASH_PASSWORD || '',
};

async function getBkashToken() {
    const response = await fetch(`${'${bKashConfig.baseURL}'}/tokenized/checkout/token/grant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'username': bKashConfig.username, 'password': bKashConfig.password },
        body: JSON.stringify({ app_key: bKashConfig.app_key, app_secret: bKashConfig.app_secret }),
        cache: 'no-store'
    });
    return (await response.json()).id_token;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get('paymentID');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!paymentID) {
        return NextResponse.redirect(new URL(`/payment/fail?reason=Invalid_request`, appUrl), { status: 302 });
    }

    try {
        const id_token = await getBkashToken();
        const executeResponse = await fetch(`${'${bKashConfig.baseURL}'}/tokenized/checkout/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': id_token, 'X-App-Key': bKashConfig.app_key },
            body: JSON.stringify({ paymentID }),
            cache: 'no-store'
        });
        const executeData = await executeResponse.json();

        if (executeData.statusCode === '0000' && executeData.transactionStatus === 'Completed') {
            const pendingOrderRef = doc(db, 'pending_orders', paymentID);
            const pendingOrderSnap = await getDoc(pendingOrderRef);
            
            if (!pendingOrderSnap.exists()) {
                return NextResponse.redirect(new URL(`/payment/fail?reason=Order_not_found`, appUrl), { status: 302 });
            }

            const orderData = pendingOrderSnap.data();
            const batch = writeBatch(db);
            const newOrderRef = doc(collection(db, "orders"));
            
            batch.set(newOrderRef, { ...orderData, status: 'Processing', paymentDetails: executeData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            
            for (const item of orderData.items) {
                const productRef = doc(db, 'products', item.id);
                batch.update(productRef, { "inventory.stock": increment(-item.quantity) });
            }
            
            batch.delete(pendingOrderRef);
            await batch.commit();

            return NextResponse.redirect(new URL(`/order-confirmation?orderId=${'${newOrderRef.id}'}`, appUrl), { status: 302 });
        } else {
             console.error("bKash execute payment failed:", executeData);
             return NextResponse.redirect(new URL(`/payment/fail?reason=${'${executeData.statusMessage || 'Payment_failed'}'}`, appUrl), { status: 302 });
        }

    } catch (error) {
        console.error("Error executing bKash payment:", error);
        return NextResponse.redirect(new URL(`/payment/fail?reason=Internal_server_error`, appUrl), { status: 302 });
    }
}
