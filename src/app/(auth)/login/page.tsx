
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const redirectUser = (role: string) => {
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'vendor') {
      router.push('/vendor/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.fullName}!`,
        });
        redirectUser(userData.role);
      } else {
         toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        router.push('/');
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.fullName}!`,
        });
        redirectUser(userData.role);
      } else {
        // New user signing in with Google, create a document for them
        const newUser = {
            fullName: user.displayName || 'Google User',
            email: user.email,
            role: 'customer', // Default role for Google sign-in
        };
        await setDoc(userDocRef, newUser);
        toast({
          title: "Account Created",
          description: "Welcome to AVERZO!",
        });
        router.push('/');
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      toast({
        title: "Google Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <CardHeader className="text-center space-y-2 px-0">
        <CardTitle className="font-headline text-2xl">Login</CardTitle>
        <CardDescription>Welcome back to AVERZO</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleLogin} className="grid gap-4">
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
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
         <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            Google
        </Button>
      </CardContent>
      <CardFooter className="px-0">
        <p className="w-full text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
