
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
import { Home, Trash2, Edit, PlusCircle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { divisions } from '@/lib/bangladesh-geo';
import { Textarea } from '@/components/ui/textarea';

interface Address {
    id: string;
    type: string;
    name: string;
    streetAddress: string;
    division: string;
    district: string;
    upazila: string;
    phone: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        type: 'Home',
        name: '',
        streetAddress: '',
        division: '',
        district: '',
        upazila: '',
        phone: '',
        isDefault: false,
    });
    
    // Dependent dropdown options
    const [districts, setDistricts] = useState<string[]>([]);
    const [upazilas, setUpazilas] = useState<string[]>([]);

    useEffect(() => {
        if(formData.division) {
            const divisionData = divisions.find(d => d.name === formData.division);
            setDistricts(divisionData ? divisionData.districts.map(dist => dist.name) : []);
            setFormData(prev => ({ ...prev, district: '', upazila: '' }));
        } else {
            setDistricts([]);
            setUpazilas([]);
        }
    }, [formData.division]);

    useEffect(() => {
        if(formData.district) {
            const divisionData = divisions.find(d => d.name === formData.division);
            const districtData = divisionData?.districts.find(d => d.name === formData.district);
            setUpazilas(districtData ? districtData.upazilas : []);
             setFormData(prev => ({ ...prev, upazila: '' }));
        } else {
            setUpazilas([]);
        }
    }, [formData.district, formData.division]);


    const fetchAddresses = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const addressesCol = collection(db, 'users', user.uid, 'addresses');
            const addressSnapshot = await getDocs(addressesCol);
            const addressList = addressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
            setAddresses(addressList);
        } catch (error) {
            console.error("Error fetching addresses: ", error);
            toast({ title: "Error", description: "Could not fetch addresses.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(user) {
            fetchAddresses();
        }
    }, [user]);

    useEffect(() => {
        if (editingAddress) {
            setFormData({
                type: editingAddress.type,
                name: editingAddress.name,
                streetAddress: editingAddress.streetAddress,
                division: editingAddress.division,
                district: editingAddress.district,
                upazila: editingAddress.upazila,
                phone: editingAddress.phone,
                isDefault: editingAddress.isDefault,
            });
        } else {
            resetFormData();
        }
    }, [editingAddress]);

    const resetFormData = () => {
        setFormData({
            type: 'Home',
            name: user?.fullName || '',
            streetAddress: '',
            division: '',
            district: '',
            upazila: '',
            phone: '',
            isDefault: false,
        });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSetDefault = async (addressId: string) => {
        if(!user) return;
        const batch = writeBatch(db);
        
        addresses.forEach(addr => {
            if (addr.isDefault && addr.id !== addressId) {
                const docRef = doc(db, 'users', user.uid, 'addresses', addr.id);
                batch.update(docRef, { isDefault: false });
            }
        });

        const docRef = doc(db, 'users', user.uid, 'addresses', addressId);
        batch.update(docRef, { isDefault: true });

        try {
            await batch.commit();
            toast({ title: "Default address updated" });
            fetchAddresses();
        } catch (error) {
            console.error("Error setting default address: ", error);
            toast({ title: "Error", description: "Failed to update default address.", variant: "destructive" });
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        if (!formData.division || !formData.district || !formData.upazila || !formData.streetAddress || !formData.phone.trim()) {
            toast({ title: "Incomplete Address", description: "Please fill all required address fields including phone number.", variant: "destructive" });
            return;
        }

        const addressesCol = collection(db, 'users', user.uid, 'addresses');
        
        try {
            if (formData.isDefault) {
                 const batch = writeBatch(db);
                 addresses.forEach(addr => {
                    if (addr.isDefault && addr.id !== editingAddress?.id) {
                         const docRef = doc(db, 'users', user.uid, 'addresses', addr.id);
                         batch.update(docRef, { isDefault: false });
                    }
                 });
                 await batch.commit();
            }

            if (editingAddress) {
                const docRef = doc(db, 'users', user.uid, 'addresses', editingAddress.id);
                await updateDoc(docRef, formData);
                toast({ title: "Address Updated" });
            } else {
                await addDoc(addressesCol, formData);
                toast({ title: "Address Added" });
            }
            fetchAddresses();
            setIsDialogOpen(false);
            setEditingAddress(null);
        } catch (error) {
             console.error("Error saving address: ", error);
             toast({ title: "Error", description: "Could not save address.", variant: "destructive" });
        }
    };
    
    const handleDelete = async (addressId: string) => {
        if(!user) return;
        const docRef = doc(db, 'users', user.uid, 'addresses', addressId);
        try {
            await deleteDoc(docRef);
            toast({ title: "Address Removed" });
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address: ", error);
            toast({ title: "Error", description: "Could not remove address.", variant: "destructive" });
        }
    }
    
    const openAddDialog = () => {
        setEditingAddress(null);
        resetFormData();
        setIsDialogOpen(true);
    };

    const openEditDialog = (address: Address) => {
        setEditingAddress(address);
        setIsDialogOpen(true);
    }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Manage Addresses</h1>
                <p className="text-muted-foreground">Add or edit your shipping addresses.</p>
            </div>
            <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4"/>Add New Address</Button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
            <p>Loading addresses...</p>
        ) : addresses.length > 0 ? (
            addresses.map((addr) => (
                <Card key={addr.id} className={addr.isDefault ? 'border-primary ring-1 ring-primary' : ''}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            {addr.type}
                        </CardTitle>
                        {addr.isDefault && <div className="text-xs font-semibold text-primary flex items-center gap-1"><CheckCircle className="w-4 h-4"/> DEFAULT</div>}
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">{addr.name}</p>
                        <p className="text-muted-foreground">{addr.streetAddress}</p>
                        <p className="text-muted-foreground">{addr.upazila}, {addr.district}, {addr.division}</p>
                        <p className="text-muted-foreground mt-2">Mobile: <span className="font-medium text-foreground">{addr.phone}</span></p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(addr)}>
                                <Edit className="mr-2 h-3.5 w-3.5" />
                                Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(addr.id)}>
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Remove
                            </Button>
                        </div>
                         {!addr.isDefault && <Button variant="secondary" size="sm" onClick={() => handleSetDefault(addr.id)}>Set as Default</Button>}
                    </CardFooter>
                </Card>
            ))
        ) : (
            <div className="col-span-full text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <p>You haven't saved any addresses yet.</p>
                <Button variant="link" onClick={openAddDialog}>Add your first address</Button>
            </div>
        )}
      </div>

       <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if(!isOpen) setEditingAddress(null); }}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Input id="type" value={formData.type} onChange={handleFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={formData.name} onChange={handleFormChange} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="streetAddress" className="text-right pt-2">Street Address</Label>
                <Textarea id="streetAddress" value={formData.streetAddress} onChange={handleFormChange} className="col-span-3" placeholder="e.g. House 123, Road 4, Block F" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Location</Label>
                    <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Select value={formData.division} onValueChange={handleSelectChange('division')}>
                            <SelectTrigger><SelectValue placeholder="Select Division" /></SelectTrigger>
                            <SelectContent>
                                {divisions.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={formData.district} onValueChange={handleSelectChange('district')} disabled={!formData.division}>
                            <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                            <SelectContent>
                                {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={formData.upazila} onValueChange={handleSelectChange('upazila')} disabled={!formData.district}>
                            <SelectTrigger><SelectValue placeholder="Select Upazila" /></SelectTrigger>
                            <SelectContent>
                                {upazilas.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={formData.phone} onChange={handleFormChange} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isDefault" className="text-right">Set as Default</Label>
                <Switch 
                    id="isDefault"
                    checked={formData.isDefault} 
                    onCheckedChange={(checked) => setFormData(prev => ({...prev, isDefault: checked}))}
                    className="col-span-3 justify-self-start" 
                 />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>Save Address</Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
