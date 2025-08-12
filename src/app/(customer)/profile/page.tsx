
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, AppUser } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function MyProfilePage() {
    const { user, setUser } = useAuth();
    const { toast } = useToast();
    const db = getFirestore(app);
    const auth = getAuth(app);

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isSavingDetails, setIsSavingDetails] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    useEffect(() => {
        if(user) {
            setFullName(user.fullName);
        }
    }, [user]);

    const handleUpdateDetails = async () => {
        if (!user || !fullName.trim()) {
            toast({ title: "Name cannot be empty", variant: "destructive" });
            return;
        }

        setIsSavingDetails(true);
        const userRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userRef, { fullName });
            setUser(prevUser => prevUser ? { ...prevUser, fullName } : null);
            toast({ title: "Profile Updated", description: "Your name has been successfully updated." });
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        } finally {
            setIsSavingDetails(false);
        }
    };
    
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email || !auth.currentUser) return;
        if (newPassword !== confirmPassword) {
            toast({ title: "Passwords do not match", variant: "destructive" });
            return;
        }
        if (newPassword.length < 6) {
             toast({ title: "Password too short", description: "Password must be at least 6 characters long.", variant: "destructive" });
             return;
        }

        setIsSavingPassword(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);

            toast({ title: "Password Updated", description: "Your password has been changed successfully." });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error: any) {
             toast({ title: "Error updating password", description: error.message, variant: "destructive" });
             console.error(error);
        } finally {
            setIsSavingPassword(false);
        }
    }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and password.</p>
      </div>
        <Card>
            <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
                Manage your personal information.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isSavingDetails}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ''} readOnly disabled />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpdateDetails} disabled={isSavingDetails}>
                    {isSavingDetails ? 'Saving...' : 'Save Details'}
                </Button>
            </CardFooter>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password for better security.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required disabled={isSavingPassword}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required disabled={isSavingPassword}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={isSavingPassword}/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSavingPassword}>
                         {isSavingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}
