
import { NextRequest, NextResponse } from 'next/server';
import { calculateCharge } from '@/lib/redx';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { delivery_area_id, cash_collection_amount, weight } = body;

        if (!delivery_area_id) {
            return NextResponse.json({ error: 'Missing delivery_area_id' }, { status: 400 });
        }

        const chargeData = await calculateCharge({
            delivery_area_id,
            cash_collection_amount,
            weight,
        });

        return NextResponse.json(chargeData, { status: 200 });

    } catch (error: any) {
        console.error("Error calculating shipping charge:", error);
        return NextResponse.json({ error: 'Failed to calculate shipping charge.', details: error.message }, { status: 500 });
    }
}
