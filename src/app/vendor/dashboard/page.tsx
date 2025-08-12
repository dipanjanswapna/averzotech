
'use client';

import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/use-auth';

interface Stat {
    title: string;
    value: string;
    icon: React.ElementType;
}

interface RecentSale {
    id: string;
    customerName: string;
    total: number;
    avatarUrl?: string;
}

interface DashboardData {
    stats: Stat[];
    recentSales: RecentSale[];
}

export default function VendorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user?.fullName) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const db = getFirestore(app);
        // 1. Get all product IDs for the current vendor
        const productsRef = collection(db, 'products');
        const qProducts = query(productsRef, where("vendor", "==", user.fullName));
        const productSnapshot = await getDocs(qProducts);
        const vendorProductIds = productSnapshot.docs.map(doc => doc.id);
        const totalProducts = vendorProductIds.length;

        let totalRevenue = 0;
        let totalOrders = 0;
        let recentSales: RecentSale[] = [];

        if (totalProducts > 0) {
            // 2. Get all orders
            const ordersRef = collection(db, 'orders');
            const allOrdersSnapshot = await getDocs(query(ordersRef, orderBy('createdAt', 'desc')));

            // 3. Filter orders to find ones containing this vendor's products
            const vendorOrders = allOrdersSnapshot.docs.filter(doc => {
                const orderItems = doc.data().items as { id: string }[];
                return orderItems.some(item => vendorProductIds.includes(item.id));
            });
            
            totalOrders = vendorOrders.length;

            // 4. Calculate revenue and prepare recent sales
            vendorOrders.forEach(orderDoc => {
                const orderData = orderDoc.data();
                const relevantItems = orderData.items.filter((item: any) => vendorProductIds.includes(item.id));
                const revenueFromThisOrder = relevantItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                totalRevenue += revenueFromThisOrder;

                if(recentSales.length < 5) {
                     recentSales.push({
                        id: orderDoc.id,
                        customerName: orderData.customerName,
                        total: revenueFromThisOrder, // Show only vendor's portion of the sale
                        avatarUrl: '', // Placeholder
                    });
                }
            });
        }
        
        const stats: Stat[] = [
            { title: "Total Revenue", value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign },
            { title: "Total Products", value: `${totalProducts}`, icon: Package },
            { title: "Total Orders", value: `${totalOrders}`, icon: ShoppingCart },
        ];

        setDashboardData({ stats, recentSales });

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading Vendor Data...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  if (!dashboardData) {
      return <p>Could not load dashboard data.</p>
  }


  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-lg mt-2 text-muted-foreground">Welcome, {user.fullName}!</p>
        
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {dashboardData.stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
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
                    <CardDescription>Your products were part of {dashboardData.recentSales.length} recent sales.</CardDescription>
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
                            {dashboardData.recentSales.map(sale => (
                                <TableRow key={sale.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={sale.avatarUrl} alt="Avatar" />
                                                <AvatarFallback>{sale.customerName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{sale.customerName}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">৳{sale.total.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
