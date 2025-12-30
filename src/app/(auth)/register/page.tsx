
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Chrome, CheckCircle } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VendorApplicationForm, VendorApplicationData } from '@/components/vendor-application-form';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor' | 'delivery'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [vendorApplicationData, setVendorApplicationData] = useState<VendorApplicationData | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const { toast } = useToast();
  const { auth, db } = useFirebase();
  const router = useRouter();

  const isVendorAndFormIncomplete = role === 'vendor' && !vendorApplicationData;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });
      
      const userStatus = (role === 'vendor' || role === 'delivery') ? 'pending' : 'active';

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: user.email,
        role: role,
        uid: user.uid,
        status: userStatus,
        createdAt: new Date(),
      });
      
      if (role === 'vendor' && vendorApplicationData) {
        const applicationData = {
          ...vendorApplicationData,
          userId: user.uid,
          status: 'Pending',
          contactInfo: {
              ...vendorApplicationData.contactInfo,
              email: user.email,
          },
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'vendorApplications'), applicationData);
        toast({
          title: "Application Submitted!",
          description: "Your application is pending review. You will be notified upon approval.",
          duration: 5000,
        });
        await signOut(auth);
        router.push('/login');
      } else if (role === 'delivery') {
        await signOut(auth);
        toast({
          title: `Delivery Account Submitted`,
          description: `Your Delivery account is pending admin approval. You will be notified upon activation.`,
          duration: 5000,
        });
         router.push('/login');
      } else {
         toast({
          title: "Account Created Successfully!",
          description: "Welcome to AVERZO!",
        });
        router.push('/');
      }

    } catch (error: any) {
      console.error("Registration Error:", error);
      let description = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email address is already in use. Please try logging in.";
      }
      toast({
        title: "Registration Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!auth || !db) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName,
        email: user.email,
        role: 'customer',
        status: 'active',
        uid: user.uid,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });

      toast({
        title: "Account Created",
        description: "Welcome to AVERZO!",
      });
      router.push('/');
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
       toast({
        title: "Sign-Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  }

  const handleVendorFormSubmit = (data: VendorApplicationData) => {
    setVendorApplicationData(data);
    setIsVendorModalOpen(false);
    toast({
        title: "Application Details Saved",
        description: "You can now create your vendor account.",
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription>Join AVERZO today!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="grid gap-4">
           <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              type="text" 
              placeholder="Kamal Hasan" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label>I am a</Label>
            <RadioGroup 
                defaultValue="customer" 
                className="grid grid-cols-3 gap-4"
                value={role}
                onValueChange={(value) => setRole(value as 'customer' | 'vendor' | 'delivery')}
                disabled={isLoading}
            >
                <div>
                    <RadioGroupItem value="customer" id="customer" className="peer sr-only" />
                    <Label
                    htmlFor="customer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                    Customer
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="vendor" id="vendor" className="peer sr-only" />
                    <Label
                    htmlFor="vendor"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                    Vendor
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                    <Label
                    htmlFor="delivery"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                    Delivery
                    </Label>
                </div>
            </RadioGroup>
          </div>
          
          {role === 'vendor' && (
            <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
                <DialogTrigger asChild>
                     <Button variant={vendorApplicationData ? 'secondary' : 'default'} className="w-full">
                        {vendorApplicationData ? <><CheckCircle className="mr-2 h-4 w-4" /> Application Completed</> : 'Complete Vendor Application'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                     <DialogHeader>
                        <DialogTitle>Vendor Application</DialogTitle>
                        <DialogDescription>Fill in your business details to become a vendor.</DialogDescription>
                    </DialogHeader>
                    <VendorApplicationForm 
                      user={{fullName}} 
                      onSubmit={handleVendorFormSubmit} 
                    />
                </DialogContent>
            </Dialog>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || isVendorAndFormIncomplete}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
         <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>
         <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            Google
        </Button>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
