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

    if (!shippingAddress) {
         return NextResponse.json({ error: 'Shipping address is missing.' }, { status: 400 });
    }
    if (!store_id || !store_passwd) {
        return NextResponse.json({ error: 'SSLCommerz store ID or password is not set.' }, { status: 500 });
    }
    
    const { name, email, phone, fullAddress } = shippingAddress;
    const tran_id = nanoid();

    const post_body: any = {};
    post_body.store_id = store_id;
    post_body.store_passwd = store_passwd;
    post_body.total_amount = total;
    post_body.currency = 'BDT';
    post_body.tran_id = tran_id;
    post_body.success_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success`;
    post_body.fail_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/fail`;
    post_body.cancel_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cancel`;
    post_body.ipn_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/ipn`;
    post_body.shipping_method = shippingAddress.method || 'Courier';
    post_body.product_name = items.map((item: any) => item.name).join(', ').substring(0, 99) || 'Assorted Items';
    post_body.product_category = 'eCommerce';
    post_body.product_profile = 'general';
    post_body.cus_name = name;
    post_body.cus_email = email;
    post_body.cus_add1 = fullAddress;
    post_body.cus_add2 = 'N/A';
    post_body.cus_city = shippingAddress.district || 'Dhaka';
    post_body.cus_state = shippingAddress.division || 'Dhaka';
    post_body.cus_postcode = '1000';
    post_body.cus_country = 'Bangladesh';
    post_body.cus_phone = phone;
    post_body.ship_name = name;
    post_body.ship_add1 = fullAddress;
    post_body.ship_add2 = 'N/A';
    post_body.ship_city = shippingAddress.district || 'Dhaka';
    post_body.ship_state = shippingAddress.division || 'Dhaka';
    post_body.ship_postcode = '1000';
    post_body.ship_country = 'Bangladesh';


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
