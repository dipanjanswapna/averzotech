
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface SizeChartDialogProps {
  children: React.ReactNode;
  sizeChartUrl: string;
}

export function SizeChartDialog({ children, sizeChartUrl }: SizeChartDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Chart</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Image
            src={sizeChartUrl || "https://placehold.co/800x600.png"}
            alt="Size Chart"
            width={800}
            height={600}
            className="w-full h-auto"
            data-ai-hint="size chart"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
