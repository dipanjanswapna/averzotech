
import { NextRequest, NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
    const body = await req.formData();
    const { tran_id } = Object.fromEntries(body);

    if (tran_id) {
        try {
            // Delete the corresponding pending order if it exists
            const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
            await deleteDoc(pendingOrderRef);
            console.log("Payment failed, pending order deleted for tran_id:", tran_id);
        } catch (error) {
             console.error("Error deleting pending order for failed transaction:", error);
        }
    } else {
        console.log("Payment failed, no tran_id provided.", Object.fromEntries(body));
    }
    
    return NextResponse.redirect(new URL('/payment/fail', req.url));
}
