
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Camera, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface OrderItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    sku: string;
}

interface Order {
    id: string;
    items: OrderItem[];
}

interface ReturnItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    reason: string;
    comment: string;
    photoUrl?: string;
}

function NewReturnRequestContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const { toast } = useToast();
    const { user } = useAuth();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({});
    const [itemDetails, setItemDetails] = useState<{[key: string]: {reason: string, comment: string, imageFile?: File, photoUrl?: string}}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                setLoading(true);
                const orderRef = doc(db, 'orders', orderId);
                const docSnap = await getDoc(orderRef);
                if (docSnap.exists()) {
                    setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
                } else {
                    toast({ title: "Error", description: "Order not found.", variant: "destructive" });
                    router.push('/profile/orders');
                }
                setLoading(false);
            }
            fetchOrder();
        }
    }, [orderId, toast, router]);

    const handleItemSelect = (itemId: string, checked: boolean) => {
        setSelectedItems(prev => ({...prev, [itemId]: checked}));
        if (!checked) {
            // Also remove details if unchecked
            const newItemDetails = {...itemDetails};
            delete newItemDetails[itemId];
            setItemDetails(newItemDetails);
        } else {
            setItemDetails(prev => ({...prev, [itemId]: { reason: '', comment: '' }}));
        }
    }

    const handleDetailChange = (itemId: string, field: 'reason' | 'comment', value: string) => {
        setItemDetails(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], [field]: value }
        }));
    }

    const handleImageChange = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setItemDetails(prev => ({
                ...prev,
                [itemId]: { ...prev[itemId], imageFile: e.target.files![0] }
            }));
        }
    }

    const handleSubmitRequest = async () => {
        if (!user || !order) return;
        
        const itemsToReturn = Object.keys(selectedItems).filter(id => selectedItems[id]);
        if (itemsToReturn.length === 0) {
            toast({ title: "No items selected", description: "Please select at least one item to return.", variant: "destructive" });
            return;
        }

        for (const itemId of itemsToReturn) {
            if (!itemDetails[itemId]?.reason) {
                toast({ title: "Reason required", description: `Please select a reason for returning "${order.items.find(i=>i.id===itemId)?.name}".`, variant: "destructive" });
                return;
            }
        }
        
        setIsSubmitting(true);
        try {
            const storage = getStorage(app);
            const returnItems: ReturnItem[] = [];

            for (const itemId of itemsToReturn) {
                const itemData = order.items.find(i => i.id === itemId);
                if (!itemData) continue;
                
                let photoUrl = '';
                const imageFile = itemDetails[itemId]?.imageFile;
                if (imageFile) {
                    const storageRef = ref(storage, `return_requests/${orderId}/${Date.now()}-${imageFile.name}`);
                    await uploadBytes(storageRef, imageFile);
                    photoUrl = await getDownloadURL(storageRef);
                }

                returnItems.push({
                    id: itemData.id,
                    name: itemData.name,
                    image: itemData.image,
                    quantity: itemData.quantity, // Assuming returning all quantity for simplicity
                    reason: itemDetails[itemId].reason,
                    comment: itemDetails[itemId].comment,
                    photoUrl: photoUrl,
                });
            }

            await addDoc(collection(db, 'returns'), {
                orderId: order.id,
                userId: user.uid,
                userName: user.fullName,
                items: returnItems,
                status: 'Pending',
                createdAt: serverTimestamp(),
            });

            toast({ title: "Return Request Submitted", description: "Your request has been sent for review." });
            router.push('/profile/orders');

        } catch (error) {
            console.error("Error submitting return request:", error);
            toast({ title: "Submission Failed", description: "Could not submit your return request.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) return <p className="p-8 text-center">Loading order details...</p>;
    if (!order) return null;

    return (
        <div className="space-y-8">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                <Link href="/profile/orders">
                    <ChevronLeft className="h-4 w-4" />
                </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Request a Return</h1>
                    <p className="text-muted-foreground text-sm">For order #{order.id.substring(0, 7)}...</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Items to Return</CardTitle>
                    <CardDescription>Choose the products you want to send back.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {order.items.map(item => (
                        <div key={item.id} className="space-y-4 border p-4 rounded-lg">
                           <div className="flex items-start gap-4">
                                <Checkbox 
                                    id={`item-${item.id}`} 
                                    onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex gap-4">
                                        <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" />
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {selectedItems[item.id] && (
                                <div className="pl-8 space-y-4 animate-in fade-in-50 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Reason for return</Label>
                                            <Select value={itemDetails[item.id]?.reason || ''} onValueChange={(value) => handleDetailChange(item.id, 'reason', value)}>
                                                <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="wrong-size">Wrong Size/Fit</SelectItem>
                                                    <SelectItem value="damaged">Damaged Product</SelectItem>
                                                    <SelectItem value="wrong-item">Received Wrong Item</SelectItem>
                                                    <SelectItem value="not-as-described">Not as Described</SelectItem>
                                                    <SelectItem value="changed-mind">Changed My Mind</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div>
                                            <Label>Upload Photo (Optional)</Label>
                                            <div className="flex items-center gap-2">
                                                {itemDetails[item.id]?.imageFile && <Image src={URL.createObjectURL(itemDetails[item.id]!.imageFile!)} alt="preview" width={40} height={40} className="rounded-md" />}
                                                <Input type="file" onChange={(e) => handleImageChange(item.id, e)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Comments (Optional)</Label>
                                        <Textarea placeholder="Tell us more about the issue..." value={itemDetails[item.id]?.comment || ''} onChange={(e) => handleDetailChange(item.id, 'comment', e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmitRequest} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function NewReturnRequestPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
             <main className="flex-grow container mx-auto px-4 py-8">
                 <Suspense fallback={<p>Loading...</p>}>
                    <NewReturnRequestContent />
                 </Suspense>
             </main>
        </div>
    )
}
