
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from '@/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import Image from 'next/image';
import { Logo } from '@/components/logo';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: fullName });

      // Create a document in Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName,
        email: email,
        role: 'customer', // Default role
        createdAt: new Date(),
      });

      toast({
        title: "Account Created",
        description: "Welcome! Your account has been successfully created.",
      });
      router.push('/');

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

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
       <div className="hidden bg-muted lg:block relative">
         <Image
          src="https://placehold.co/1080x1920.png"
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="fashion advertisement"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                 <Logo />
            </div>
            <CardHeader className="text-center space-y-2 px-0">
                <CardTitle className="font-headline text-2xl">Create an account</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <form onSubmit={handleRegister} className="grid gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input 
                    id="full-name" 
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create an account'}
                </Button>
                </form>
            </CardContent>
            <CardFooter className="px-0">
                <p className="w-full text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                        Login
                    </Link>
                </p>
            </CardFooter>
        </div>
      </div>
    </div>
  );
}
