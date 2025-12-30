
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface Invoice {
  id: string;
  vendorName: string;
  createdAt: any;
  status: 'Draft' | 'Sent' | 'Processing' | 'Paid' | 'Cancelled';
  total: number;
}

export default function VendorInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const invoicesCollection = collection(db, 'vendorInvoices');
        const q = query(invoicesCollection, orderBy('createdAt', 'desc'));
        const invoiceSnapshot = await getDocs(q);
        const invoiceList = invoiceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Invoice));
        setInvoices(invoiceList);
      } catch (error) {
        console.error("Error fetching invoices: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [db]);
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Processing':
      case 'Sent':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Vendor Invoices</h1>
        <p>Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendor Invoices</h1>
          <p className="text-muted-foreground">
            Review and process invoices from vendors.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            A list of all invoices received from vendors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id.substring(0, 7)}...</TableCell>
                  <TableCell>{invoice.vendorName}</TableCell>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(getStatusBadgeClass(invoice.status))}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ৳{invoice.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/admin/vendor-invoices/${invoice.id}`}>View Details</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No invoices received yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
