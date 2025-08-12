
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, MapPin, PlusCircle, Trash2, Edit } from 'lucide-react';
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

export default function AddressesPage() {
  const addresses = [
    {
        id: 1,
        type: 'Home',
        recipient: 'Kamal Hasan',
        address: 'House 123, Road 4, Block F, Banani, Dhaka - 1213',
        phone: '+8801700000000',
        isDefault: true,
    },
    {
        id: 2,
        type: 'Office',
        recipient: 'Kamal Hasan',
        address: 'ABC Tower, Level 5, Gulshan Avenue, Dhaka - 1212',
        phone: '+8801800000000',
        isDefault: false,
    }
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Manage Addresses</h1>
                <p className="text-muted-foreground">Add, edit, or remove your shipping addresses.</p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
            </Button>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(addr => (
                 <Card key={addr.id} className={addr.isDefault ? 'border-primary' : ''}>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                             <CardTitle className="flex items-center gap-2">
                                <Home className="w-5 h-5"/> {addr.type}
                             </CardTitle>
                              {addr.isDefault && <CardDescription className="text-primary font-semibold">Default</CardDescription>}
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                               <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                   <AlertDialogHeader>
                                       <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                       <AlertDialogDescription>This will permanently delete this address.</AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                                       <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                   </AlertDialogFooter>
                               </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p className="font-semibold text-foreground">{addr.recipient}</p>
                        <p>{addr.address}</p>
                        <p>Mobile: <span className="font-medium text-foreground">{addr.phone}</span></p>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
