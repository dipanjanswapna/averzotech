
import { NextRequest, NextResponse } from 'next/server';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export async function POST(req: NextRequest) {
    // You can add logic here to log the failed attempt
    const body = await req.formData();
    console.log("Payment failed:", Object.fromEntries(body));
    
    // Redirect to a user-friendly failure page
    return NextResponse.redirect(new URL('/payment/fail', req.url));
}
