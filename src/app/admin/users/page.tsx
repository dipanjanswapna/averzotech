
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';


interface User {
  uid: string;
  fullName: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  photoURL?: string;
  createdAt?: any; 
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('createdAt', 'desc'));
        const userSnapshot = await getDocs(q);
        const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
        setUsers(userList);
    } catch (error) {
        console.error("Error fetching users: ", error);
        toast({ title: "Error", description: "Could not fetch users.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    // Note: This only deletes the Firestore document.
    // For a full user deletion, you would also need to call a Firebase Function
    // to delete the user from Firebase Authentication.
    try {
        await deleteDoc(doc(db, "users", userId));
        toast({
            title: "User Deleted",
            description: "The user has been successfully removed from the database.",
        });
        fetchUsers(); // Refresh the list
    } catch (error) {
        console.error("Error deleting user: ", error);
        toast({
            title: "Error",
            description: "There was a problem deleting the user.",
            variant: "destructive"
        })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'vendor':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };


  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Loading users...</p>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Users</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all the users in your account including their name, title, email and role.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">
                     <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.photoURL} alt={user.fullName} />
                          <AvatarFallback>{user.fullName?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {user.fullName}
                      </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                   <TableCell>
                    <AlertDialog>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/users/edit/${user.uid}`}>
                                    <Pencil className="mr-2 h-4 w-4" /> View/Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user <span className="font-bold">{user.fullName}</span>'s data from the database. This does not remove them from Firebase Authentication.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.uid)} className="bg-destructive hover:bg-destructive/90">
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
