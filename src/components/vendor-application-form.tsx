
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
import React, { useState, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { filterCategories } from '@/lib/categories';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { VendorApplicationData } from '@/types';
import { getDivisions, getDistricts, getThanas } from '@/lib/location';
import { useCollection } from '@/firebase';

interface VendorApplicationFormProps {
    user: { fullName: string };
    onSubmit: (data: VendorApplicationData) => void;
    isLoading?: boolean;
}

export function VendorApplicationForm({ user, onSubmit, isLoading = false }: VendorApplicationFormProps) {
    const { toast } = useToast();
    
    // Form State
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [category, setCategory] = useState('');
    
    const [contactName, setContactName] = useState(user?.fullName || '');
    const [contactPhone, setContactPhone] = useState('');

    const [tradeLicenseUrl, setTradeLicenseUrl] = useState('');
    const [nidUrl, setNidUrl] = useState('');
    const [tinUrl, setTinUrl] = useState('');
    
    const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile'>('bank');
    const [bankName, setBankName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [branchName, setBranchName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Address state
    const [division, setDivision] = useState('');
    const [district, setDistrict] = useState('');
    const [thana, setThana] = useState('');

    const { data: divisions } = useCollection<any>('divisions');
    const { data: districts } = useCollection<any>(division ? `divisions/${division}/districts` : '');
    const { data: thanas } = useCollection<any>(district ? `districts/${district}/upazilas` : '');

    const handleSelectChange = (field: 'division' | 'district' | 'thana') => (value: string) => {
        switch(field) {
            case 'division':
                setDivision(value);
                setDistrict('');
                setThana('');
                break;
            case 'district':
                setDistrict(value);
                setThana('');
                break;
            case 'thana':
                setThana(value);
                break;
        }
    };


    const handleSubmit = () => {
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

        if (!agreedToTerms) {
            toast({ title: 'Agreement Required', description: 'You must agree to the terms and conditions to proceed.', variant: 'destructive' });
            return;
        }

        const formData: VendorApplicationData = {
            shopInfo: {
                shopName,
                address: shopAddress,
                category,
            },
            contactInfo: {
                name: contactName,
                phone: contactPhone,
                email: ''
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
            division: divisions?.find((d: any) => d.id === division)?.name_en || '',
            district: districts?.find((d: any) => d.id === district)?.name_en || '',
            thana: thanas?.find((t: any) => t.id === thana)?.name_en || '',
            postOffice: '', // This can be removed if not needed, or populated from a new 'unions' collection
            postCode: ''
        };
        onSubmit(formData);
    };
    
    return (
        <ScrollArea className="h-[70vh]">
            <div className="space-y-8 p-4">
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
                        <div className="grid grid-cols-2 gap-4">
                            <Select value={division} onValueChange={handleSelectChange('division')}>
                                <SelectTrigger><SelectValue placeholder="Select Division" /></SelectTrigger>
                                <SelectContent>
                                    {divisions?.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name_en}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={district} onValueChange={handleSelectChange('district')} disabled={!division}>
                                <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                                <SelectContent>
                                    {districts?.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name_en}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                             <Select value={thana} onValueChange={handleSelectChange('thana')} disabled={!district}>
                                <SelectTrigger><SelectValue placeholder="Select Thana/Upazila" /></SelectTrigger>
                                <SelectContent>
                                    {thanas?.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.name_en}</SelectItem>)}
                                </SelectContent>
                            </Select>
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
                                    {filterCategories.map((cat: any, i:number) => (
                                        <SelectItem key={`${cat.name}-${i}`} value={cat.name}>{cat.name}</SelectItem>
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
                        <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'bank' | 'mobile')} className="mb-4">
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
                <Card>
                    <CardHeader>
                        <CardTitle>5. Digital Agreement</CardTitle>
                        <CardDescription>Please read and agree to our terms of service.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48 border rounded-md p-4 overflow-y-auto text-xs text-muted-foreground bg-secondary/50">
                           <p className="font-bold">Averzo Marketplace Vendor Agreement</p>
                           <p>This agreement is made between Averzo Marketplace ("Averzo") and the vendor ("Vendor"). By signing up, the Vendor agrees to the following terms:</p>
                           <br />
                           <p><strong>1. Product Listing:</strong> Vendor agrees to provide accurate and complete information for all products listed. All products must comply with Averzo's quality standards and legal requirements in Bangladesh.</p>
                           <p><strong>2. Pricing & Payment:</strong> Vendor will supply products at the agreed wholesale price. Averzo will determine the final retail price. Payments for sold goods will be made to the Vendor within 15-30 business days after the sale, as per the selected payment method.</p>
                           <p><strong>3. Inventory & Fulfillment:</strong> Vendor is responsible for maintaining accurate stock levels. Averzo will handle all customer-facing logistics, including shipping and returns.</p>
                           <p><strong>4. Quality Control:</strong> Averzo reserves the right to reject any product that does not meet its quality standards. Rejected products will be returned at the Vendor's expense.</p>
                            <p><strong>5. Termination:</strong> Either party may terminate this agreement with 30 days' written notice. Averzo reserves the right to suspend or terminate a Vendor's account for any breach of these terms.</p>
                       </div>
                       <div className="flex items-center space-x-2 mt-4">
                            <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I have read and agree to the terms and conditions.
                            </label>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button size="lg" onClick={handleSubmit} disabled={isLoading || !agreedToTerms}>
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </div>
            </div>
        </ScrollArea>
    )
}
