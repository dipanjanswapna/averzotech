
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, PlusCircle, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirebase } from '@/firebase';

interface Product {
  id: string;
  name: string;
  vendor: string;
  images: string[];
  pricing: {
      price: number;
  }
}

interface InvoiceItem extends Product {
    quantity: number;
    total: number;
}

export default function NewVendorInvoicePage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user, db } = useFirebase();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
    
    const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<InvoiceItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Check for PO data in localStorage
        const poDataString = localStorage.getItem('poForInvoice');
        if (poDataString) {
            try {
                const poData = JSON.parse(poDataString);
                const prefillItems = poData.items.map((item: any) => ({
                    id: item.productId,
                    name: item.productName,
                    pricing: { price: item.price },
                    quantity: item.quantity,
                    total: item.total,
                    images: [], // Images aren't critical for invoice items
                    vendor: user?.fullName || ''
                }));
                setSelectedItems(prefillItems);
                toast({
                    title: "Invoice Pre-filled",
                    description: "Items from your Purchase Order have been added."
                });
            } catch (error) {
                console.error("Failed to parse PO data for invoice:", error);
            } finally {
                localStorage.removeItem('poForInvoice');
            }
        }
    }, [user, toast]);


    useEffect(() => {
        const fetchProducts = async () => {
            if (!user?.fullName || !db) return;
            try {
                const productsRef = collection(db, 'products');
                const q = query(productsRef, where("vendor", "==", user.fullName));
                const productSnapshot = await getDocs(q);
                const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                setVendorProducts(productList);
            } catch (error) {
                console.error("Error fetching vendor products: ", error);
            }
        };
        if(user) {
            fetchProducts();
        }
    }, [user, db]);

    const filteredProducts = useMemo(() => {
        return vendorProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [vendorProducts, searchTerm]);

    const handleAddItem = (product: Product) => {
        if (!selectedItems.some(item => item.id === product.id)) {
            setSelectedItems(prev => [...prev, { ...product, quantity: 1, total: product.pricing.price }]);
        }
        setIsProductSelectorOpen(false);
        setSearchTerm('');
    };

    const handleQuantityChange = (id: string, quantity: number) => {
        const newQuantity = Math.max(1, quantity);
        setSelectedItems(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: newQuantity, total: item.pricing.price * newQuantity } : item
        ));
    };

    const handleRemoveItem = (id: string) => {
        setSelectedItems(prev => prev.filter(item => item.id !== id));
    };
    
    const invoiceTotal = useMemo(() => {
        return selectedItems.reduce((sum, item) => sum + item.total, 0);
    }, [selectedItems]);

    const handleSaveInvoice = async (status: 'Draft' | 'Sent') => {
        if (selectedItems.length === 0) {
            toast({ title: "No items added", description: "Please add at least one product to the invoice.", variant: "destructive" });
            return;
        }
        if (!user || !db) return;
        
        setIsLoading(true);
        try {
            const invoiceData = {
                vendorName: user.fullName,
                vendorId: user.uid,
                status,
                items: selectedItems.map(({id, name, pricing, quantity, total}) => ({
                    productId: id,
                    productName: name,
                    price: pricing.price,
                    quantity,
                    total
                })),
                total: invoiceTotal,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'vendorInvoices'), invoiceData);
            
            toast({ title: `Invoice ${status}`, description: `Your invoice has been successfully saved as ${status}.`});
            router.push('/vendor/invoices');

        } catch (error) {
            console.error("Error saving invoice:", error);
            toast({ title: "Error", description: "Could not save the invoice.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/vendor/invoices">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">New Invoice</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
              <CardDescription>Add products from your catalog to this invoice.</CardDescription>
            </CardHeader>
            <CardContent>
                {selectedItems.length > 0 ? (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] hidden sm:table-cell">Image</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image src={item.images?.[0] || 'https://placehold.co/64x64.png'} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            value={item.quantity} 
                                            onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))} 
                                            className="w-20"
                                            min="1"
                                        />
                                    </TableCell>
                                    <TableCell>৳{item.pricing.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">৳{item.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No products added to this invoice yet.</p>
                    </div>
                )}
                 <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline" className="mt-4">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Select a Product</DialogTitle>
                        </DialogHeader>
                         <div className="relative p-4">
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search your products..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                         </div>
                        <ScrollArea className="h-96">
                           <div className="p-4 grid grid-cols-1 gap-2">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-secondary cursor-pointer" onClick={() => handleAddItem(product)}>
                                    <Image src={product.images[0]} alt={product.name} width={40} height={40} className="rounded-md object-cover"/>
                                    <p className="font-medium">{product.name}</p>
                                </div>
                            ))}
                           </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </CardContent>
            <CardFooter className="flex justify-end bg-secondary/50 p-4">
                <div className="text-right">
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">৳{invoiceTotal.toFixed(2)}</p>
                </div>
            </CardFooter>
          </Card>

           <div className="flex justify-end gap-2">
                <Button variant="outline" disabled={isLoading} onClick={() => handleSaveInvoice('Draft')}>Save as Draft</Button>
                <Button onClick={() => handleSaveInvoice('Sent')} disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Invoice to Averzo'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
