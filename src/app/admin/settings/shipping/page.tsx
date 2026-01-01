
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
import { getPickupStores, createPickupStore, RedXArea } from '@/lib/redx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDistrictsByDivision, getUnionsByUpazila, getUpazilasByDistrict, divisions } from '@/lib/bangladeshgeo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [newStoreData, setNewStoreData] = useState({ name: '', phone: '', address: '', division: '', district: '', upazila: '', union: '', area_id: 0 });
  
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);
  const [unions, setUnions] = useState<string[]>([]);
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
  
  useEffect(() => {
    if (newStoreData.division) {
        setDistricts(getDistrictsByDivision(newStoreData.division) || []);
        setNewStoreData(prev => ({ ...prev, district: '', upazila: '', union: '', area_id: 0 }));
    } else {
        setDistricts([]);
    }
  }, [newStoreData.division]);

   useEffect(() => {
    if (newStoreData.district) {
        setUpazilas(getUpazilasByDistrict(newStoreData.division, newStoreData.district) || []);
        setNewStoreData(prev => ({ ...prev, upazila: '', union: '' }));
    } else {
        setUpazilas([]);
    }
  }, [newStoreData.district, newStoreData.division]);

  useEffect(() => {
    if (newStoreData.upazila) {
      setUnions(getUnionsByUpazila(newStoreData.division, newStoreData.district, newStoreData.upazila) || []);
      setNewStoreData(prev => ({ ...prev, union: '' }));
    } else {
      setUnions([]);
    }
  }, [newStoreData.upazila, newStoreData.district, newStoreData.division]);


  const handleInputChange = (field: keyof typeof newStoreData, value: string | number) => {
    setNewStoreData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddStore = async () => {
    if (!newStoreData.name || !newStoreData.phone || !newStoreData.address || !newStoreData.district || !newStoreData.upazila) {
        toast({ title: "Missing fields", description: "Please fill all fields to add a store.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        // RedX area_id lookup would be needed here based on upazila/area which is not implemented in redx.ts
        // For now, we'll use a placeholder or assume a direct mapping if possible.
        // This is a limitation of the current mock implementation.
        const areaId = 1; // Placeholder
        await createPickupStore(newStoreData.name, newStoreData.phone, newStoreData.address, areaId);
        toast({ title: "Store Added", description: "The new pickup store has been created successfully." });
        fetchStores();
        setIsDialogOpen(false);
        setNewStoreData({ name: '', phone: '', address: '', division: '', district: '', upazila: '', union: '', area_id: 0 });
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
                        <Label>Location</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                             <Select value={newStoreData.division} onValueChange={value => handleInputChange('division', value)}>
                                <SelectTrigger><SelectValue placeholder="Select Division" /></SelectTrigger>
                                <SelectContent>
                                    {divisions.map((d, i) => <SelectItem key={`${d}-${i}`} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={newStoreData.district} onValueChange={value => handleInputChange('district', value)} disabled={!newStoreData.division}>
                                <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                                <SelectContent>
                                    {districts.map((d,i) => <SelectItem key={`${d}-${i}`} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={newStoreData.upazila} onValueChange={value => handleInputChange('upazila', value)} disabled={!newStoreData.district}>
                                <SelectTrigger><SelectValue placeholder="Select Upazila/Thana" /></SelectTrigger>
                                <SelectContent>
                                    {upazilas.map((u,i) => <SelectItem key={`${u}-${i}`} value={u}>{u}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <Select value={newStoreData.union} onValueChange={value => handleInputChange('union', value)} disabled={!newStoreData.upazila}>
                                <SelectTrigger><SelectValue placeholder="Select Union" /></SelectTrigger>
                                <SelectContent>
                                    {unions.map((u,i) => <SelectItem key={`${u}-${i}`} value={u}>{u}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
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
