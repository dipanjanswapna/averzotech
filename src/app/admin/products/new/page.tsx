
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
import { UploadCloud, ChevronLeft, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import React from 'react';

const filterCategories = [
    { 
      name: 'Men',
      groups: [
        { name: 'Topwear', subcategories: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Jackets'] },
        { name: 'Bottomwear', subcategories: ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track Pants'] },
        { name: 'Footwear', subcategories: ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Sneakers', 'Sandals'] },
        { name: 'Accessories', subcategories: ['Watches', 'Wallets', 'Belts', 'Sunglasses', 'Bags'] }
      ]
    },
    { 
      name: 'Women', 
      groups: [
        { name: 'Indian & Fusion Wear', subcategories: ['Kurtas & Suits', 'Sarees', 'Lehengas', 'Ethnic Gowns'] },
        { name: 'Western Wear', subcategories: ['Dresses', 'Tops', 'T-Shirts', 'Jeans', 'Skirts'] },
        { name: 'Footwear', subcategories: ['Flats', 'Heels', 'Boots', 'Sports Shoes'] },
        { name: 'Jewellery & Accessories', subcategories: ['Earrings', 'Necklaces', 'Handbags', 'Watches'] }
      ]
    },
    { name: 'Kids', groups: [
        { name: 'Boys Clothing', subcategories: ['T-Shirts', 'Shirts', 'Jeans', 'Shorts'] },
        { name: 'Girls Clothing', subcategories: ['Dresses', 'Tops', 'Skirts', 'T-shirts'] },
        { name: 'Infants', subcategories: ['Rompers', 'Bodysuits', 'Sleepwear'] },
        { name: 'Toys & Games', subcategories: ['Action Figures', 'Dolls', 'Board Games', 'Puzzles'] }
    ]},
    { name: 'Home & Living', groups: [
        { name: 'Bed & Bath', subcategories: ['Bedsheets', 'Pillows', 'Towels', 'Bathrobes'] },
        { name: 'Decor', subcategories: ['Vases', 'Photo Frames', 'Wall Art', 'Candles'] },
        { name: 'Kitchen & Dining', subcategories: ['Dinnerware', 'Cookware', 'Storage', 'Cutlery'] }
    ]},
    { name: 'Beauty', groups: [
        { name: 'Makeup', subcategories: ['Lipstick', 'Foundation', 'Mascara', 'Eyeshadow'] },
        { name: 'Skincare', subcategories: ['Moisturizer', 'Cleanser', 'Sunscreen', 'Face Masks'] },
        { name: 'Fragrance', subcategories: ['Perfumes', 'Deodorants', 'Body Mists'] },
        { name: 'Haircare', subcategories: ['Shampoo', 'Conditioner', 'Hair Oil', 'Styling Tools'] }
    ]},
    { name: 'Electronics', groups: [
        { name: 'Mobiles & Wearables', subcategories: ['Smartphones', 'Smartwatches', 'Headphones', 'Speakers']},
        { name: 'Laptops & Computers', subcategories: ['Laptops', 'Desktops', 'Monitors', 'Keyboards', 'Mouse']},
        { name: 'Cameras & Drones', subcategories: ['DSLRs', 'Mirrorless Cameras', 'Drones', 'Action Cameras']},
    ]},
    { name: 'Sports', groups: [
        { name: 'Cricket', subcategories: ['Bats', 'Balls', 'Pads', 'Gloves']},
        { name: 'Football', subcategories: ['Footballs', 'Jerseys', 'Boots', 'Shin Guards']},
        { name: 'Fitness', subcategories: ['Dumbbells', 'Yoga Mats', 'Resistance Bands', 'Trackers']},
    ]},
    { name: 'Books', groups: [
        { name: 'Fiction', subcategories: ['Mystery', 'Thriller', 'Sci-Fi', 'Fantasy', 'Romance']},
        { name: 'Non-Fiction', subcategories: ['Biography', 'History', 'Self-Help', 'Business']},
        { name: "Children's Books", subcategories: ['Picture Books', 'Story Books', 'Young Adult']},
    ]},
];

export default function NewProductPage() {
  const [specifications, setSpecifications] = React.useState([{ label: '', value: '' }]);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState('');

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { label: '', value: '' }]);
  };

  const handleRemoveSpecification = (index: number) => {
    const newSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecifications);
  };
  
  const handleSpecificationChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };

  const availableGroups = React.useMemo(() => {
    if (!selectedCategory) return [];
    const category = filterCategories.find(c => c.name === selectedCategory);
    return category ? category.groups : [];
  }, [selectedCategory]);

  const availableSubcategories = React.useMemo(() => {
    if (!selectedGroup) return [];
    const group = availableGroups.find(g => g.name === selectedGroup);
    return group ? group.subcategories : [];
  }, [selectedGroup, availableGroups]);


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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
                Upload images for your product. Drag and drop to reorder.
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
               <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div className="relative group">
                      <Image src="https://placehold.co/150x150.png" alt="Product Image" width={150} height={150} className="rounded-md aspect-square object-cover" data-ai-hint="fashion product" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full">&times;</Button>
                      </div>
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
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="product-brand">Brand</Label>
                <Input id="product-brand" placeholder="e.g. Averzo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input id="product-sku" placeholder="TSHIRT-BLK-L" />
              </div>
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
                <Label htmlFor="product-stock">Stock Quantity</Label>
                <Input id="product-stock" type="number" placeholder="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-availability">Availability</Label>
                <Select defaultValue="in-stock">
                  <SelectTrigger id="product-availability">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>Add product attributes like size, color, material, etc.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {specifications.map((spec, index) => (
                          <div key={index} className="flex items-end gap-4">
                              <div className="flex-1 space-y-2">
                                  <Label htmlFor={`spec-label-${index}`}>Label</Label>
                                  <Input id={`spec-label-${index}`} placeholder="e.g. Color" value={spec.label} onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)} />
                              </div>
                              <div className="flex-1 space-y-2">
                                  <Label htmlFor={`spec-value-${index}`}>Value</Label>
                                  <Input id={`spec-value-${index}`} placeholder="e.g. Black" value={spec.value} onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)} />
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveSpecification(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                          </div>
                      ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleAddSpecification}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Specification
                  </Button>
              </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
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
                <Label>Category</Label>
                <Select onValueChange={(value) => { setSelectedCategory(value); setSelectedGroup(''); }}>
                  <SelectTrigger><SelectValue placeholder="Select mother category" /></SelectTrigger>
                  <SelectContent>
                    {filterCategories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {selectedCategory && (
                <div className="space-y-2">
                  <Label>Group</Label>
                  <Select onValueChange={setSelectedGroup} value={selectedGroup}>
                    <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                    <SelectContent>
                      {availableGroups.map(g => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
               {selectedGroup && (
                <div className="space-y-2">
                  <Label>Sub-category</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
