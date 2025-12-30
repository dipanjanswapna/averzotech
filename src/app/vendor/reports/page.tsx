
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
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    createdAt: Timestamp;
    items: OrderItem[];
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
        <Skeleton className="h-96 w-full" />
    </div>
);

export default function VendorReportsPage() {
    const { user } = useAuth();
    const [vendorProducts, setVendorProducts] = useState<string[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -29),
        to: new Date(),
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.fullName) return;
            setLoading(true);
            try {
                // 1. Get all product IDs for the current vendor
                const productsRef = collection(db, 'products');
                const qProducts = query(productsRef, where("vendor", "==", user.fullName));
                const productSnapshot = await getDocs(qProducts);
                const vendorProductIds = productSnapshot.docs.map(doc => doc.id);
                setVendorProducts(vendorProductIds);

                if (vendorProductIds.length === 0) {
                    setOrders([]);
                    setLoading(false);
                    return;
                }

                // 2. Fetch all fulfilled orders
                const ordersRef = collection(db, 'orders');
                const qOrders = query(ordersRef, where('status', '==', 'Fulfilled'));
                const orderSnapshot = await getDocs(qOrders);
                
                // 3. Filter orders to only include those with the vendor's products
                const relevantOrders = orderSnapshot.docs.map(doc => {
                    const orderData = { id: doc.id, ...doc.data() } as Order;
                    // Filter items within each order to only include vendor's products
                    orderData.items = orderData.items.filter(item => vendorProductIds.includes(item.id));
                    return orderData;
                }).filter(order => order.items.length > 0); // Only keep orders that have at least one of the vendor's products

                setOrders(relevantOrders);

            } catch (error) {
                console.error("Error fetching reports data: ", error);
            } finally {
                setLoading(false);
            }
        };
        if(user) {
            fetchData();
        }
    }, [user]);

    const filteredOrders = useMemo(() => {
        if (!date?.from || !date?.to) return orders;
        return orders.filter(order => {
            const orderDate = order.createdAt.toDate();
            return orderDate >= date.from! && orderDate <= date.to!;
        });
    }, [orders, date]);

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
                    <h1 className="text-3xl font-bold">My Reports</h1>
                    <p className="text-muted-foreground">Analyze your product performance.</p>
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
