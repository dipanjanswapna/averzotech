

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
import { useEffect, useState, useMemo, useCallback } from 'react';
import { collection, getDocs, query, where, doc, writeBatch, getDoc, runTransaction } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';

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
  inventory: {
      physicalStoreStock?: number;
  }
}

interface VariantStockChange {
    productId: string;
    sku: string;
    stock: number;
}

interface PhysicalStockChange {
    productId: string;
    stock: number;
}

export default function StockManagementPage() {
    const { user, db } = useFirebase();
    const { toast } = useToast();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [changedVariantStocks, setChangedVariantStocks] = useState<Record<string, VariantStockChange>>({});
    const [changedPhysicalStocks, setChangedPhysicalStocks] = useState<Record<string, PhysicalStockChange>>({});

    const fetchProducts = useCallback(async () => {
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
    }, [user, db, toast]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    
    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const handleVariantStockChange = (productId: string, sku: string, newStockStr: string) => {
        const newStock = parseInt(newStockStr, 10);
        if (isNaN(newStock) || newStock < 0) return;

        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    variants: p.variants.map(v => v.sku === sku ? {...v, stock: newStock} : v)
                }
            }
            return p;
        }));
        
        setChangedVariantStocks(prev => ({
            ...prev,
            [sku]: { productId, sku, stock: newStock }
        }));
    };
    
    const handlePhysicalStockChange = (productId: string, newStockStr: string) => {
        const newStock = parseInt(newStockStr, 10);
         if (isNaN(newStock) || newStock < 0) return;

        setProducts(prev => prev.map(p => 
            p.id === productId ? {...p, inventory: {...p.inventory, physicalStoreStock: newStock}} : p
        ));
        
        setChangedPhysicalStocks(prev => ({
            ...prev,
            [productId]: { productId, stock: newStock }
        }));
    }

    const handleSaveChanges = async () => {
        const variantChanges = Object.values(changedVariantStocks);
        const physicalChanges = Object.values(changedPhysicalStocks);

        if (variantChanges.length === 0 && physicalChanges.length === 0) {
            toast({ title: "No Changes", description: "You haven't changed any stock values." });
            return;
        }
        if (!db) return;

        setIsSaving(true);

        try {
            await runTransaction(db, async (transaction) => {
                const productUpdates = new Map<string, any>();

                // Process variant stock changes
                for (const change of variantChanges) {
                    if (!productUpdates.has(change.productId)) {
                        const productRef = doc(db, 'products', change.productId);
                        const productSnap = await transaction.get(productRef);
                        if (!productSnap.exists()) throw new Error(`Product ${change.productId} not found!`);
                        productUpdates.set(change.productId, productSnap.data());
                    }
                    const productData = productUpdates.get(change.productId);
                    productData.variants = productData.variants.map((v: any) => 
                        v.sku === change.sku ? { ...v, stock: change.stock } : v
                    );
                }

                // Process physical stock changes
                 for (const change of physicalChanges) {
                    if (!productUpdates.has(change.productId)) {
                        const productRef = doc(db, 'products', change.productId);
                        const productSnap = await transaction.get(productRef);
                        if (!productSnap.exists()) throw new Error(`Product ${change.productId} not found!`);
                        productUpdates.set(change.productId, productSnap.data());
                    }
                    const productData = productUpdates.get(change.productId);
                    productData.inventory.physicalStoreStock = change.stock;
                }

                // Calculate new total stock and update in transaction
                for (const [productId, productData] of productUpdates.entries()) {
                    const productRef = doc(db, 'products', productId);
                    const warehouseStock = productData.variants.reduce((sum: number, v: any) => sum + v.stock, 0);
                    const physicalStock = productData.inventory.physicalStoreStock || 0;
                    productData.inventory.warehouseStock = warehouseStock;
                    productData.inventory.stock = warehouseStock + physicalStock;
                    transaction.update(productRef, {
                        variants: productData.variants,
                        'inventory.stock': productData.inventory.stock,
                        'inventory.warehouseStock': productData.inventory.warehouseStock,
                        'inventory.physicalStoreStock': productData.inventory.physicalStoreStock
                    });
                }
            });

            toast({ title: "Stock Updated", description: "All changes have been saved successfully." });
            setChangedVariantStocks({});
            setChangedPhysicalStocks({});
        } catch (error) {
            console.error("Error updating stock:", error);
            toast({ title: "Error", description: `Failed to save stock changes. ${error}`, variant: "destructive" });
             // Optionally refetch data to revert UI changes on error
            fetchProducts();
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
        <Button onClick={handleSaveChanges} disabled={isSaving || (Object.keys(changedVariantStocks).length === 0 && Object.keys(changedPhysicalStocks).length === 0)}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : `Save ${Object.keys(changedVariantStocks).length + Object.keys(changedPhysicalStocks).length} Change(s)`}
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
                        <TableHead className="w-[120px]">Warehouse Stock</TableHead>
                        <TableHead className="w-[120px]">Physical Store</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.flatMap(product => 
                        (Array.isArray(product.variants) && product.variants.length > 0 ? product.variants : [{sku: 'N/A', color: 'N/A', size: 'N/A', stock: product.inventory.warehouseStock || 0}]).map((variant, index) => (
                            <TableRow key={`${product.id}-${variant.sku}`}>
                                {index === 0 && (
                                  <>
                                    <TableCell rowSpan={product.variants?.length || 1} className="hidden sm:table-cell align-top">
                                        <Image src={product.images?.[0] || 'https://placehold.co/64x64.png'} alt={product.name} width={48} height={48} className="rounded-md object-cover"/>
                                    </TableCell>
                                    <TableCell rowSpan={product.variants?.length || 1} className="align-top">
                                      <p className="font-semibold">{product.name}</p>
                                    </TableCell>
                                  </>
                                )}
                                <TableCell>
                                    {product.variants?.length > 0 && <p className="text-sm text-muted-foreground">{variant.color} / {variant.size}</p>}
                                    <p className="font-mono text-xs">{variant.sku}</p>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={variant.stock ?? ''}
                                        onChange={e => handleVariantStockChange(product.id, variant.sku, e.target.value)}
                                        className={cn("h-9", (variant.stock || 0) < 20 && 'bg-red-100/50 border-red-300')}
                                        disabled={product.variants.length === 0}
                                    />
                                </TableCell>
                                 {index === 0 && (
                                   <TableCell rowSpan={product.variants?.length || 1} className="align-top">
                                      <Input
                                        type="number"
                                        value={product.inventory?.physicalStoreStock ?? ''}
                                        onChange={e => handlePhysicalStockChange(product.id, e.target.value)}
                                        className="h-9"
                                    />
                                   </TableCell>
                                )}
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
