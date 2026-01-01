
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, where, doc, writeBatch, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';

interface Product {
  id: string;
  name: string;
  images: string[];
  variants: {
      sku: string;
      color: string;
      size: string;
      stock: number;
  }[];
}

interface VariantStock {
    productId: string;
    sku: string;
    stock: number;
}

export default function StockManagementPage() {
    const { user, db } = useFirebase();
    const { toast } = useToast();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [changedStocks, setChangedStocks] = useState<VariantStock[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!user?.fullName || !db) return;
            setLoading(true);
            try {
                const productsRef = collection(db, 'products');
                const q = query(productsRef, where("vendor", "==", user.fullName));
                const productSnapshot = await getDocs(q);
                const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                setProducts(productList);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast({ title: "Error", description: "Could not fetch your products.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        if(user) fetchProducts();
    }, [user, db, toast]);
    
    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const handleStockChange = (productId: string, sku: string, newStock: string) => {
        const stockValue = parseInt(newStock, 10);
        if (isNaN(stockValue) || stockValue < 0) return;

        const existingChangeIndex = changedStocks.findIndex(c => c.sku === sku);
        if (existingChangeIndex > -1) {
            const updatedChanges = [...changedStocks];
            updatedChanges[existingChangeIndex].stock = stockValue;
            setChangedStocks(updatedChanges);
        } else {
            setChangedStocks(prev => [...prev, { productId, sku, stock: stockValue }]);
        }

        // Also update the local state for immediate UI feedback
        setProducts(prevProducts => prevProducts.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    variants: p.variants.map(v => v.sku === sku ? { ...v, stock: stockValue } : v)
                };
            }
            return p;
        }));
    };
    
    const handleSaveChanges = async () => {
        if (changedStocks.length === 0) {
            toast({ title: "No Changes", description: "You haven't changed any stock values." });
            return;
        }
        if (!db) return;

        setIsSaving(true);
        const batch = writeBatch(db);

        try {
            for (const change of changedStocks) {
                const productRef = doc(db, 'products', change.productId);
                const productSnap = await getDoc(productRef);
                if (productSnap.exists()) {
                    const productData = productSnap.data();
                    const updatedVariants = productData.variants.map((v: any) => 
                        v.sku === change.sku ? { ...v, stock: change.stock } : v
                    );
                    const totalStock = updatedVariants.reduce((sum: number, v: any) => sum + v.stock, 0);

                    batch.update(productRef, { 
                        variants: updatedVariants,
                        "inventory.stock": totalStock 
                    });
                }
            }

            await batch.commit();
            toast({ title: "Stock Updated", description: "All changes have been saved." });
            setChangedStocks([]);
        } catch (error) {
            console.error("Error updating stock:", error);
            toast({ title: "Error", description: "Failed to save stock changes.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/vendor/products">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
                 <h1 className="text-3xl font-bold">Stock Management</h1>
                 <p className="text-muted-foreground">Quickly update stock levels for all your products and variants.</p>
            </div>
        </div>
        <Button onClick={handleSaveChanges} disabled={isSaving || changedStocks.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : `Save ${changedStocks.length} Change(s)`}
        </Button>
      </div>

       <Card>
        <CardHeader>
           <Input 
             placeholder="Search products..." 
             className="max-w-sm" 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
            />
        </CardHeader>
        <CardContent>
           {loading ? (
             <div className="text-center p-8">Loading products...</div>
           ) : (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] hidden sm:table-cell">Image</TableHead>
                        <TableHead>Product & Variant</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="w-[120px]">Stock</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.flatMap(product => 
                        product.variants.map(variant => (
                            <TableRow key={variant.sku}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image src={product.images[0]} alt={product.name} width={48} height={48} className="rounded-md object-cover"/>
                                </TableCell>
                                <TableCell>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{variant.color} / {variant.size}</p>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{variant.sku}</TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={variant.stock}
                                        onChange={e => handleStockChange(product.id, variant.sku, e.target.value)}
                                        className="h-9"
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
             </Table>
           )}
           {filteredProducts.length === 0 && !loading && (
             <div className="text-center p-8 text-muted-foreground">
                You have not listed any products yet.
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
