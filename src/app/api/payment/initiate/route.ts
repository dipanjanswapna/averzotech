
import { NextRequest, NextResponse } from 'next/server';
const SSLCommerz = require('sslcommerz-lts');

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { total, tran_id, shippingAddress, items, userId } = body;
    const { name, email, phone, fullAddress } = shippingAddress;
    
    if (!process.env.STORE_ID || !process.env.STORE_PASSWORD) {
        return NextResponse.json({ error: 'SSLCommerz store ID or password is not set.' }, { status: 500 });
    }

    const data = {
        total_amount: total,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success?tran_id=${tran_id}`,
        fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/fail?tran_id=${tran_id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/cancel?tran_id=${tran_id}`,
        ipn_url: '/ipn', // Optional IPN URL
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
        value_b: JSON.stringify(items), // Pass cart items for order creation on success
    };

    const sslcz = new SSLCommerz(process.env.STORE_ID, process.env.STORE_PASSWORD, process.env.IS_LIVE === 'true');
    
    try {
        const apiResponse = await sslcz.init(data);
        if (apiResponse.status === 'SUCCESS') {
            return NextResponse.json(apiResponse);
        } else {
            return NextResponse.json({ error: 'Failed to create payment session.' }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred during payment initiation.' }, { status: 500 });
    }
}
