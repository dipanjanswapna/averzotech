
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
import { MoreHorizontal, PlusCircle, Copy, Trash2, ToggleRight, ToggleLeft, Pencil, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  status: 'Active' | 'Expired' | 'Scheduled' | 'Disabled';
  used: number;
  limit: number | null;
  startDate: string;
  endDate: string;
  applicability?: {
    type: 'all' | 'products';
    ids: string[];
  }
}

export default function CouponsPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const couponsCollection = collection(db, 'coupons');
      const q = query(couponsCollection, orderBy('createdAt', 'desc'));
      const couponSnapshot = await getDocs(q);
      const couponList = couponSnapshot.docs.map(doc => {
        const data = doc.data();
        
        let status: Coupon['status'] = 'Disabled';
        if (data.status && data.status === 'Disabled') {
            status = 'Disabled';
        } else if (new Date() < new Date(data.startDate)) {
            status = 'Scheduled';
        } else if (new Date() > new Date(data.endDate)) {
            status = 'Expired';
        } else {
            status = 'Active';
        }

        return {
          id: doc.id,
          code: data.code,
          type: data.type,
          value: data.value,
          used: data.used,
          limit: data.limit,
          startDate: data.startDate,
          endDate: data.endDate,
          applicability: data.applicability,
          status: status,
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


  useEffect(() => {
    fetchCoupons();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard.",
    });
  };
  
  const handleDeleteCoupon = async (couponId: string) => {
    try {
        await deleteDoc(doc(db, "coupons", couponId));
        toast({
            title: "Coupon Deleted",
            description: "The coupon has been successfully deleted.",
        });
        fetchCoupons(); // Re-fetch coupons to update the list
    } catch (error) {
        console.error("Error deleting coupon: ", error);
        toast({
            title: "Error Deleting Coupon",
            description: "There was a problem deleting the coupon.",
            variant: "destructive"
        })
    }
  }

  const handleToggleStatus = async (coupon: Coupon) => {
    const newStatus = coupon.status === 'Disabled' ? 'Active' : 'Disabled'; // This logic might need adjustment based on other statuses
    const couponRef = doc(db, 'coupons', coupon.id);
    try {
        // We are only toggling the 'Disabled' status. If it's Expired/Scheduled, it should remain so.
        // A more robust logic might be needed if we want to force re-activation.
        // For now, we assume we are only disabling active/scheduled coupons.
        await updateDoc(couponRef, { status: newStatus }); 
        toast({
            title: "Status Updated",
            description: `Coupon "${coupon.code}" has been set to ${newStatus}.`
        });
        fetchCoupons();
    } catch (error) {
        console.error("Error updating status: ", error);
        toast({
            title: "Error",
            description: "Failed to update coupon status.",
            variant: "destructive"
        })
    }
  }
  
  const getStatusBadgeVariant = (status: Coupon['status']) => {
        switch (status) {
            case 'Active':
                return 'default';
            case 'Scheduled':
                return 'secondary';
            case 'Expired':
            case 'Disabled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusBadgeClass = (status: Coupon['status']) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Disabled':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return '';
        }
    };

    const getApplicabilityText = (applicability: Coupon['applicability']) => {
        if (!applicability || applicability.type === 'all') {
            return "All Products";
        }
        if (applicability.type === 'products') {
            return `${applicability.ids.length} Product(s)`;
        }
        return "N/A";
    }

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
                  <TableHead>Applies To</TableHead>
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
                    <TableCell>{getApplicabilityText(coupon.applicability)}</TableCell>
                     <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(coupon.status)}
                         className={getStatusBadgeClass(coupon.status)}
                      >
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{coupon.used || 0} / {coupon.limit ?? '∞'}</TableCell>
                     <TableCell>{new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <AlertDialog>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/coupons/edit/${coupon.id}`}>
                                <Eye className="mr-2 h-4 w-4"/>View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/coupons/edit/${coupon.id}`}>
                               <Pencil className="mr-2 h-4 w-4"/> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(coupon)}>
                            {coupon.status === 'Disabled' ? <ToggleRight className="mr-2 h-4 w-4" /> : <ToggleLeft className="mr-2 h-4 w-4" />}
                            Change Status
                          </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                           </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                       <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the coupon
                                  <span className="font-bold"> {coupon.code}</span>.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCoupon(coupon.id)} className="bg-destructive hover:bg-destructive/90">
                                  Continue
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                      </AlertDialog>
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
