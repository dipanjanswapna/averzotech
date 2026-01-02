
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  Package,
  Wallet,
  Download,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const salesData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
];

const topProducts = [
    { name: 'Premium Cotton T-Shirt', sold: 320 },
    { name: 'Classic Blue Jeans', sold: 210 },
    { name: 'Leather Biker Jacket', sold: 150 },
    { name: 'Formal Oxford Shirt', sold: 90 },
    { name: 'Casual Summer Shorts', sold: 75 },
]

export default function VendorAccountsPage() {
  const { user, db } = useFirebase();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(125500);

  const handleRequestWithdrawal = async () => {
    if (!user || !db) {
        toast({ title: 'Error', description: 'User not logged in.', variant: 'destructive'});
        return;
    }
    if (withdrawalAmount <= 0) {
        toast({ title: 'Invalid Amount', description: 'Please enter a valid amount to withdraw.', variant: 'destructive'});
        return;
    }
    // In a real app, you would check against the actual withdrawable balance.
    if (withdrawalAmount > 125500) {
        toast({ title: 'Insufficient Balance', description: 'Withdrawal amount exceeds your withdrawable balance.', variant: 'destructive'});
        return;
    }

    setIsRequesting(true);
    try {
        await addDoc(collection(db, "withdrawalRequests"), {
            vendorId: user.uid,
            vendorName: user.fullName,
            amount: withdrawalAmount,
            status: 'Pending',
            requestedAt: serverTimestamp(),
        });
        toast({
            title: 'Request Submitted',
            description: `Your request to withdraw ৳${withdrawalAmount} has been submitted for review.`,
        });
    } catch (error) {
        console.error("Error submitting withdrawal request:", error);
        toast({ title: 'Request Failed', description: 'There was an error submitting your request.', variant: 'destructive'});
    } finally {
        setIsRequesting(false);
    }
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Accounts & Sales Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳1,250,000</div>
            <p className="text-xs text-muted-foreground">Total value of products received by Averzo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳850,000</div>
             <p className="text-xs text-muted-foreground">Lifetime payments received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payable (Due)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">৳400,000</div>
            <p className="text-xs text-muted-foreground">Pending amount to be paid</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                        <CardDescription>Your sales performance over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={salesData}>
                                <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                />
                                <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `৳${value / 1000}k`}
                                />
                                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                         <div>
                            <CardTitle>Top Selling Products</CardTitle>
                            <CardDescription>Your best-performing products on Averzo.</CardDescription>
                         </div>
                         <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead className="text-right">Units Sold</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topProducts.map(prod => (
                                    <TableRow key={prod.name}>
                                        <TableCell>{prod.name}</TableCell>
                                        <TableCell className="text-right font-semibold">{prod.sold}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>My Wallet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border p-4 rounded-lg text-center">
                            <p className="text-sm text-muted-foreground">Withdrawable Balance</p>
                            <p className="text-4xl font-bold">৳125,500.00</p>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Funds become withdrawable after the 14-day return period.</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full" size="lg">Request Withdrawal</Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Request Withdrawal</AlertDialogTitle>
                                    <AlertDialogDescription>Enter the amount you wish to withdraw. The request will be sent to the admin for approval.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (Max: ৳125,500.00)</Label>
                                    <Input id="amount" type="number" value={withdrawalAmount} onChange={e => setWithdrawalAmount(Number(e.target.value))} />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRequestWithdrawal} disabled={isRequesting}>
                                        {isRequesting ? 'Submitting...' : 'Submit Request'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                             </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                    <CardFooter>
                         <p className="text-sm text-muted-foreground">Pending Balance: <span className="font-semibold text-foreground">৳274,500.00</span></p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Digital Ledger</CardTitle>
                        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> PDF</Button>
                    </CardHeader>
                     <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>TXN ID</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                 <TableRow>
                                    <TableCell className="text-sm">14 Aug, 2024</TableCell>
                                    <TableCell className="font-mono text-xs">WD-8437591</TableCell>
                                    <TableCell className="text-right text-red-500 font-semibold flex items-center justify-end gap-1">
                                        <ArrowUp className="h-4 w-4" /> ৳50,000.00
                                    </TableCell>
                                </TableRow>
                                 <TableRow>
                                    <TableCell className="text-sm">12 Aug, 2024</TableCell>
                                    <TableCell className="font-mono text-xs">CR-9823471</TableCell>
                                    <TableCell className="text-right text-green-500 font-semibold flex items-center justify-end gap-1">
                                        <ArrowDown className="h-4 w-4" /> ৳75,500.00
                                    </TableCell>
                                </TableRow>
                                 <TableRow>
                                    <TableCell className="text-sm">01 Aug, 2024</TableCell>
                                    <TableCell className="font-mono text-xs">WD-7459234</TableCell>
                                    <TableCell className="text-right text-red-500 font-semibold flex items-center justify-end gap-1">
                                         <ArrowUp className="h-4 w-4" /> ৳100,000.00
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                     </CardContent>
                </Card>
            </div>
       </div>

    </div>
  );
}
