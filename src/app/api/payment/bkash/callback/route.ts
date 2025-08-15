'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (status === 'success') {
        // Redirect to a dedicated execution route
        const executeUrl = new URL(`/api/payment/bkash/execute`, appUrl);
        executeUrl.searchParams.set('paymentID', paymentID || '');
        return NextResponse.redirect(executeUrl);
    } 
    
    // For failure or cancellation, redirect to the frontend fail page
    let reason = 'Payment was not successful.';
    if (status === 'failure') reason = 'Payment failed. Please try again.';
    if (status === 'cancel') reason = 'Payment was cancelled.';
    
    const failUrl = new URL(`/payment/fail`, appUrl);
    failUrl.searchParams.set('reason', reason);
    return NextResponse.redirect(failUrl);
}
