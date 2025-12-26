
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Users, Package, ShoppingCart, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stat {
    title: string;
    value: string;
    icon: React.ElementType;
    change: string;
    changeType: 'increase' | 'decrease';
}

interface RecentSale {
    id: string;
    customerName: string;
    customerEmail: string;
    total: number;
    avatarUrl?: string;
}

interface DashboardData {
    stats: Stat[];
    recentSales: RecentSale[];
    salesData: { name: string, sales: number }[];
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Fetch Products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;
        
        // Fetch Orders for stats and recent sales
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        const totalOrders = ordersSnapshot.size;
        const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + doc.data().total, 0);

        // Fetch recent 5 sales
        const recentOrdersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(5));
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
        const recentSales = recentOrdersSnapshot.docs.map(doc => {
             const data = doc.data();
             return {
                id: doc.id,
                customerName: data.customerName,
                customerEmail: data.shippingAddress?.email || 'N/A',
                total: data.total,
                avatarUrl: '', // Placeholder for avatar
             }
        });
        
        // Sample sales data for the chart
        const salesData = [
          { name: 'Jan', sales: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'Feb', sales: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'Mar', sales: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'Apr', sales: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'May', sales: Math.floor(Math.random() * 5000) + 1000 },
          { name: 'Jun', sales: totalRevenue },
        ];
        
        const stats: Stat[] = [
            { title: "Total Revenue", value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+20.1% from last month", changeType: 'increase' },
            { title: "Total Users", value: `+${totalUsers}`, icon: Users, change: "+180.1% from last month", changeType: 'increase' },
            { title: "Total Products", value: `${totalProducts}`, icon: Package, change: "+19% from last month", changeType: 'increase' },
            { title: "Total Orders", value: `+${totalOrders}`, icon: ShoppingCart, change: "+2% from last month", changeType: 'decrease' },
        ];

        setDashboardData({ stats, recentSales, salesData });

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
      return <LoadingSpinner />;
  }
  
  if (!dashboardData) {
      return <p>Could not load dashboard data.</p>
  }


  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardData.stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <span className={`flex items-center ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.changeType === 'increase' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                                {stat.change}
                            </span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Your sales performance over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={dashboardData.salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                itemStyle={{ color: 'hsl(var(--primary))' }}
                            />
                            <Legend />
                            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                 <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>You made {dashboardData.recentSales.length} sales recently.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
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
                                                <p className="text-sm text-muted-foreground">{sale.customerEmail}</p>
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
