
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
import { Progress } from '@/components/ui/progress';

// Mock data for gift cards
const giftCards = [
  {
    id: 'gift-001',
    code: 'ABCD-EFGH-IJKL-MNOP',
    initialValue: 5000,
    currentBalance: 2500,
    customer: 'Kamal Hasan',
    status: 'Partially Used',
    expiryDate: '2024-12-31',
  },
    {
    id: 'gift-002',
    code: 'QRST-UVWX-YZ12-3456',
    initialValue: 1000,
    currentBalance: 1000,
    customer: 'Rina Akter',
    status: 'Active',
    expiryDate: '2025-06-30',
  },
  {
    id: 'gift-003',
    code: '7890-ABCD-EFGH-IJKL',
    initialValue: 2000,
    currentBalance: 0,
    customer: 'Jamal Khan',
    status: 'Used',
    expiryDate: '2024-05-01',
  },
    {
    id: 'gift-004',
    code: 'MNOP-QRST-UVWX-YZ12',
    initialValue: 500,
    currentBalance: 500,
    customer: 'Priya Sharma',
    status: 'Expired',
    expiryDate: '2023-12-31',
  },
];

export default function GiftCardsPage() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Gift card code copied to clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gift Cards</h1>
          <p className="text-muted-foreground">
            Issue and manage gift cards for your customers.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/gift-cards/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Issue Gift Card
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Gift Cards</CardTitle>
          <CardDescription>
            A list of all issued gift cards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires On</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {giftCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-mono text-xs">
                     <div className="flex items-center gap-2">
                        <span>{card.code.substring(0, 14)}...</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(card.code)}>
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                  </TableCell>
                  <TableCell>{card.customer}</TableCell>
                   <TableCell>
                       <div className="flex flex-col gap-1">
                           <span>৳{card.currentBalance.toLocaleString()} / ৳{card.initialValue.toLocaleString()}</span>
                           <Progress value={(card.currentBalance/card.initialValue) * 100} className="h-1" />
                       </div>
                    </TableCell>
                   <TableCell>
                    <Badge
                      variant={
                        card.status === 'Active' || card.status === 'Partially Used' ? 'default' :
                        card.status === 'Used' ? 'secondary' : 'destructive'
                      }
                       className={card.status === 'Active' || card.status === 'Partially Used' ? 'bg-blue-100 text-blue-800' : ''}
                    >
                      {card.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{card.expiryDate}</TableCell>
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
                        <DropdownMenuItem>Resend to Customer</DropdownMenuItem>
                         <DropdownMenuItem className="text-red-600">Disable Card</DropdownMenuItem>
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
