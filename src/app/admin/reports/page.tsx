
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase } from '@/firebase';

interface Order {
    id: string;
    createdAt: Timestamp;
    total: number;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        category?: string;
    }[];
}

interface ProductPerformance {
    id: string;
    name: string;
    unitsSold: number;
    revenue: number;
}

const LoadingSkeleton = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
    </div>
);

export default function ReportsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -29),
        to: new Date(),
    });
    const { db } = useFirebase();

    useEffect(() => {
        if (!db) return;
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const ordersRef = collection(db, 'orders');
                const q = query(ordersRef, where('status', '==', 'Fulfilled'));
                const orderSnapshot = await getDocs(q);
                const orderList = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(orderList);
            } catch (error) {
                console.error("Error fetching reports data: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [db]);

    const filteredOrders = useMemo(() => {
        if (!date?.from || !date?.to) return orders;
        return orders.filter(order => {
            const orderDate = order.createdAt.toDate();
            return orderDate >= date.from! && orderDate <= date.to!;
        });
    }, [orders, date]);

    const salesData = useMemo(() => {
        const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        return { totalSales, totalOrders, averageOrderValue };
    }, [filteredOrders]);

    const productPerformance = useMemo(() => {
        const productMap = new Map<string, { unitsSold: number; revenue: number; name: string }>();
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const existing = productMap.get(item.id) || { unitsSold: 0, revenue: 0, name: item.name };
                existing.unitsSold += item.quantity;
                existing.revenue += item.price * item.quantity;
                productMap.set(item.id, existing);
            });
        });
        const performance = Array.from(productMap, ([id, data]) => ({ id, ...data }));
        return {
            topByRevenue: [...performance].sort((a, b) => b.revenue - a.revenue).slice(0, 10),
            topByUnits: [...performance].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 10),
        }
    }, [filteredOrders]);

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Sales &amp; Product Reports</h1>
                    <p className="text-muted-foreground">Analyze your store's performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sales Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 bg-secondary rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                            <p className="text-3xl font-bold">৳{salesData.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                            <p className="text-3xl font-bold">{salesData.totalOrders.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                            <p className="text-3xl font-bold">৳{salesData.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products by Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productPerformance.topByRevenue.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell className="text-right">৳{p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Top Products by Units Sold</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Units Sold</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productPerformance.topByUnits.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell className="text-right">{p.unitsSold.toLocaleString()}</TableCell>
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
