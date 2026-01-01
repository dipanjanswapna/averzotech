
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
import { ChevronLeft, FileText, Banknote, Store, ShieldCheck, User as UserIcon, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Vendor } from '@/types';
import { useFirebase } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VendorDetailsPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;
  const router = useRouter();
  const { toast } = useToast();
  const { db } = useFirebase();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [sla, setSla] = useState(48);
  const [mov, setMov] = useState(0);

  useEffect(() => {
    if (vendorId && db) {
      const fetchVendorData = async () => {
        setLoading(true);
        try {
          const vendorRef = doc(db, 'vendors', vendorId);
          const vendorSnap = await getDoc(vendorRef);

          if (vendorSnap.exists()) {
            const vendorData = { id: vendorSnap.id, ...vendorSnap.data() } as Vendor;
            setVendor(vendorData);
            setSla(vendorData.sla?.deliveryCommitment || 48);
            setMov(vendorData.minimumOrderValue || 0);

            // Fetch associated user data
            const userRef = doc(db, 'users', vendorData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setUser({ id: userSnap.id, ...userSnap.data() });
            }
          } else {
            toast({ title: "Error", description: "Vendor not found.", variant: "destructive" });
            router.push('/admin/vendors');
          }
        } catch (error) {
          console.error("Error fetching vendor data:", error);
          toast({ title: "Error", description: "Failed to fetch vendor details.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      fetchVendorData();
    }
  }, [vendorId, db, router, toast]);
  
  const handleUpdateVendor = async () => {
      if (!vendor) return;
      setIsUpdating(true);
      try {
          const vendorRef = doc(db, 'vendors', vendor.id);
          await updateDoc(vendorRef, {
              "sla.deliveryCommitment": sla,
              "minimumOrderValue": mov,
          });
          toast({ title: "Vendor Updated", description: "Vendor details have been successfully updated." });
      } catch (error) {
           toast({ title: "Update Failed", description: "Could not update vendor details.", variant: "destructive" });
      } finally {
            setIsUpdating(false);
      }
  }


  if (loading) return <p className="p-8">Loading vendor details...</p>;
  if (!vendor || !user) return null;
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
   const getScoreColor = (score: number) => {
      if (score > 75) return 'text-green-500';
      if (score > 50) return 'text-yellow-500';
      return 'text-red-500';
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/vendors">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{vendor.shopName}</h1>
          <p className="text-muted-foreground text-sm">Vendor ID: {vendor.id}</p>
        </div>
        <Badge variant="outline" className={cn("ml-auto", getStatusBadgeClass(vendor.status))}>
          {vendor.status}
        </Badge>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserIcon className="w-5 h-5"/> Vendor Details</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.photoURL} alt={user.fullName} />
                        <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-bold">{user.fullName}</p>
                        <p className="text-muted-foreground">{user.email}</p>
                        <p className="text-muted-foreground">{vendor.contact.phone}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Performance</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-center">
                    <div>
                         <p className={cn("text-4xl font-bold", getScoreColor(vendor.trustScore))}>{vendor.trustScore}</p>
                         <p className="text-xs text-muted-foreground">Trust Score</p>
                    </div>
                     <div>
                         <p className="text-4xl font-bold">{vendor.sla.deliveryCommitment}<span className="text-lg">hrs</span></p>
                         <p className="text-xs text-muted-foreground">Delivery SLA</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5" /> Payment & Business Info</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                         <h3 className="font-semibold">Payment Details</h3>
                         <div className="text-sm space-y-1">
                             <p><span className="text-muted-foreground">Method:</span> <span className="font-medium capitalize">{vendor.payment.method}</span></p>
                             {vendor.payment.method === 'bank' ? (
                                <>
                                    <p><span className="text-muted-foreground">Bank:</span> <span className="font-medium">{vendor.payment.bankName}</span></p>
                                    <p><span className="text-muted-foreground">Account Name:</span> <span className="font-medium">{vendor.payment.accountName}</span></p>
                                    <p><span className="text-muted-foreground">Account No:</span> <span className="font-medium">{vendor.payment.accountNumber}</span></p>
                                </>
                             ) : (
                                <p><span className="text-muted-foreground">Mobile No:</span> <span className="font-medium">{vendor.payment.mobileNumber}</span></p>
                             )}
                         </div>
                     </div>
                      <div className="space-y-4">
                         <h3 className="font-semibold">Business Documents</h3>
                         <div className="text-sm space-y-2">
                             <Button variant="link" asChild className="p-0 h-auto"><a href={vendor.documents?.tradeLicenseUrl} target="_blank">View Trade License</a></Button>
                             <br/>
                             <Button variant="link" asChild className="p-0 h-auto"><a href={vendor.documents?.nidUrl} target="_blank">View NID/Passport</a></Button>
                         </div>
                     </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Business Rules</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="sla">SLA: Delivery Commitment (hours)</Label>
                    <Input id="sla" type="number" value={sla} onChange={e => setSla(Number(e.target.value))} />
                    <p className="text-xs text-muted-foreground">Time in hours vendor has to hand over products to Averzo.</p>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="mov">Minimum Order Value (MOV)</Label>
                    <Input id="mov" type="number" value={mov} onChange={e => setMov(Number(e.target.value))} placeholder="e.g. 5000" />
                    <p className="text-xs text-muted-foreground">Minimum total order value required from this vendor.</p>
                 </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleUpdateVendor} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Business Rules'}
                 </Button>
            </CardFooter>
        </Card>
        
    </div>
  );
}
