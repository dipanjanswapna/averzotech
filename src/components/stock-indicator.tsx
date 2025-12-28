
'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface StockIndicatorProps {
  stock: number;
  initialStock?: number;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order';
}

export function StockIndicator({ stock, initialStock = 50, availability }: StockIndicatorProps) {
  if (availability === 'pre-order') {
    return <Badge className="bg-blue-100 text-blue-800">Available for Pre-order</Badge>;
  }

  if (stock <= 0 || availability === 'out-of-stock') {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }

  const stockPercentage = (stock / initialStock) * 100;
  let text = 'In Stock';
  let textColor = 'text-green-600';
  let progressColor = 'bg-green-500';
  let pulse = false;

  if (stock < 10) {
    text = `Low Stock`;
    textColor = 'text-orange-500';
    progressColor = 'bg-orange-500';
  }

  if (stock < 5) {
    text = `Hurry! Only ${stock} left!`;
    textColor = 'text-red-600';
    progressColor = 'bg-red-500';
    pulse = true;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className={cn("text-sm font-semibold", textColor, pulse && "animate-pulse")}>
          {text}
        </p>
      </div>
      <Progress value={stockPercentage} className="h-2" progressClassName={progressColor} />
    </div>
  );
}
