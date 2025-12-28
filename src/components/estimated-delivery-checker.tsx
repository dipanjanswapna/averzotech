
'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const bengaliDays: { [key: string]: string } = {
  Sunday: 'রবিবার',
  Monday: 'সোমবার',
  Tuesday: 'মঙ্গলবার',
  Wednesday: 'বুধবার',
  Thursday: 'বৃহস্পতিবার',
  Friday: 'শুক্রবার',
  Saturday: 'শনিবার',
};

const bengaliMonths: { [key: string]: string } = {
  January: 'জানুয়ারী',
  February: 'ফেব্রুয়ারী',
  March: 'মার্চ',
  April: 'এপ্রিল',
  May: 'মে',
  June: 'জুন',
  July: 'জুলাই',
  August: 'আগস্ট',
  September: 'সেপ্টেম্বর',
  October: 'অক্টোবর',
  November: 'নভেম্বর',
  December: 'ডিসেম্বর',
};

const getBengaliDate = (date: Date): string => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();

    return `${bengaliDays[dayName]}, ${day} ${bengaliMonths[monthName]}`;
};


export function EstimatedDeliveryChecker() {
    const [pincode, setPincode] = useState('');
    const [estimatedDate, setEstimatedDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleCheckDelivery = () => {
        if (!/^\d{4}$/.test(pincode)) {
            setError('Please enter a valid 4-digit pin code.');
            setEstimatedDate(null);
            setShowResult(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        setShowResult(false);

        setTimeout(() => {
            const deliveryDays = (parseInt(pincode) >= 1200 && parseInt(pincode) <= 1399) ? 2 : 4;
            const today = new Date();
            const deliveryDate = new Date(today.setDate(today.getDate() + deliveryDays));
            
            setEstimatedDate(getBengaliDate(deliveryDate));
            setIsLoading(false);
            setShowResult(true);
        }, 500);
    };

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2">
                <Input 
                    type="text"
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
            {showResult && (
                 <div className={cn("mt-2 text-sm transition-opacity duration-500", showResult ? "opacity-100" : "opacity-0")}>
                    {error ? (
                        <p className="text-destructive font-semibold">{error}</p>
                    ) : estimatedDate && (
                         <p className="font-semibold text-primary flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            সম্ভাব্য ডেলিভারি: {estimatedDate}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
