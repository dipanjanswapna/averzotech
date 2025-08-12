
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
import { MoreHorizontal, PlusCircle, Trash2, Pencil, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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
import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Finished' | 'Scheduled';
  startDate: string;
  endDate: string;
  products: string[];
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const campaignsCollection = collection(db, 'campaigns');
      const q = query(campaignsCollection, orderBy('createdAt', 'desc'));
      const campaignSnapshot = await getDocs(q);
      const campaignList = campaignSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Campaign));
      setCampaigns(campaignList);
    } catch (error) {
      console.error("Error fetching campaigns: ", error);
      toast({ title: "Error", description: "Could not fetch campaigns from the database.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);


  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
        await deleteDoc(doc(db, "campaigns", campaignId));
        toast({
            title: "Campaign Deleted",
            description: "The campaign has been successfully deleted.",
        });
        fetchCampaigns(); // Re-fetch campaigns to update the list
    } catch (error) {
        console.error("Error deleting campaign: ", error);
        toast({
            title: "Error Deleting Campaign",
            description: "There was a problem deleting the campaign.",
            variant: "destructive"
        })
    }
  }

  const getStatusBadgeVariant = (status: Campaign['status']) => {
    switch (status) {
        case 'Active':
            return 'default';
        case 'Scheduled':
            return 'secondary';
        case 'Finished':
            return 'destructive';
        default:
            return 'outline';
    }
  };

  const getStatusBadgeClass = (status: Campaign['status']) => {
      switch (status) {
          case 'Active':
              return 'bg-green-100 text-green-800';
          case 'Scheduled':
              return 'bg-yellow-100 text-yellow-800';
          default:
              return '';
      }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your marketing and pre-booking campaigns.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/campaigns/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            A list of all promotional campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading campaigns...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                       <Badge variant="outline">{campaign.type}</Badge>
                    </TableCell>
                    <TableCell>
                        {campaign.products?.length || 0} product(s)
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(campaign.status)}
                        className={getStatusBadgeClass(campaign.status)}
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(campaign.endDate).toLocaleDateString()}</TableCell>
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
                                <Link href={`/admin/campaigns/edit/${campaign.id}`}>
                                    <Eye className="mr-2 h-4 w-4"/> View Details
                                </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild>
                            <Link href={`/admin/campaigns/edit/${campaign.id}`}>
                                <Pencil className="mr-2 h-4 w-4"/> Edit
                            </Link>
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
                                  This action cannot be undone. This will permanently delete the campaign
                                  <span className="font-bold"> {campaign.name}</span>.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCampaign(campaign.id)} className="bg-destructive hover:bg-destructive/90">
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
