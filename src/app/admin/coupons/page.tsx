
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
import { MoreHorizontal, PlusCircle, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  status: 'Active' | 'Expired' | 'Scheduled';
  used: number;
  limit: number | null;
  startDate: string;
  endDate: string;
}

export default function CouponsPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const couponsCollection = collection(db, 'coupons');
        const q = query(couponsCollection, orderBy('createdAt', 'desc'));
        const couponSnapshot = await getDocs(q);
        const couponList = couponSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            code: data.code,
            type: data.type,
            value: data.value,
            used: data.used,
            limit: data.limit,
            startDate: data.startDate,
            endDate: data.endDate,
            // Determine status based on dates
            status: new Date() < new Date(data.startDate) ? 'Scheduled' : new Date() > new Date(data.endDate) ? 'Expired' : 'Active'
          } as Coupon
        });
        setCoupons(couponList);
      } catch (error) {
        console.error("Error fetching coupons: ", error);
        toast({
            title: "Error fetching coupons",
            description: "Could not retrieve coupon data from the database.",
            variant: "destructive"
        })
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard.",
    });
  };
  
  const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Active':
                return 'default';
            case 'Scheduled':
                return 'secondary';
            case 'Expired':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            default:
                return '';
        }
    };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">
            Create and manage discount coupons for your store.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Coupon
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>
            A list of all promotional coupons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading coupons...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{coupon.code}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(coupon.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{coupon.type}</TableCell>
                    <TableCell className="font-semibold">{coupon.type === 'percentage' ? `${coupon.value}%` : `৳${coupon.value}`}</TableCell>
                     <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(coupon.status)}
                         className={getStatusBadgeClass(coupon.status)}
                      >
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{coupon.used} / {coupon.limit ?? '∞'}</TableCell>
                     <TableCell>{new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                           <DropdownMenuItem className="text-red-600">Disable</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
