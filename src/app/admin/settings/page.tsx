
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Store Details</CardTitle>
                    <CardDescription>Update your store's name and other details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input id="store-name" defaultValue="AVERZO" disabled={loading}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="store-email">Contact Email</Label>
                        <Input id="store-email" type="email" defaultValue="contact@averzo.com" disabled={loading}/>
                    </div>
                </CardContent>
                <CardFooter>
                     <Button disabled={loading}>Save Changes</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">New Orders</p>
                            <p className="text-sm text-muted-foreground">Receive an email for every new order.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Low Stock Alerts</p>
                            <p className="text-sm text-muted-foreground">Get notified when a product's stock is low.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
                 <CardFooter>
                     <Button>Save Preferences</Button>
                </CardFooter>
            </Card>
        </div>
        
        <div className="md:col-span-1">
             <Card className="bg-red-50 border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-800">Danger Zone</CardTitle>
                    <CardDescription className="text-red-700">These actions are irreversible. Please be certain.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="w-full">
                        Delete Store
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
