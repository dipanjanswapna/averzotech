
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
const SSLCommerz = require('sslcommerz-lts');

export async function POST(req: NextRequest) {
    const orderData = await req.json();
    const { total, tran_id, shippingAddress, items, userId, customerName, payment } = orderData;
    
    if (!shippingAddress) {
         return NextResponse.json({ error: 'Shipping address is missing.' }, { status: 400 });
    }
    
    const { name, email, phone, fullAddress } = shippingAddress;
    
    if (!process.env.STORE_ID || !process.env.STORE_PASSWORD) {
        return NextResponse.json({ error: 'SSLCommerz store ID or password is not set.' }, { status: 500 });
    }

    const data = {
        total_amount: total,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success`,
        fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/fail?tran_id=${tran_id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/ipn`, // Optional: for server-to-server notifications
        shipping_method: 'Courier',
        product_name: items.map((item: any) => item.name).join(', ').substring(0, 99), // Product name max 100 chars
        product_category: 'eCommerce',
        product_profile: 'general',
        cus_name: name,
        cus_email: email,
        cus_add1: fullAddress,
        cus_city: 'Dhaka', // Can be dynamic later
        cus_state: 'Dhaka', // Can be dynamic later
        cus_postcode: '1000', // Can be dynamic later
        cus_country: 'Bangladesh',
        cus_phone: phone,
        ship_name: name,
        ship_add1: fullAddress,
        ship_city: 'Dhaka', // Can be dynamic later
        ship_state: 'Dhaka', // Can be dynamic later
        ship_postcode: '1000', // Can be dynamic later
        ship_country: 'Bangladesh',
    };

    try {
        // Before initiating payment, save the order data to a temporary collection
        const pendingOrderRef = doc(db, 'pending_orders', tran_id);
        await setDoc(pendingOrderRef, {
             ...orderData,
             createdAt: serverTimestamp()
        });
        
        const sslcz = new SSLCommerz(process.env.STORE_ID, process.env.STORE_PASSWORD, process.env.IS_LIVE === 'true');
        const apiResponse = await sslcz.init(data);

        if (apiResponse.status === 'SUCCESS' && apiResponse.GatewayPageURL) {
            return NextResponse.json(apiResponse);
        } else {
            console.error("SSLCommerz init failed:", apiResponse);
            return NextResponse.json({ error: 'Failed to create payment session.', details: apiResponse }, { status: 500 });
        }
    } catch (error) {
        console.error("SSLCommerz init error:", error);
        return NextResponse.json({ error: 'An error occurred during payment initiation.' }, { status: 500 });
    }
}
