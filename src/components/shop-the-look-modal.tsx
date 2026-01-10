
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, Search, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Skeleton } from './ui/skeleton';

interface ShopTheLookModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Product {
    id: string;
    name: string;
    brand: string;
    images: string[];
    pricing: {
        price: number;
    }
}

export function ShopTheLookModal({ isOpen, onOpenChange }: ShopTheLookModalProps) {
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const { db } = useFirebase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ title: 'File too large', description: 'Please upload an image smaller than 4MB.', variant: 'destructive' });
        return;
      }
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
      setSimilarProducts([]); // Reset previous results
    }
  };
  
  const handleReset = () => {
    setImage(null);
    setSimilarProducts([]);
  }

  const handleSearch = async () => {
    if (!image || !db) {
        toast({ title: 'No Image', description: 'Please upload an image to search.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    setSimilarProducts([]);

    try {
        const reader = new FileReader();
        reader.readAsDataURL(image.file);
        reader.onloadend = async () => {
            const base64data = reader.result;
            
            const response = await fetch('/api/ai/find-similar-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photoDataUri: base64data }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to find similar products.');
            }

            const { productIds } = await response.json();

            if (productIds && productIds.length > 0) {
                const productsRef = collection(db, 'products');
                const q = query(productsRef, where(documentId(), 'in', productIds));
                const productSnap = await getDocs(q);
                const productList = productSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                
                const orderedProducts = productIds.map((id: string) => productList.find(p => p.id === id)).filter(Boolean) as Product[];
                setSimilarProducts(orderedProducts);
            } else {
                 toast({ title: 'No matches found', description: 'We couldn\'t find any similar products in our catalog.'});
            }
        }
    } catch (error: any) {
        toast({ title: 'Search Failed', description: error.message, variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) handleReset(); onOpenChange(open); }}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Shop The Look</DialogTitle>
          <DialogDescription>Upload an image of an outfit you love, and our AI will find similar items from our store.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
            <div className="flex flex-col gap-4">
                <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 text-center flex-1 flex flex-col items-center justify-center">
                    <input type="file" id="look-upload" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isLoading}/>
                    {image ? (
                         <div className="relative w-full h-full">
                            <Image src={image.preview} alt="Look preview" fill className="object-contain rounded-md" />
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleReset} disabled={isLoading}>
                                <X className="h-4 w-4" />
                            </Button>
                         </div>
                    ) : (
                        <label htmlFor="look-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                            <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Drag & drop or <span className="font-semibold text-primary">click to upload</span></p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 4MB</p>
                        </label>
                    )}
                </div>
                 <Button onClick={handleSearch} disabled={isLoading || !image} size="lg">
                    <Search className="mr-2 h-4 w-4" />
                    {isLoading ? 'Analyzing Image...' : 'Find Similar Items'}
                </Button>
            </div>
            <div className="flex flex-col">
                <h3 className="font-semibold mb-2 text-center md:text-left">Our Recommendations</h3>
                <div className="border rounded-lg flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-4 p-4">
                           {Array(4).fill(0).map((_, i) => (
                               <div key={i} className="space-y-2">
                                   <Skeleton className="aspect-[4/5] w-full" />
                                   <Skeleton className="h-4 w-3/4" />
                                   <Skeleton className="h-4 w-1/2" />
                               </div>
                           ))}
                        </div>
                    ) : similarProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 p-4 overflow-y-auto h-full">
                           {similarProducts.map(product => (
                               <Link href={`/product/${product.id}`} key={product.id} className="group" onClick={() => onOpenChange(false)}>
                                   <div className="aspect-[4/5] rounded-lg overflow-hidden bg-secondary">
                                      <Image src={product.images[0]} alt={product.name} width={200} height={250} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                   </div>
                                   <p className="text-sm font-semibold truncate mt-2">{product.name}</p>
                                   <p className="text-xs text-muted-foreground">{product.brand}</p>
                                   <p className="text-sm font-bold">৳{product.pricing.price}</p>
                               </Link>
                           ))}
                        </div>
                    ) : (
                         <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                            <p>Results will appear here after you search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
