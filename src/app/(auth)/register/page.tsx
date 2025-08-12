
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Chrome } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });
      
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: user.email,
        role: role,
        uid: user.uid,
      });

      toast({
        title: "Account Created",
        description: "Welcome to AVERZO! Please login to continue.",
      });
      router.push('/login');
    } catch (error: any) {
      console.error("Registration Error:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // For Google Sign-Up, we'll default the role to 'customer'.
      // You could add a step to ask for a role if needed.
      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName,
        email: user.email,
        role: 'customer',
        uid: user.uid,
        photoURL: user.photoURL
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

  return (
    <Card className="w-full max-w-sm">
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
                className="grid grid-cols-2 gap-4"
                value={role}
                onValueChange={(value) => setRole(value as 'customer' | 'vendor')}
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
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
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
