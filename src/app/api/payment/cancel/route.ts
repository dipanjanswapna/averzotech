
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // You can add logic here to handle cancellation, like restoring cart stock if you reserved it
    const body = await req.formData();
    console.log("Payment cancelled:", Object.fromEntries(body));
    
    // Redirect to a user-friendly cancellation page or back to the cart
    return NextResponse.redirect(new URL('/cart?status=cancelled', req.url));
}
