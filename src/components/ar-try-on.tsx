'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Draggable from 'react-draggable';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ArTryOnProps {
  productImage: string;
  productName: string;
}

export function ArTryOn({ productImage, productName }: ArTryOnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            toast({
                variant: 'destructive',
                title: 'Camera Not Supported',
                description: 'Your browser does not support camera access.',
            });
            setHasCameraPermission(false);
            return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      };

      getCameraPermission();

      return () => {
        // Stop camera stream when component unmounts or dialog closes
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [isOpen, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="flex-1">
          <Camera className="mr-2 h-5 w-5" />
          AR Try On
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Virtual Try-On: {productName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 relative overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" autoPlay muted playsInline />

            {!hasCameraPermission && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Alert variant="destructive" className="m-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser to use this feature. You might need to refresh the page after granting permission.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            
            {hasCameraPermission && (
                 <Draggable bounds="parent">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-move w-48 h-48">
                        <Image
                            src={productImage}
                            alt={productName}
                            width={192}
                            height={192}
                            className="object-contain pointer-events-none"
                        />
                    </div>
                </Draggable>
            )}
        </div>
         <DialogClose asChild>
            <Button variant="outline" className="m-4">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
