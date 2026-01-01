
import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryInfoByPincode } from '@/lib/location';

export async function POST(req: NextRequest) {
    try {
        const { pincode } = await req.json();

        if (!pincode || typeof pincode !== 'string') {
            return NextResponse.json({ error: 'A valid pincode is required.' }, { status: 400 });
        }

        const deliveryInfo = await getDeliveryInfoByPincode(pincode);

        if (!deliveryInfo) {
            return NextResponse.json({ error: 'Delivery not available for this pincode.' }, { status: 404 });
        }

        return NextResponse.json(deliveryInfo, { status: 200 });

    } catch (error: any) {
        console.error("Error checking delivery:", error);
        return NextResponse.json({ error: 'Failed to check delivery information.', details: error.message }, { status: 500 });
    }
}
