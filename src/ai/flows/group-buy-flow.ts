'use server';
/**
 * @fileOverview Manages group buying logic.
 *
 * - manageGroupBuy: A function to list, create, or join group buys.
 * - GroupBuy: The type definition for a group buy object.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  increment,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const GroupBuySchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  productBrand: z.string(),
  productImage: z.string().optional(),
  productOriginalPrice: z.number(),
  groupPrice: z.number(),
  status: z.enum(['active', 'completed', 'failed']),
  targetCount: z.number(),
  currentCount: z.number(),
  hostId: z.string(),
  participants: z.array(z.string()),
  createdAt: z.any(),
  expiresAt: z.any(),
});
export type GroupBuy = z.infer<typeof GroupBuySchema>;

const ManageGroupBuyInputSchema = z.object({
  action: z.enum(['listActive', 'create', 'join']),
  productId: z.string().optional(),
  userId: z.string().optional(),
  groupId: z.string().optional(),
});

export async function manageGroupBuy(input: z.infer<typeof ManageGroupBuyInputSchema>): Promise<any> {
    const groupBuysCol = collection(db, 'groupBuys');

    switch (input.action) {
        case 'listActive': {
            const q = query(groupBuysCol, where('status', '==', 'active'));
            const snapshot = await getDocs(q);
            const groups: GroupBuy[] = [];
            snapshot.forEach(doc => {
                groups.push({ id: doc.id, ...doc.data() } as GroupBuy);
            });
            // You might want to add a server-side check for expiry here as well
            return groups;
        }
        
        case 'create': {
            if (!input.productId || !input.userId) throw new Error("Product ID and User ID are required to create a group.");
            
            const productRef = doc(db, 'products', input.productId);
            const productSnap = await getDoc(productRef);
            if (!productSnap.exists() || !productSnap.data()?.groupBuy?.isActive) {
                throw new Error("This product is not available for group buy.");
            }
            const productData = productSnap.data();

            const newGroup = {
                productId: input.productId,
                productName: productData.name,
                productBrand: productData.brand,
                productImage: productData.images[0] || '',
                productOriginalPrice: productData.pricing.price,
                groupPrice: productData.groupBuy.groupPrice,
                status: 'active',
                targetCount: productData.groupBuy.targetCount,
                currentCount: 1,
                hostId: input.userId,
                participants: [input.userId],
                createdAt: serverTimestamp(),
                expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 48 hours from now
            };
            const docRef = await addDoc(groupBuysCol, newGroup);
            return { id: docRef.id, ...newGroup };
        }

        case 'join': {
             if (!input.groupId || !input.userId) throw new Error("Group ID and User ID are required to join a group.");

             const groupRef = doc(db, 'groupBuys', input.groupId);
             const groupSnap = await getDoc(groupRef);
             if (!groupSnap.exists() || groupSnap.data()?.status !== 'active') {
                 throw new Error("This group is no longer active.");
             }
             
             await updateDoc(groupRef, {
                 participants: arrayUnion(input.userId),
                 currentCount: increment(1)
             });
             
             // Check if group is now complete
             if (groupSnap.data()?.currentCount + 1 >= groupSnap.data()?.targetCount) {
                 await updateDoc(groupRef, { status: 'completed' });
             }

             return { success: true, message: "Successfully joined the group." };
        }
    }
}

ai.defineFlow(
  {
    name: 'manageGroupBuyFlow',
    inputSchema: ManageGroupBuyInputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    return await manageGroupBuy(input);
  }
);
