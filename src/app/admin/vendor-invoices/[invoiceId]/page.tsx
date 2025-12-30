
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
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Truck } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, writeBatch, increment, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  vendorName: string;
  items: InvoiceItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Processing' | 'Paid' | 'Cancelled';
  createdAt: any;
}

export default function VendorInvoiceDetailsPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (invoiceId) {
        const fetchInvoice = async () => {
            setLoading(true);
            const invoiceRef = doc(db, 'vendorInvoices', invoiceId);
            const docSnap = await getDoc(invoiceRef);
            if (docSnap.exists()) {
                setInvoice({ id: docSnap.id, ...docSnap.data() } as Invoice);
            } else {
                toast({ title: "Error", description: "Invoice not found.", variant: "destructive" });
                router.push('/admin/vendor-invoices');
            }
            setLoading(false);
        }
        fetchInvoice();
    }
  }, [invoiceId, toast, router, db]);

  const handleStockUpdate = async () => {
      if (!invoice) return;
      setIsUpdating(true);
      const batch = writeBatch(db);

      try {
        // Increment stock for each product
        for (const item of invoice.items) {
            const productRef = doc(db, 'products', item.productId);
            batch.update(productRef, { "inventory.stock": increment(item.quantity) });
        }
        
        // Update invoice status
        const invoiceRef = doc(db, 'vendorInvoices', invoice.id);
        batch.update(invoiceRef, { status: "Paid" });
        
        await batch.commit();

        toast({ title: "Stock Updated", description: "Product inventory has been updated and invoice marked as paid." });
        router.push('/admin/vendor-invoices');

      } catch (error) {
          console.error("Error updating stock: ", error);
          toast({ title: "Error", description: "Failed to update stock from invoice.", variant: "destructive" });
      } finally {
          setIsUpdating(false);
      }
  }

  if (loading) return <p className="p-8">Loading invoice details...</p>;
  if (!invoice) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-GB');
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Processing':
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return '';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/vendor-invoices">
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold">Invoice #{invoice.id.substring(0, 7)}</h1>
                <p className="text-muted-foreground text-sm">From: {invoice.vendorName}</p>
            </div>
        </div>
        <Badge variant="outline" className={cn("ml-auto", getStatusBadgeClass(invoice.status))}>
            {invoice.status}
        </Badge>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>Date: {formatDate(invoice.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoice.items.map(item => (
                            <TableRow key={item.productId}>
                                <TableCell className="font-medium">{item.productName}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">৳{item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">৳{item.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
               </Table>
            </CardContent>
            <CardFooter className="flex justify-end bg-secondary/50 p-6">
                <div className="text-right">
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">৳{invoice.total.toFixed(2)}</p>
                </div>
            </CardFooter>
        </Card>
        
        {invoice.status === 'Sent' && (
             <div className="flex justify-end">
                <Button onClick={handleStockUpdate} disabled={isUpdating} size="lg">
                    <Truck className="mr-2 h-5 w-5"/>
                    {isUpdating ? "Updating Stock..." : "Mark as Stock Received"}
                </Button>
            </div>
        )}
    </div>
  );
}
