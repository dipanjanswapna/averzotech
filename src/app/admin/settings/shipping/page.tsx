
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash2, Home, ChevronLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getPickupStores, createPickupStore } from '@/lib/redx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PickupStore {
  id: number;
  name: string;
  address: string;
  area_name: string;
  phone: string;
}

export default function PickupStoresPage() {
  const [stores, setStores] = useState<PickupStore[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStoreData, setNewStoreData] = useState({ name: '', phone: '', address: '', area_id: 0 });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getPickupStores();
      setStores(data.pickup_stores || []);
    } catch (error: any) {
      toast({ title: "Error", description: `Could not fetch pickup stores: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleInputChange = (field: keyof typeof newStoreData, value: string | number) => {
    setNewStoreData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddStore = async () => {
    if (!newStoreData.name || !newStoreData.phone || !newStoreData.address || !newStoreData.area_id) {
        toast({ title: "Missing fields", description: "Please fill all fields to add a store.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        await createPickupStore(newStoreData.name, newStoreData.phone, newStoreData.address, newStoreData.area_id);
        toast({ title: "Store Added", description: "The new pickup store has been created successfully." });
        fetchStores();
        setIsDialogOpen(false);
        setNewStoreData({ name: '', phone: '', address: '', area_id: 0 });
    } catch (error: any) {
        toast({ title: "Error", description: `Could not add store: ${error.message}`, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/admin/settings">
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Pickup Stores</h1>
                <p className="text-muted-foreground">
                    Manage your warehouses and pickup locations for RedX.
                </p>
            </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Store
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Pickup Store</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Store Name</Label>
                        <Input id="name" value={newStoreData.name} onChange={e => handleInputChange('name', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={newStoreData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={newStoreData.address} onChange={e => handleInputChange('address', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="area_id">Area ID</Label>
                        <Input id="area_id" type="number" value={newStoreData.area_id} onChange={e => handleInputChange('area_id', Number(e.target.value))} />
                        <p className="text-xs text-muted-foreground">Find the correct Area ID from the RedX portal.</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddStore} disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Store"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pickup Stores</CardTitle>
          <CardDescription>
            This is a list of all your registered pickup locations with RedX.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading stores...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.address}</TableCell>
                    <TableCell>{store.area_name}</TableCell>
                    <TableCell>{store.phone}</TableCell>
                    <TableCell>
                      {/* Actions can be added here if needed */}
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
