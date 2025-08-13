
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
import { UploadCloud, ChevronLeft, PlusCircle, Trash2, Link as LinkIcon, Gift } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import React, { useState, useMemo, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { app, db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/use-auth';
import { Checkbox } from '@/components/ui/checkbox';

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

interface ImageObject {
    file?: File;
    url: string;
}

export default function NewVendorProductPage() {
    const storage = getStorage(app);
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    // Product Details
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [vendor, setVendor] = useState('');
    
    // Media
    const [images, setImages] = useState<ImageObject[]>([]);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    
    // Variants
    const [colors, setColors] = useState([{ name: '', hex: '#000000' }]);
    const [sizes, setSizes] = useState(['']);

    // Specifications
    const [specifications, setSpecifications] = useState([{ label: '', value: '' }]);

    // Offers & Policies
    const [offers, setOffers] = useState('');
    const [returnPolicy, setReturnPolicy] = useState('');
    const [isGiftEnabled, setIsGiftEnabled] = useState(false);
    const [giftDescription, setGiftDescription] = useState('');

    // Organization
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

    // Pricing & Inventory
    const [price, setPrice] = useState('');
    const [comparePrice, setComparePrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [tax, setTax] = useState('');
    const [sku, setSku] = useState('');
    const [stock, setStock] = useState('');
    const [availability, setAvailability] = useState('in-stock');

    // Shipping
    const [courierEnabled, setCourierEnabled] = useState(false);
    const [courierFee, setCourierFee] = useState('');
    const [expressEnabled, setExpressEnabled] = useState(false);
    const [expressFee, setExpressFee] = useState('');
    const [estimatedDelivery, setEstimatedDelivery] = useState('');
    
    // Dynamic Categories
    const [filterCategories, setFilterCategories] = React.useState(initialFilterCategories);
    const [newGroupName, setNewGroupName] = React.useState('');
    const [newSubcategoryName, setNewSubcategoryName] = React.useState('');

    useEffect(() => {
        if(user) {
            setVendor(user.fullName);
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        const imageObjects = filesArray.map(file => ({
            file: file,
            url: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...imageObjects]);
      }
    };
    
    const handleAddImageUrl = () => {
        if (imageUrlInput && imageUrlInput.startsWith('http')) {
            setImages(prev => [...prev, { url: imageUrlInput }]);
            setImageUrlInput('');
        } else {
            toast({
                title: 'Invalid URL',
                description: 'Please enter a valid image URL (starting with http).',
                variant: 'destructive',
            })
        }
    }

    const handleRemoveImage = (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index));
    };
    
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

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag) {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag('');
        }
    };
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
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

    const availableGroups = useMemo(() => {
        if (!selectedCategory) return [];
        return filterCategories.find(c => c.name === selectedCategory)?.groups || [];
    }, [selectedCategory, filterCategories]);

    const availableSubcategories = useMemo(() => {
        if (!selectedGroup) return [];
        return availableGroups.find(g => g.name === selectedGroup)?.subcategories || [];
    }, [selectedGroup, availableGroups]);

    const handleSaveProduct = async () => {
        setIsLoading(true);
        try {
            const imageUrls = await Promise.all(
                images.map(async (imageObj) => {
                    if (imageObj.file) {
                        const storageRef = ref(storage, `products/${Date.now()}-${imageObj.file.name}`);
                        await uploadBytes(storageRef, imageObj.file);
                        return await getDownloadURL(storageRef);
                    }
                    return imageObj.url;
                })
            );

            const productData = {
                name: productName,
                description,
                brand,
                vendor,
                images: imageUrls,
                videoUrl,
                variants: {
                    colors: colors.filter(c => c.name),
                    sizes: sizes.filter(s => s),
                },
                specifications: specifications.filter(s => s.label && s.value),
                offers,
                returnPolicy,
                giftWithPurchase: {
                    enabled: isGiftEnabled,
                    description: giftDescription
                },
                organization: {
                    status: 'pending-approval', // Default status for new products
                    category: selectedCategory,
                    group: selectedGroup,
                    subcategory: selectedSubcategory,
                    tags,
                },
                pricing: {
                    price: parseFloat(price) || 0,
                    comparePrice: parseFloat(comparePrice) || 0,
                    discount: parseFloat(discount) || 0,
                    tax: parseFloat(tax) || 0,
                },
                inventory: {
                    sku,
                    stock: parseInt(stock, 10) || 0,
                    availability,
                },
                shipping: {
                    courier: {
                        enabled: courierEnabled,
                        fee: parseFloat(courierFee) || 0,
                    },
                    express: {
                        enabled: expressEnabled,
                        fee: parseFloat(expressFee) || 0,
                    },
                    estimatedDelivery,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'products'), productData);

            toast({
                title: 'Product Submitted!',
                description: 'Your product has been submitted for approval.',
            });
            router.push('/vendor/products');

        } catch (error: any) {
            console.error('Error saving product:', error);
            toast({
                title: 'Error Saving Product',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/vendor/products">
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
                <Input id="product-name" placeholder="e.g. Stylish T-Shirt" value={productName} onChange={e => setProductName(e.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea id="product-description" placeholder="Provide a detailed description of the product..." value={description} onChange={e => setDescription(e.target.value)} disabled={isLoading} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="product-brand">Brand</Label>
                <Input id="product-brand" placeholder="e.g. Averzo" value={brand} onChange={e => setBrand(e.target.value)} disabled={isLoading} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="product-vendor">Sold By</Label>
                <Input id="product-vendor" value={vendor} disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Upload images and video for your product. The first image will be the main one.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="upload">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><UploadCloud className="mr-2 h-4 w-4"/> Upload Files</TabsTrigger>
                        <TabsTrigger value="url"><LinkIcon className="mr-2 h-4 w-4"/> Add from URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                        <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center mt-4">
                            <input type="file" id="image-upload" multiple onChange={handleFileChange} className="hidden" disabled={isLoading}/>
                            <Label htmlFor="image-upload" className="cursor-pointer">
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-sm text-muted-foreground">
                                Drag and drop your images here, or{' '}
                                <span className="font-semibold text-primary">click to browse</span>
                                </p>
                            </Label>
                        </div>
                    </TabsContent>
                    <TabsContent value="url">
                        <div className="flex gap-2 mt-4">
                            <Input 
                                placeholder="https://example.com/image.png" 
                                value={imageUrlInput} 
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button onClick={handleAddImageUrl} disabled={isLoading}>Add Image</Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-4">
                    <Label>Image Previews</Label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <Image src={image.url} alt={`Product Image ${index + 1}`} width={150} height={150} className="rounded-md aspect-square object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleRemoveImage(index)} disabled={isLoading}><Trash2 className="w-4 h-4"/></Button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="product-video">YouTube Video URL</Label>
                <Input id="product-video" placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} disabled={isLoading} />
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
                                    <Input id={`color-name-${index}`} placeholder="e.g. Midnight Black" value={color.name} onChange={(e) => handleColorChange(index, 'name', e.target.value)} disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`color-hex-${index}`} className="text-xs">Hex</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id={`color-hex-${index}`} className="w-24" placeholder="#000000" value={color.hex} onChange={(e) => handleColorChange(index, 'hex', e.target.value)} disabled={isLoading} />
                                        <Input type="color" value={color.hex} onChange={(e) => handleColorChange(index, 'hex', e.target.value)} className="w-10 h-10 p-1" disabled={isLoading} />
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveColor(index)} disabled={isLoading}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4" onClick={handleAddColor} disabled={isLoading}>
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
                                    <Input id={`size-value-${index}`} placeholder="e.g. Medium or 42" value={size} onChange={(e) => handleSizeChange(index, e.target.value)} disabled={isLoading}/>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveSize(index)} disabled={isLoading}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <Button variant="outline" size="sm" className="mt-4" onClick={handleAddSize} disabled={isLoading}>
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
                                  <Input id={`spec-label-${index}`} placeholder="e.g. Fabric" value={spec.label} onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)} disabled={isLoading}/>
                              </div>
                              <div className="flex-1 space-y-2">
                                  <Label htmlFor={`spec-value-${index}`}>Value</Label>
                                  <Input id={`spec-value-${index}`} placeholder="e.g. Polyester" value={spec.value} onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)} disabled={isLoading}/>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveSpecification(index)} disabled={isLoading}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                          </div>
                      ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleAddSpecification} disabled={isLoading}>
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
                    <Textarea id="product-offers" placeholder="Enter each offer on a new line... e.g. 10% off on HDFC Bank cards" value={offers} onChange={e => setOffers(e.target.value)} disabled={isLoading}/>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="product-return-policy">Return Policy</Label>
                    <Textarea id="product-return-policy" placeholder="e.g. Easy 7 days returns and exchanges." value={returnPolicy} onChange={e => setReturnPolicy(e.target.value)} disabled={isLoading}/>
                  </div>
                  <div className="space-y-2 border-t pt-4">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="gift-with-purchase" className="flex items-center gap-2 font-semibold">
                            <Gift className="w-5 h-5 text-primary" /> Gift with Purchase
                        </Label>
                        <Switch id="gift-with-purchase" checked={isGiftEnabled} onCheckedChange={setIsGiftEnabled} disabled={isLoading} />
                     </div>
                     <p className="text-xs text-muted-foreground">Enable this to offer a free gift with this product.</p>
                     {isGiftEnabled && (
                        <div className="pt-2">
                             <Label htmlFor="gift-description">Gift Description</Label>
                             <Input id="gift-description" placeholder="e.g. Free Key-ring" value={giftDescription} onChange={e => setGiftDescription(e.target.value)} disabled={isLoading} />
                        </div>
                     )}
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
                    <Label>Category</Label>
                    <Select onValueChange={(value) => { setSelectedCategory(value); setSelectedGroup(''); setSelectedSubcategory(''); }} value={selectedCategory} disabled={isLoading}>
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
                                <Button variant="ghost" size="sm" disabled={!selectedCategory || isLoading}>
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
                      <Select onValueChange={value => { setSelectedGroup(value); setSelectedSubcategory(''); }} value={selectedGroup} disabled={isLoading}>
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
                                 <Button variant="ghost" size="sm" disabled={!selectedGroup || isLoading}>
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
                      <Select onValueChange={setSelectedSubcategory} value={selectedSubcategory} disabled={isLoading}>
                        <SelectTrigger><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                        <SelectContent>
                          {availableSubcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                      <Label htmlFor="product-tags">Tags</Label>
                      <Input 
                        id="product-tags" 
                        placeholder="e.g. summer, cotton, casual (press Enter)"
                        value={currentTag}
                        onChange={e => setCurrentTag(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        disabled={isLoading}
                      />
                      <div className="flex flex-wrap gap-2 pt-2">
                          {tags.map(tag => (
                            <Badge key={tag} variant="secondary">
                                {tag} 
                                <button className='ml-1 text-xs' onClick={() => handleRemoveTag(tag)}>&times;</button>
                            </Badge>
                          ))}
                      </div>
                  </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Pricing & Inventory</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="product-price">Price (৳)</Label>
                        <Input id="product-price" type="number" placeholder="1299" value={price} onChange={e => setPrice(e.target.value)} disabled={isLoading}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-compare-price">Compare-at Price (MRP ৳)</Label>
                        <Input id="product-compare-price" type="number" placeholder="1999" value={comparePrice} onChange={e => setComparePrice(e.target.value)} disabled={isLoading}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="product-discount">Discount (%)</Label>
                        <Input id="product-discount" type="number" placeholder="10" value={discount} onChange={e => setDiscount(e.target.value)} disabled={isLoading}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="product-tax">Taxes (%)</Label>
                        <Input id="product-tax" type="number" placeholder="5" value={tax} onChange={e => setTax(e.target.value)} disabled={isLoading}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-sku">SKU</Label>
                        <Input id="product-sku" placeholder="TSHIRT-BLK-L" value={sku} onChange={e => setSku(e.target.value)} disabled={isLoading}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-stock">Stock Quantity</Label>
                        <Input id="product-stock" type="number" placeholder="100" value={stock} onChange={e => setStock(e.target.value)} disabled={isLoading}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-availability">Availability</Label>
                        <Select defaultValue="in-stock" onValueChange={setAvailability} value={availability} disabled={isLoading}>
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
                     <div className="flex items-center space-x-2">
                        <Checkbox id="courier" checked={courierEnabled} onCheckedChange={(checked) => setCourierEnabled(checked as boolean)} />
                        <label htmlFor="courier" className="text-sm font-medium leading-none">Enable Courier</label>
                    </div>
                    {courierEnabled && (
                        <div className="space-y-2 pl-6">
                            <Label htmlFor="courier-fee">Courier Fee (৳)</Label>
                            <Input id="courier-fee" type="number" placeholder="60" value={courierFee} onChange={e => setCourierFee(e.target.value)} disabled={isLoading}/>
                        </div>
                    )}
                     <div className="flex items-center space-x-2">
                        <Checkbox id="express" checked={expressEnabled} onCheckedChange={(checked) => setExpressEnabled(checked as boolean)} />
                        <label htmlFor="express" className="text-sm font-medium leading-none">Enable Express Delivery</label>
                    </div>
                    {expressEnabled && (
                        <div className="space-y-2 pl-6">
                            <Label htmlFor="express-fee">Express Fee (৳)</Label>
                            <Input id="express-fee" type="number" placeholder="120" value={expressFee} onChange={e => setExpressFee(e.target.value)} disabled={isLoading}/>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="estimated-delivery">Estimated Delivery Time</Label>
                        <Input id="estimated-delivery" placeholder="e.g. 2-3 days" value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} disabled={isLoading}/>
                    </div>
                </CardContent>
            </Card>

           <div className="flex justify-end gap-2">
                <Button variant="outline" disabled={isLoading}>Discard</Button>
                <Button onClick={handleSaveProduct} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Submit for Approval'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

