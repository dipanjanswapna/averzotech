
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UploadCloud, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Provide the essential details for your new product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  placeholder="e.g. Stylish T-Shirt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  placeholder="Provide a detailed description of the product..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Upload images for your product.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Drag and drop your images here, or{' '}
                  <span className="font-semibold text-primary">
                    click to browse
                  </span>
                </p>
              </div>
               <div className="mt-4 grid grid-cols-4 gap-4">
                  <div className="relative">
                      <Image src="https://placehold.co/100x100.png" alt="Product Image" width={100} height={100} className="rounded-md" data-ai-hint="fashion product" />
                      <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full">&times;</Button>
                  </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>
                Manage product pricing and stock levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Price (৳)</Label>
                <Input id="product-price" type="number" placeholder="1299" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-compare-price">
                  Compare-at Price (৳)
                </Label>
                <Input
                  id="product-compare-price"
                  type="number"
                  placeholder="1999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input id="product-sku" placeholder="TSHIRT-BLK-L" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock">Stock Quantity</Label>
                <Input id="product-stock" type="number" placeholder="100" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-status">Status</Label>
                <Select defaultValue="draft">
                  <SelectTrigger id="product-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Category</Label>
                <Select>
                  <SelectTrigger id="product-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men-tshirts">Men &gt; T-Shirts</SelectItem>
                    <SelectItem value="women-kurtas">Women &gt; Kurtas</SelectItem>
                    <SelectItem value="kids-toys">Kids &gt; Toys</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                    <Label htmlFor="product-tags">Tags</Label>
                    <Input id="product-tags" placeholder="e.g. summer, cotton, casual" />
                    <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="secondary">summer <button className='ml-1 text-xs'>&times;</button></Badge>
                        <Badge variant="secondary">cotton <button className='ml-1 text-xs'>&times;</button></Badge>
                    </div>
                </div>
            </CardContent>
          </Card>
           <div className="flex justify-end gap-2">
                <Button variant="outline">Discard</Button>
                <Button>Save Product</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
