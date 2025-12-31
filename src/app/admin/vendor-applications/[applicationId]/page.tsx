

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
import Link from 'next/link';
import { ChevronLeft, CheckCircle, XCircle, AlertTriangle, FileText, Banknote, Store, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useFirebase } from '@/firebase/provider';
import { VendorApplication } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
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
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';


const LoadingSkeleton = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Card>
            <CardHeader className="flex flex-row justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                 <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
             <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
            </CardFooter>
        </Card>
    </div>
)

export default function VendorApplicationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const applicationId = params.applicationId as string;
    const { toast } = useToast();
    const { db } = useFirebase();

    const [application, setApplication] = useState<VendorApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        if (applicationId && db) {
            const fetchApplication = async () => {
                setLoading(true);
                const docRef = doc(db, 'vendorApplications', applicationId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setApplication({ id: docSnap.id, ...docSnap.data() } as VendorApplication);
                } else {
                    toast({ title: "Error", description: "Application not found.", variant: "destructive" });
                    router.push('/admin/vendor-applications');
                }
                setLoading(false);
            };
            fetchApplication();
        }
    }, [applicationId, db, router, toast]);

    const handleUpdateStatus = async (status: 'Approved' | 'Rejected' | 'Update Requested', reason?: string) => {
        if (!application || !db) return;

        try {
            const appDocRef = doc(db, 'vendorApplications', applicationId);
            await updateDoc(appDocRef, { 
                status,
                ...(reason && { rejectionReason: reason })
            });

            const userRef = doc(db, 'users', application.userId);

            if (status === 'Approved') {
                await updateDoc(userRef, { status: 'active' });

                const vendorRef = doc(db, 'vendors', application.userId);
                await setDoc(vendorRef, {
                    userId: application.userId,
                    shopName: application.shopInfo.shopName,
                    category: application.shopInfo.category,
                    contact: application.contactInfo,
                    payment: application.paymentInfo,
                    trustScore: 78, // Example score
                    sla: { deliveryCommitment: 48 }, // Default SLA
                    status: 'Active',
                    createdAt: application.createdAt,
                });
            } else if (status === 'Rejected' || status === 'Update Requested') {
                 await updateDoc(userRef, { status: 'suspended' });
            }

            toast({
                title: 'Application Updated',
                description: `The application has been marked as ${status}.`
            });
            router.push('/admin/vendor-applications');

        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update application status.', variant: 'destructive'});
            console.error("Error updating status:", error);
        }
    }
    
    if (loading) return <LoadingSkeleton />;
    if (!application) return null;

    const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Update Requested': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const trustScore = 78; // Example score
  const scoreColor = trustScore > 75 ? 'text-green-500' : trustScore > 50 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                <Link href="/admin/vendor-applications">
                    <ChevronLeft className="h-4 w-4" />
                </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Vendor Application</h1>
                    <p className="text-muted-foreground text-sm">Reviewing application for <span className="font-semibold">{application.shopInfo.shopName}</span></p>
                </div>
                 <Badge variant="outline" className={cn("ml-auto", getStatusBadgeClass(application.status))}>
                    {application.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Trust Score</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className={cn("text-6xl font-bold", scoreColor)}>{trustScore}</p>
                        <p className="text-muted-foreground text-sm">Based on provided information</p>
                    </CardContent>
                </Card>
                 <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Store className="w-5 h-5" /> Shop Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-muted-foreground">Shop Name</p><p className="font-semibold">{application.shopInfo.shopName}</p></div>
                        <div><p className="text-muted-foreground">Shop Category</p><p className="font-semibold">{application.shopInfo.category}</p></div>
                        <div className="col-span-2"><p className="text-muted-foreground">Shop Address</p><p className="font-semibold">{application.shopInfo.address}</p></div>
                        <div><p className="text-muted-foreground">Contact Person</p><p className="font-semibold">{application.contactInfo.name}</p></div>
                        <div><p className="text-muted-foreground">Contact Phone</p><p className="font-semibold">{application.contactInfo.phone}</p></div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Submitted Documents</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <p className="font-semibold">Trade License</p>
                        <Button variant="outline" size="sm" asChild>
                            <a href={application.documents.tradeLicenseUrl} target="_blank" rel="noopener noreferrer"><LinkIcon className="w-4 h-4 mr-2" /> View Document</a>
                        </Button>
                    </div>
                     <div className="flex items-center justify-between p-3 border rounded-lg">
                        <p className="font-semibold">NID/Passport</p>
                         <Button variant="outline" size="sm" asChild>
                            <a href={application.documents.nidUrl} target="_blank" rel="noopener noreferrer"><LinkIcon className="w-4 h-4 mr-2" /> View Document</a>
                        </Button>
                    </div>
                     <div className="flex items-center justify-between p-3 border rounded-lg">
                        <p className="font-semibold">TIN Certificate</p>
                         <Button variant="outline" size="sm" asChild>
                            <a href={application.documents.tinUrl} target="_blank" rel="noopener noreferrer"><LinkIcon className="w-4 h-4 mr-2" /> View Document</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5" /> Payment Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-muted-foreground">Payment Method</p><p className="font-semibold capitalize">{application.paymentInfo.method}</p></div>
                    {application.paymentInfo.method === 'bank' ? (
                        <>
                            <div><p className="text-muted-foreground">Bank Name</p><p className="font-semibold">{application.paymentInfo.bankName}</p></div>
                            <div><p className="text-muted-foreground">Account Name</p><p className="font-semibold">{application.paymentInfo.accountName}</p></div>
                            <div><p className="text-muted-foreground">Account Number</p><p className="font-semibold">{application.paymentInfo.accountNumber}</p></div>
                             <div><p className="text-muted-foreground">Branch Name</p><p className="font-semibold">{application.paymentInfo.branchName}</p></div>
                        </>
                    ) : (
                         <div><p className="text-muted-foreground">Mobile Number</p><p className="font-semibold">{application.paymentInfo.mobileNumber}</p></div>
                    )}
                </CardContent>
            </Card>

            <CardFooter className="flex justify-end gap-2 p-0 pt-6">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reason for Rejection</AlertDialogTitle>
                            <AlertDialogDescription>Please provide a reason for rejecting this application. This will be communicated to the vendor.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <Textarea placeholder="e.g., Invalid TIN certificate provided." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUpdateStatus('Rejected', rejectionReason)} disabled={!rejectionReason}>Confirm Rejection</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button variant="secondary" onClick={() => handleUpdateStatus('Update Requested')}><AlertTriangle className="w-4 h-4 mr-2" /> Request Update</Button>
                <Button onClick={() => handleUpdateStatus('Approved')}><CheckCircle className="w-4 h-4 mr-2" />Approve Vendor</Button>
            </CardFooter>
        </div>
    )
}
