
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { filterCategories } from '@/lib/categories';

export default function VendorApplyPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user, db } = useFirebase();

    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [category, setCategory] = useState('');
    
    const [contactName, setContactName] = useState(user?.fullName || '');
    const [contactPhone, setContactPhone] = useState('');

    const [tradeLicenseUrl, setTradeLicenseUrl] = useState('');
    const [nidUrl, setNidUrl] = useState('');
    const [tinUrl, setTinUrl] = useState('');
    
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [bankName, setBankName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [branchName, setBranchName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');


    const handleSubmitApplication = async () => {
        if (!shopName || !shopAddress || !category || !contactName || !contactPhone || !tradeLicenseUrl || !nidUrl) {
            toast({ title: 'Missing Information', description: 'Please fill out all required fields.', variant: 'destructive' });
            return;
        }

        if(paymentMethod === 'bank' && (!bankName || !accountName || !accountNumber)) {
            toast({ title: 'Missing Bank Details', description: 'Please provide all bank details.', variant: 'destructive' });
            return;
        }

        if(paymentMethod === 'mobile' && !mobileNumber) {
            toast({ title: 'Missing Mobile Number', description: 'Please provide mobile banking number.', variant: 'destructive' });
            return;
        }
        
        if (!user || !db) {
            toast({ title: 'Authentication Error', description: 'You must be logged in to apply.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);

        try {
            const applicationData = {
                userId: user.uid,
                status: 'Pending',
                shopInfo: {
                    shopName,
                    address: shopAddress,
                    category,
                },
                contactInfo: {
                    name: contactName,
                    phone: contactPhone,
                    email: user.email,
                },
                documents: {
                    tradeLicenseUrl,
                    nidUrl,
                    tinUrl,
                },
                paymentInfo: {
                    method: paymentMethod,
                    bankName: paymentMethod === 'bank' ? bankName : '',
                    accountName: paymentMethod === 'bank' ? accountName : '',
                    accountNumber: paymentMethod === 'bank' ? accountNumber : '',
                    branchName: paymentMethod === 'bank' ? branchName : '',
                    mobileNumber: paymentMethod === 'mobile' ? mobileNumber : '',
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
    
    if (!user) {
        // You can show a loading spinner or a message while user data is being fetched
        return <p>Loading user information...</p>
    }

    return (
        <div className="min-h-screen bg-secondary">
            <div className="container py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold font-headline">Become a Vendor</h1>
                        <p className="text-muted-foreground mt-2">Join our platform and grow your business with Averzo.</p>
                    </div>

                    <div className="space-y-8">
                        <Card>
                             <CardHeader>
                                <CardTitle>1. Shop Information</CardTitle>
                                <CardDescription>Tell us about your business.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="shop-name">Shop Name</Label>
                                    <Input id="shop-name" value={shopName} onChange={e => setShopName(e.target.value)} disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shop-address">Full Shop Address</Label>
                                    <Textarea id="shop-address" value={shopAddress} onChange={e => setShopAddress(e.target.value)} disabled={isLoading} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="shop-category">Primary Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger id="shop-category"><SelectValue placeholder="Select your main category" /></SelectTrigger>
                                        <SelectContent>
                                            {filterCategories.map(cat => (
                                                <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>2. Contact Person Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="contact-name">Full Name</Label>
                                    <Input id="contact-name" value={contactName} onChange={e => setContactName(e.target.value)} disabled={isLoading} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="contact-phone">Phone Number</Label>
                                    <Input id="contact-phone" value={contactPhone} onChange={e => setContactPhone(e.target.value)} disabled={isLoading} />
                                </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="contact-email">Email Address</Label>
                                    <Input id="contact-email" value={user.email || ''} disabled />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>3. Legal Documents</CardTitle>
                                <CardDescription>Please provide public Google Drive links to your documents.</CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="trade-license">Trade License URL</Label>
                                    <Input id="trade-license" placeholder="https://drive.google.com/..." value={tradeLicenseUrl} onChange={e => setTradeLicenseUrl(e.target.value)} disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nid">NID/Passport URL</Label>
                                    <Input id="nid" placeholder="https://drive.google.com/..." value={nidUrl} onChange={e => setNidUrl(e.target.value)} disabled={isLoading} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="tin">TIN Certificate URL (Optional)</Label>
                                    <Input id="tin" placeholder="https://drive.google.com/..." value={tinUrl} onChange={e => setTinUrl(e.target.value)} disabled={isLoading} />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>4. Payment Information</CardTitle>
                                <CardDescription>How would you like to receive payments?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="bank" id="bank" />
                                        <Label htmlFor="bank">Bank Transfer</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="mobile" id="mobile" />
                                        <Label htmlFor="mobile">Mobile Banking (bKash)</Label>
                                    </div>
                                </RadioGroup>
                                
                                {paymentMethod === 'bank' && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2"><Label htmlFor="bank-name">Bank Name</Label><Input id="bank-name" value={bankName} onChange={e => setBankName(e.target.value)} /></div>
                                            <div className="space-y-2"><Label htmlFor="branch-name">Branch Name</Label><Input id="branch-name" value={branchName} onChange={e => setBranchName(e.target.value)}/></div>
                                        </div>
                                        <div className="space-y-2"><Label htmlFor="account-name">Account Holder Name</Label><Input id="account-name" value={accountName} onChange={e => setAccountName(e.target.value)}/></div>
                                        <div className="space-y-2"><Label htmlFor="account-number">Account Number</Label><Input id="account-number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}/></div>
                                    </div>
                                )}
                                {paymentMethod === 'mobile' && (
                                     <div className="space-y-4 pt-4 border-t">
                                          <div className="space-y-2"><Label htmlFor="mobile-number">bKash Number</Label><Input id="mobile-number" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)}/></div>
                                     </div>
                                )}
                            </CardContent>
                        </Card>
                        <div className="flex justify-end">
                            <Button size="lg" onClick={handleSubmitApplication} disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
