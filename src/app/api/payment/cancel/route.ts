

import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, deleteDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/firebase-server';

export async function POST(req: NextRequest) {
    const body = await req.formData();
    const tran_id = body.get('tran_id');
    
    if (tran_id) {
        try {
            const pendingOrderRef = doc(db, 'pending_orders', tran_id as string);
            const docSnap = await getDoc(pendingOrderRef);

            if(docSnap.exists()){
                const orderData = docSnap.data();
                const batch = writeBatch(db);

                // Restore stock for each item in the cancelled order
                if (orderData.items && Array.isArray(orderData.items)) {
                    for (const item of orderData.items) {
                        const productRef = doc(db, 'products', item.id);
                        batch.update(productRef, { 
                            "inventory.warehouseStock": increment(item.quantity)
                        });
                    }
                }

                // Delete the pending order
                batch.delete(pendingOrderRef);

                await batch.commit();
                console.log("Payment cancelled, pending order deleted and stock restored for tran_id:", tran_id);
            }
        } catch (error) {
            console.error("Error processing cancelled transaction:", error);
        }
    } else {
        console.log("Payment cancelled, no tran_id provided.", Object.fromEntries(body));
    }
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL('/cart?status=cancelled', appUrl), { status: 302 });
}
