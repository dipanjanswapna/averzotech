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

    const params = new URLSearchParams();
    params.append('store_id', store_id);
    params.append('store_passwd', store_passwd);
    params.append('total_amount', String(Math.round(total)));
    params.append('currency', 'BDT');
    params.append('tran_id', tran_id);
    params.append('success_url', `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success`);
    params.append('fail_url', `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/fail`);
    params.append('cancel_url', `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cancel`);
    params.append('ipn_url', `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/ipn`);
    params.append('shipping_method', shippingAddress.method || 'Courier');
    params.append('product_name', items.map((item: any) => item.name).join(', ').substring(0, 99) || 'Assorted Items');
    params.append('product_category', 'eCommerce');
    params.append('product_profile', 'general');
    params.append('cus_name', name);
    params.append('cus_email', email);
    params.append('cus_add1', fullAddress);
    params.append('cus_add2', 'N/A');
    params.append('cus_city', shippingAddress.district || 'Dhaka');
    params.append('cus_state', shippingAddress.division || 'Dhaka');
    params.append('cus_postcode', '1000');
    params.append('cus_country', 'Bangladesh');
    params.append('cus_phone', phone);
    params.append('ship_name', name);
    params.append('ship_add1', fullAddress);
    params.append('ship_add2', 'N/A');
    params.append('ship_city', shippingAddress.district || 'Dhaka');
    params.append('ship_state', shippingAddress.division || 'Dhaka');
    params.append('ship_postcode', '1000');
    params.append('ship_country', 'Bangladesh');

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
            body: params,
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
