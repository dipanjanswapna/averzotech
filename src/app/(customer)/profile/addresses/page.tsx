
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Trash2, Edit } from 'lucide-react';

// This is mock data. In a real app, this would come from a database.
const savedAddresses = [
    {
        id: 'addr1',
        type: 'Home',
        name: 'Kamal Hasan',
        address: 'House 123, Road 4, Block F, Banani',
        city: 'Dhaka',
        zip: '1213',
        phone: '+8801712345678',
        isDefault: true,
    },
     {
        id: 'addr2',
        type: 'Office',
        name: 'Kamal Hasan',
        address: 'ABC Tower, Level 5, Gulshan 1',
        city: 'Dhaka',
        zip: '1212',
        phone: '+8801712345678',
        isDefault: false,
    }
]

export default function AddressesPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Manage Addresses</h1>
                <p className="text-muted-foreground">Add or edit your shipping addresses.</p>
            </div>
            <Button>Add New Address</Button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedAddresses.map((addr) => (
            <Card key={addr.id} className={addr.isDefault ? 'border-primary' : ''}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        {addr.type}
                    </CardTitle>
                    {addr.isDefault && <div className="text-xs font-semibold text-primary">DEFAULT</div>}
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{addr.name}</p>
                    <p className="text-muted-foreground">{addr.address}</p>
                    <p className="text-muted-foreground">{addr.city} - {addr.zip}</p>
                    <p className="text-muted-foreground mt-2">Mobile: <span className="font-medium text-foreground">{addr.phone}</span></p>
                </CardContent>
                 <CardContent className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Remove
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
