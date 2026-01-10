
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase-server';
import { findSimilarProducts } from '@/ai/flows/find-similar-products';

export async function POST(req: NextRequest) {
  try {
    const { photoDataUri } = await req.json();

    if (!photoDataUri) {
      return NextResponse.json({ error: 'Missing photoDataUri' }, { status: 400 });
    }

    // 1. Fetch all products from Firestore
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('organization.status', '==', 'active'));
    const productSnapshot = await getDocs(q);
    const products = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            description: data.description,
            tags: data.organization.tags || []
        }
    });

    if (products.length === 0) {
        return NextResponse.json({ productIds: [] });
    }

    // 2. Call the Genkit flow
    const result = await findSimilarProducts({
      photoDataUri,
      products,
    });

    // 3. Return the result
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in find-similar-products API:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
