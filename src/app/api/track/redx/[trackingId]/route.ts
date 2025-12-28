
import { NextRequest, NextResponse } from 'next/server';
import { trackParcel } from '@/lib/redx';

export async function GET(
  req: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  const trackingId = params.trackingId;

  if (!trackingId) {
    return NextResponse.json({ error: 'Tracking ID is required' }, { status: 400 });
  }

  try {
    const trackingData = await trackParcel(trackingId);
    return NextResponse.json(trackingData);
  } catch (error: any) {
    console.error(`Failed to track parcel ${trackingId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information.', details: error.message },
      { status: 500 }
    );
  }
}
