
import { NextRequest, NextResponse } from 'next/server';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
    const body = await req.formData();
    const { tran_id } = Object.fromEntries(body);
    
    if (tran_id) {
        try {
            const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
            const docSnap = await getDoc(pendingOrderRef);
            if(docSnap.exists()){
                await deleteDoc(pendingOrderRef);
                console.log("Payment cancelled, pending order deleted for tran_id:", tran_id);
            }
        } catch (error) {
            console.error("Error deleting pending order for cancelled transaction:", error);
        }
    } else {
        console.log("Payment cancelled, no tran_id provided.", Object.fromEntries(body));
    }
    
    return NextResponse.redirect(new URL('/cart?status=cancelled', req.url), 302);
}
