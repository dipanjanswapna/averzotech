
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
} from "@/components/ui/alert-dialog"

const initialFilterCategories = [
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
  const [colors, setColors] = React.useState([{ name: '', hex: '#000000' }]);
  const [sizes, setSizes] = React.useState(['']);
  
  const [filterCategories, setFilterCategories] = React.useState(initialFilterCategories);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState('');
  
  const [newGroupName, setNewGroupName] = React.useState('');
  const [newSubcategoryName, setNewSubcategoryName] = React.useState('');


  const handleAddSpecification = () => setSpecifications([...specifications, { label: '', value: '' }]);
  const handleRemoveSpecification = (index: number) => setSpecifications(specifications.filter((_, i) => i !== index));
  const handleSpecificationChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };
  
  const handleAddColor = () => setColors([...colors, { name: '', hex: '#000000' }]);
  const handleRemoveColor = (index: number) => setColors(colors.filter((_, i) => i !== index));
  const handleColorChange = (index: number, field: 'name' | 'hex', value: string) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const handleAddSize = () => setSizes([...sizes, '']);
  const handleRemoveSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));
  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };
  

  const handleAddNewGroup = () => {
    if (newGroupName && selectedCategory) {
      setFilterCategories(prevCategories => {
        return prevCategories.map(cat => {
          if (cat.name === selectedCategory) {
            if (cat.groups.some(g => g.name.toLowerCase() === newGroupName.toLowerCase())) return cat;
            return { ...cat, groups: [...cat.groups, { name: newGroupName, subcategories: [] }] };
          }
          return cat;
        });
      });
      setSelectedGroup(newGroupName);
      setNewGroupName('');
    }
  };

  const handleAddNewSubcategory = () => {
    if (newSubcategoryName && selectedCategory && selectedGroup) {
      setFilterCategories(prevCategories => {
        return prevCategories.map(cat => {
          if (cat.name === selectedCategory) {
            return {
              ...cat,
              groups: cat.groups.map(group => {
                if (group.name === selectedGroup) {
                   if (group.subcategories.some(s => s.toLowerCase() === newSubcategoryName.toLowerCase())) return group;
                  return { ...group, subcategories: [...group.subcategories, newSubcategoryName] };
                }
                return group;
              })
            };
          }
          return cat;
        });
      });
      setNewSubcategoryName('');
    }
  };

  const availableGroups = React.useMemo(() => {
    if (!selectedCategory) return [];
    return filterCategories.find(c => c.name === selectedCategory)?.groups || [];
  }, [selectedCategory, filterCategories]);

  const availableSubcategories = React.useMemo(() => {
    if (!selectedGroup) return [];
    return availableGroups.find(g => g.name === selectedGroup)?.subcategories || [];
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Provide the essential details for your new product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" placeholder="e.g. Stylish T-Shirt"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea id="product-description" placeholder="Provide a detailed description of the product..."/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="product-brand">Brand</Label>
                <Input id="product-brand" placeholder="e.g. Averzo" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="product-vendor">Sold By</Label>
                <Input id="product-vendor" placeholder="e.g. RetailNet" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Upload images for your product. The first image will be the main one.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Drag and drop your images here, or{' '}
                  <span className="font-semibold text-primary">click to browse</span>
                </p>
              </div>
               <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div className="relative group">
                      <Image src="https://placehold.co/150x150.png" alt="Product Image" width={150} height={150} className="rounded-md aspect-square object-cover" data-ai-hint="fashion product" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full"><Trash2 className="w-4 h-4"/></Button>
                      </div>
                  </div>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Add product variants like colors and sizes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="font-semibold">Colors</Label>
                    <div className="space-y-4 mt-2">
                        {colors.map((color, index) => (
                            <div key={index} className="flex items-end gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor={`color-name-${index}`} className="text-xs">Color Name</Label>
                                    <Input id={`color-name-${index}`} placeholder="e.g. Midnight Black" value={color.name} onChange={(e) => handleColorChange(index, 'name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`color-hex-${index}`} className="text-xs">Hex</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id={`color-hex-${index}`} className="w-24" placeholder="#000000" value={color.hex} onChange={(e) => handleColorChange(index, 'hex', e.target.value)} />
                                        <Input type="color" value={color.hex} onChange={(e) => handleColorChange(index, 'hex', e.target.value)} className="w-10 h-10 p-1" />
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveColor(index)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4" onClick={handleAddColor}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Color
                    </Button>
                </div>
                <div className="border-t pt-6">
                     <Label className="font-semibold">Sizes</Label>
                     <div className="space-y-4 mt-2">
                        {sizes.map((size, index) => (
                            <div key={index} className="flex items-end gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor={`size-value-${index}`} className="text-xs">Size</Label>
                                    <Input id={`size-value-${index}`} placeholder="e.g. Medium or 42" value={size} onChange={(e) => handleSizeChange(index, e.target.value)} />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveSize(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <Button variant="outline" size="sm" className="mt-4" onClick={handleAddSize}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Size
                    </Button>
                </div>
            </CardContent>
          </Card>


          <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>Add other product attributes like material, fit, etc.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {specifications.map((spec, index) => (
                          <div key={index} className="flex items-end gap-4">
                              <div className="flex-1 space-y-2">
                                  <Label htmlFor={`spec-label-${index}`}>Label</Label>
                                  <Input id={`spec-label-${index}`} placeholder="e.g. Fabric" value={spec.label} onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)} />
                              </div>
                              <div className="flex-1 space-y-2">
                                  <Label htmlFor={`spec-value-${index}`}>Value</Label>
                                  <Input id={`spec-value-${index}`} placeholder="e.g. Polyester" value={spec.value} onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)} />
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

          <Card>
              <CardHeader>
                <CardTitle>Offers & Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-offers">Best Offers</Label>
                    <Textarea id="product-offers" placeholder="Enter each offer on a new line... e.g. 10% off on HDFC Bank cards" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="product-return-policy">Return Policy</Label>
                    <Textarea id="product-return-policy" placeholder="e.g. Easy 7 days returns and exchanges." />
                  </div>
              </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8 sticky top-8">
            <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-status">Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger id="product-status"><SelectValue placeholder="Select status" /></SelectTrigger>
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
                        <div className="flex justify-between items-center">
                            <Label>Group</Label>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" disabled={!selectedCategory}>
                                    <PlusCircle className="h-4 w-4 mr-1" /> Add New
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Add New Group</AlertDialogTitle>
                                  <AlertDialogDescription>Enter the name for the new group under "{selectedCategory}".</AlertDialogDescription>
                                </AlertDialogHeader>
                                <Input placeholder="e.g. Festive Wear" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleAddNewGroup}>Add Group</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
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
                       <div className="flex justify-between items-center">
                            <Label>Sub-category</Label>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button variant="ghost" size="sm" disabled={!selectedGroup}>
                                    <PlusCircle className="h-4 w-4 mr-1" /> Add New
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Add New Sub-category</AlertDialogTitle>
                                  <AlertDialogDescription>Enter the name for the new sub-category under "{selectedGroup}".</AlertDialogDescription>
                                </AlertDialogHeader>
                                <Input placeholder="e.g. Panjabis" value={newSubcategoryName} onChange={e => setNewSubcategoryName(e.target.value)} />
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleAddNewSubcategory}>Add Sub-category</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
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
            <Card>
                <CardHeader><CardTitle>Pricing & Inventory</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="product-price">Price (৳)</Label>
                        <Input id="product-price" type="number" placeholder="1299" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-compare-price">Compare-at Price (MRP ৳)</Label>
                        <Input id="product-compare-price" type="number" placeholder="1999"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="product-discount">Discount (%)</Label>
                        <Input id="product-discount" type="number" placeholder="10" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="product-tax">Taxes (%)</Label>
                        <Input id="product-tax" type="number" placeholder="5" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-sku">SKU</Label>
                        <Input id="product-sku" placeholder="TSHIRT-BLK-L" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-stock">Stock Quantity</Label>
                        <Input id="product-stock" type="number" placeholder="100" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-availability">Availability</Label>
                        <Select defaultValue="in-stock">
                            <SelectTrigger id="product-availability"><SelectValue placeholder="Select availability" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="in-stock">In Stock</SelectItem>
                                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="delivery-fee">Delivery Fee (৳)</Label>
                        <Input id="delivery-fee" type="number" placeholder="60" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estimated-delivery">Estimated Delivery Time</Label>
                        <Input id="estimated-delivery" placeholder="e.g. 2-3 days" />
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

    