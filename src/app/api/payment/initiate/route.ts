
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
const SSLCommerz = require('sslcommerz-lts');
require('dotenv').config();

export async function POST(req: NextRequest) {
    const orderData = await req.json();
    const { total, tran_id, shippingAddress, items, userId } = orderData;
    
    const store_id = process.env.STORE_ID;
    const store_passwd = process.env.STORE_PASSWORD;
    const is_live = process.env.IS_LIVE === 'true';
    
    if (!shippingAddress) {
         return NextResponse.json({ error: 'Shipping address is missing.' }, { status: 400 });
    }
    if (!store_id || !store_passwd) {
        return NextResponse.json({ error: 'SSLCommerz store ID or password is not set.' }, { status: 500 });
    }
    
    const { name, email, phone, fullAddress } = shippingAddress;
    
    const data = {
        total_amount: Math.round(total),
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success`,
        fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/fail`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cancel`,
        ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/ipn`,
        shipping_method: 'Courier',
        product_name: items.map((item: any) => item.name).join(', ').substring(0, 99) || 'Assorted Items',
        product_category: 'eCommerce',
        product_profile: 'general',
        cus_name: name,
        cus_email: email,
        cus_add1: fullAddress,
        cus_add2: 'N/A',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: phone,
        cus_fax: 'N/A',
        ship_name: name,
        ship_add1: fullAddress,
        ship_add2: 'N/A',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    try {
        const pendingOrderRef = doc(db, 'pending_orders', tran_id);
        await setDoc(pendingOrderRef, {
             ...orderData,
             createdAt: serverTimestamp()
        });
        
        const sslcz = new SSLCommerz(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);

        if (apiResponse.status === 'SUCCESS' && apiResponse.GatewayPageURL) {
            return NextResponse.json({ GatewayPageURL: apiResponse.GatewayPageURL });
        } else {
            console.error("SSLCommerz init failed:", apiResponse);
            return NextResponse.json({ error: 'Failed to create payment session.', details: apiResponse.failedreason || 'Unknown reason' }, { status: 500 });
        }
    } catch (error) {
        console.error("SSLCommerz init error:", error);
        return NextResponse.json({ error: 'An error occurred during payment initiation.' }, { status: 500 });
    }
}
