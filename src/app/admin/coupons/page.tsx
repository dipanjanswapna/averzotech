
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// Mock data for coupons
const coupons = [
  {
    id: 'coupon-001',
    code: 'SUMMER25',
    type: 'Percentage',
    value: '25%',
    status: 'Active',
    used: 120,
    limit: 1000,
  },
  {
    id: 'coupon-002',
    code: 'FLAT500',
    type: 'Fixed Amount',
    value: '৳500',
    status: 'Active',
    used: 50,
    limit: 200,
  },
  {
    id: 'coupon-003',
    code: 'EIDJOY',
    type: 'Percentage',
    value: '15%',
    status: 'Expired',
    used: 500,
    limit: 500,
  },
  {
    id: 'coupon-004',
    code: 'NEWUSER',
    type: 'Fixed Amount',
    value: '৳200',
    status: 'Scheduled',
    used: 0,
    limit: null,
  },
];

export default function CouponsPage() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">
            Create and manage discount coupons for your store.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Coupon
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>
            A list of all promotional coupons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{coupon.code}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(coupon.code)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{coupon.type}</TableCell>
                  <TableCell className="font-semibold">{coupon.value}</TableCell>
                   <TableCell>
                    <Badge
                      variant={
                        coupon.status === 'Active' ? 'default' :
                        coupon.status === 'Scheduled' ? 'secondary' : 'destructive'
                      }
                       className={coupon.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {coupon.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{coupon.used} / {coupon.limit ?? '∞'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                         <DropdownMenuItem className="text-red-600">Disable</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
