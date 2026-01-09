

'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function EstimatedDeliveryChecker() {
    const [pincode, setPincode] = useState('');
    const [estimatedDate, setEstimatedDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleCheckDelivery = async () => {
        if (!/^\d{4}$/.test(pincode)) {
            setError('Please enter a valid 4-digit pin code.');
            setEstimatedDate(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setEstimatedDate(null);

        try {
            const response = await fetch('/api/delivery-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pincode })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Could not fetch delivery information.');
            }
            
            const data = await response.json();
            
            const deliveryDays = parseInt(data.time, 10);
            const today = new Date();
            const deliveryDate = new Date(today.setDate(today.getDate() + deliveryDays));
            
            const formattedDate = deliveryDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
            });

            setEstimatedDate(`Estimated Delivery: ${formattedDate} (${data.area})`);

        } catch (err: any) {
            setError(err.message);
            toast({
                title: "Delivery Check Failed",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2">
                <Input 
                    type="number"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={4}
                    className="max-w-[150px]"
                />
                <Button onClick={handleCheckDelivery} disabled={isLoading || !pincode}>
                    {isLoading ? 'Checking...' : 'Check'}
                </Button>
            </div>
            { (error || estimatedDate) && (
                 <div className={cn("mt-2 text-sm transition-opacity duration-500 opacity-100")}>
                    {error ? (
                        <p className="text-destructive font-semibold">{error}</p>
                    ) : estimatedDate && (
                         <p className="font-semibold text-primary flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            {estimatedDate}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
