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
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { VendorApplicationForm, VendorApplicationData } from '@/components/vendor-application-form';


export default function VendorApplyPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user, db } = useFirebase();

    const [isLoading, setIsLoading] = useState(false);
    
    if (!user) {
        // You can show a loading spinner or a message while user data is being fetched
        return <p>Loading user information...</p>
    }

    const handleSubmitApplication = async (data: VendorApplicationData) => {
        if (!user || !db) {
            toast({ title: 'Authentication Error', description: 'You must be logged in to apply.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);

        try {
            const applicationData = {
                ...data,
                userId: user.uid,
                status: 'Pending',
                contactInfo: {
                    ...data.contactInfo,
                    email: user.email,
                },
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'vendorApplications'), applicationData);

            toast({
                title: 'Application Submitted!',
                description: 'Your application has been received. We will review it and get back to you shortly.',
                duration: 5000,
            });

            router.push('/vendor/dashboard');

        } catch (error: any) {
            console.error('Error submitting application:', error);
            toast({ title: 'Submission Failed', description: 'There was an error submitting your application. Please try again.', variant: 'destructive'});
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-secondary">
            <div className="container py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold font-headline">Become a Vendor</h1>
                        <p className="text-muted-foreground mt-2">Join our platform and grow your business with Averzo.</p>
                    </div>
                    <VendorApplicationForm 
                        user={user} 
                        onSubmit={handleSubmitApplication}
                        isLoading={isLoading} 
                    />
                </div>
            </div>
        </div>
    );
}
