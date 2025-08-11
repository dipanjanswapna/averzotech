
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
  uid: string;
  fullName: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  photoURL?: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor' | 'admin'>('customer');

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setIsFetching(true);
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = { uid: userSnap.id, ...userSnap.data() } as User;
          setUser(userData);
          setFullName(userData.fullName);
          setRole(userData.role);
        } else {
          toast({ title: "Error", description: "User not found.", variant: "destructive" });
          router.push('/admin/users');
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        toast({ title: "Error", description: "Could not fetch user details.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [userId, router, toast]);

  const handleUpdateUser = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fullName: fullName,
        role: role,
      });
      toast({
        title: 'User Updated',
        description: `User "${fullName}" has been successfully updated.`,
      });
      router.push('/admin/users');
    } catch (error: any) {
      console.error('Error updating user: ', error);
      toast({ title: 'Error', description: 'There was a problem updating the user.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-8 w-48" />
        </div>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Or a not found component
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.fullName}</CardTitle>
          <CardDescription>
            View and edit user details and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className='flex items-center gap-4'>
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.photoURL} alt={user.fullName} />
                    <AvatarFallback>{user.fullName?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-lg font-bold">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input id="email-address" value={user.email} disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as any)} disabled={isLoading}>
                        <SelectTrigger id="user-role"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
             <Button variant="outline" disabled={isLoading} onClick={() => router.back()}>Cancel</Button>
             <Button onClick={handleUpdateUser} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
             </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
