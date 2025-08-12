
import { NextRequest, NextResponse } from 'next/server';
const SSLCommerz = require('sslcommerz-lts');

export async function POST(req: NextRequest) {
    const orderData = await req.json();
    const { total, tran_id, shippingAddress, items, userId } = orderData;
    
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
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?orderId=${tran_id}`,
        fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/fail`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        ipn_url: '/api/payment/ipn', // You may need to implement this
        shipping_method: 'Courier',
        product_name: items.map((item: any) => item.name).join(', '),
        product_category: 'eCommerce',
        product_profile: 'general',
        cus_name: name,
        cus_email: email,
        cus_add1: fullAddress,
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: phone,
        ship_name: name,
        ship_add1: fullAddress,
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
        value_a: userId,
        value_b: JSON.stringify(orderData), // Pass the full order data
    };

    const sslcz = new SSLCommerz(process.env.STORE_ID, process.env.STORE_PASSWORD, process.env.IS_LIVE === 'true');
    
    try {
        const apiResponse = await sslcz.init(data);
        if (apiResponse.status === 'SUCCESS') {
            return NextResponse.json(apiResponse);
        } else {
            console.error("SSLCommerz init failed:", apiResponse);
            return NextResponse.json({ error: 'Failed to create payment session.' }, { status: 500 });
        }
    } catch (error) {
        console.error("SSLCommerz init error:", error);
        return NextResponse.json({ error: 'An error occurred during payment initiation.' }, { status: 500 });
    }
}
