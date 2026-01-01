
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
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Vendor } from '@/types';
import { useFirebase } from '@/firebase';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { db } = useFirebase();

  useEffect(() => {
    if (!db) return;
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const vendorsCollection = collection(db, 'vendors');
        const q = query(vendorsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const vendorList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Vendor));
        setVendors(vendorList);
      } catch (error) {
        console.error("Error fetching vendors: ", error);
        toast({ title: "Error", description: "Could not fetch vendors.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [toast, db]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
      if (score > 75) return 'text-green-600';
      if (score > 50) return 'text-yellow-600';
      return 'text-red-600';
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Vendors</h1>
        <p className="text-muted-foreground">
          Manage all approved vendors on your platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>
            A list of all active and suspended vendors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading vendors...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Trust Score</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.shopName}</TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell>
                        <span className={cn("font-bold", getScoreColor(vendor.trustScore))}>
                            {vendor.trustScore}
                        </span>
                    </TableCell>
                    <TableCell>{vendor.sla?.deliveryCommitment} hours</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(getStatusBadgeClass(vendor.status))}>
                        {vendor.status}
                      </Badge>
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
                                <Link href={`/admin/vendors/${vendor.id}`}>View Details</Link>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
           {vendors.length === 0 && !loading && (
             <div className="text-center p-8 text-muted-foreground">
                No approved vendors found.
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
