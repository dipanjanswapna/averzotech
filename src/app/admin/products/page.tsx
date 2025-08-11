
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for products
const products = [
  {
    id: 'prod-001',
    name: 'Graphic Print T-Shirt',
    category: 'Men > T-Shirts',
    status: 'Active',
    price: 1299,
    stock: 150,
    image: 'https://placehold.co/64x64.png',
    dataAiHint: 'men graphic t-shirt',
  },
  {
    id: 'prod-002',
    name: 'Embroidered Kurta',
    category: 'Women > Kurtas',
    status: 'Active',
    price: 2499,
    stock: 80,
    image: 'https://placehold.co/64x64.png',
    dataAiHint: 'woman ethnic wear',
  },
  {
    id: 'prod-003',
    name: 'Remote Control Car',
    category: 'Kids > Toys',
    status: 'Archived',
    price: 1499,
    stock: 0,
    image: 'https://placehold.co/64x64.png',
    dataAiHint: 'remote control car',
  },
  {
    id: 'prod-004',
    name: 'Cotton Bedsheet',
    category: 'Home > Bedsheets',
    status: 'Active',
    price: 1999,
    stock: 200,
    image: 'https://placehold.co/64x64.png',
    dataAiHint: 'cotton bedsheet',
  },
  {
    id: 'prod-005',
    name: 'Matte Lipstick',
    category: 'Beauty > Makeup',
    status: 'Draft',
    price: 1799,
    stock: 50,
    image: 'https://placehold.co/64x64.png',
    dataAiHint: 'matte lipstick',
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage all the products in your store.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            A list of all products in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Stock
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.image}
                      width="64"
                      data-ai-hint={product.dataAiHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === 'Active'
                          ? 'default'
                          : 'secondary'
                      }
                      className={product.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>৳{product.price.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.stock}
                  </TableCell>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
