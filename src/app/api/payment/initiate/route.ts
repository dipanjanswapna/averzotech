import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    const orderData = await req.json();
    const { total, shippingAddress, items, userId, payment, customerName } = orderData;
    
    const store_id = process.env.STORE_ID;
    const store_passwd = process.env.STORE_PASSWORD;
    const is_live = process.env.IS_LIVE === 'true';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!shippingAddress) {
         return NextResponse.json({ error: 'Shipping address is missing.' }, { status: 400 });
    }
    if (!store_id || !store_passwd) {
        console.error("SSLCommerz store ID or password is not set in .env file.");
        return NextResponse.json({ error: 'Payment gateway is not configured properly.' }, { status: 500 });
    }
    
    const { name, email, phone, fullAddress } = shippingAddress;
    const tran_id = nanoid();

    const post_body: any = {
        store_id,
        store_passwd,
        total_amount: total,
        currency: 'BDT',
        tran_id,
        success_url: `${appUrl}/api/payment/success`,
        fail_url: `${appUrl}/api/payment/fail`,
        cancel_url: `${appUrl}/api/payment/cancel`,
        ipn_url: `${appUrl}/api/payment/ipn`,
        shipping_method: shippingAddress.method || 'Courier',
        product_name: items.map((item: any) => item.name).join(', ').substring(0, 99) || 'Assorted Items',
        product_category: 'eCommerce',
        product_profile: 'general',
        cus_name: name,
        cus_email: email,
        cus_add1: fullAddress,
        cus_add2: 'N/A',
        cus_city: shippingAddress.district || 'Dhaka',
        cus_state: shippingAddress.division || 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: phone,
        ship_name: name,
        ship_add1: fullAddress,
        ship_add2: 'N/A',
        ship_city: shippingAddress.district || 'Dhaka',
        ship_state: shippingAddress.division || 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
    };

    try {
        const pendingOrderRef = doc(db, 'pending_orders', tran_id);
        await setDoc(pendingOrderRef, {
             ...orderData,
             tran_id: tran_id,
             createdAt: serverTimestamp()
        });
        
        const sslcz_url = is_live 
            ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php' 
            : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
        
        const response = await fetch(sslcz_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(post_body),
            cache: 'no-store'
        });

        const responseData = await response.json();
        
        if (responseData.status === 'SUCCESS' && responseData.GatewayPageURL) {
            return NextResponse.json({ GatewayPageURL: responseData.GatewayPageURL });
        } else {
            console.error("SSLCommerz init failed:", responseData);
            return NextResponse.json({ error: 'Failed to create payment session.', details: responseData.failedreason || 'Unknown reason' }, { status: 500 });
        }
    } catch (error) {
        console.error("SSLCommerz init error:", error);
        return NextResponse.json({ error: 'An error occurred during payment initiation.' }, { status: 500 });
    }
}
