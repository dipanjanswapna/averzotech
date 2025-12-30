
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
import { VendorApplication } from '@/types';
import { useFirebase } from '@/firebase';

export default function VendorApplicationsPage() {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { db } = useFirebase();

  useEffect(() => {
    if (!db) return;
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const appsCollection = collection(db, 'vendorApplications');
        const q = query(appsCollection, orderBy('createdAt', 'desc'));
        const appSnapshot = await getDocs(q);
        const appList = appSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as VendorApplication));
        setApplications(appList);
      } catch (error) {
        console.error("Error fetching applications: ", error);
        toast({ title: "Error", description: "Could not fetch vendor applications.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [toast, db]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Update Requested': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Vendor Applications</h1>
        <p className="text-muted-foreground">
          Review and manage new vendor applications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            Review incoming applications and update their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading applications...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.shopInfo.shopName}</TableCell>
                    <TableCell>{app.contactInfo.name}</TableCell>
                    <TableCell>{app.shopInfo.category}</TableCell>
                    <TableCell>{formatDate(app.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(getStatusBadgeClass(app.status))}>
                        {app.status}
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
                                <Link href={`/admin/vendor-applications/${app.id}`}>View Details</Link>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
           {applications.length === 0 && !loading && (
             <div className="text-center p-8 text-muted-foreground">
                No vendor applications found.
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
