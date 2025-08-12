
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function VendorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productsQuery = query(collection(db, 'products'), where('vendor', '==', user.fullName)); // Assuming vendor name is stored
                const productsSnapshot = await getDocs(productsQuery);
                const productCount = productsSnapshot.size;
                setStats(prev => ({...prev, products: productCount}));

                // More complex logic would be needed for revenue and orders
                // This is a placeholder
                setStats(prev => ({...prev, revenue: 0, orders: 0}));

            } catch (error) {
                console.error("Error fetching vendor data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }
  }, [user]);

  if (loading) {
      return <p>Loading dashboard...</p>
  }

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-lg mt-2">Welcome, {user?.fullName || 'Vendor'}!</p>
        
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
             <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{stats.revenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.products}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.orders}</div>
                    </CardContent>
                </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>A chart showing your recent sales activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] bg-secondary rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Sales chart will be implemented here.</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                 <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>Your products were part of recent sales.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-right">Your Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">No recent sales data.</TableCell>
                            </TableRow>
                        </TableBody>
                     </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
