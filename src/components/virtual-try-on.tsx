
'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Check, RefreshCcw, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { tryOnProduct } from '@/ai/flows/virtual-try-on-flow';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

interface VirtualTryOnProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productImage: string;
  productName: string;
}

export function VirtualTryOn({
  isOpen,
  onOpenChange,
  productImage,
  productName,
}: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function getCameraPermission() {
      if (!isOpen || hasCameraPermission) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    }
    getCameraPermission();

    // Cleanup function to stop video stream when component unmounts or dialog closes
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [isOpen, hasCameraPermission, toast]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
      }
    }
  }, [videoRef, canvasRef]);
  
  const handleGenerate = async () => {
    if (!capturedImage) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
        const result = await tryOnProduct({
            userImage: capturedImage,
            productImage: productImage,
        });
        setGeneratedImage(result);
    } catch(e) {
        console.error(e);
        toast({
            title: "AI Generation Failed",
            description: "Could not generate the try-on image. Please try again.",
            variant: "destructive"
        })
    } finally {
        setIsGenerating(false);
    }
  }

  const reset = () => {
    setCapturedImage(null);
    setGeneratedImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Virtual Try-On: {productName}</DialogTitle>
          <DialogDescription>
            See how this product looks on you! Position yourself in the frame and
            capture a photo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Left side: Camera or Captured/Generated Image */}
            <div className="relative aspect-square w-full bg-secondary rounded-lg overflow-hidden">
                {generatedImage ? (
                    <Image src={generatedImage} alt="Generated try-on" layout="fill" objectFit="contain" />
                ) : capturedImage ? (
                     <Image src={capturedImage} alt="Your snapshot" layout="fill" objectFit="contain" />
                ) : (
                    <>
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                         <canvas ref={canvasRef} className="hidden" />
                    </>
                )}
                 {isGenerating && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <Sparkles className="w-12 h-12 animate-pulse mb-4" />
                        <p className="font-semibold text-lg">AI is working its magic...</p>
                        <p className="text-sm">This may take a moment.</p>
                    </div>
                 )}
            </div>

            {/* Right side: Product and Controls */}
            <div className="flex flex-col gap-4">
                 <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                    <Image src={productImage} alt={productName} layout="fill" objectFit="contain" />
                 </div>
                 {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser to use this feature.
                        </AlertDescription>
                    </Alert>
                 )}
                 <div className="flex gap-2">
                    {!capturedImage && (
                        <Button className="w-full" onClick={handleCapture} disabled={!hasCameraPermission}>
                            <Camera className="mr-2 h-4 w-4" /> Capture Photo
                        </Button>
                    )}
                    {capturedImage && !generatedImage && (
                        <>
                             <Button className="w-full" onClick={reset} variant="outline">
                                <RefreshCcw className="mr-2 h-4 w-4" /> Retake
                            </Button>
                            <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                                <Sparkles className="mr-2 h-4 w-4" /> Generate Try-On
                            </Button>
                        </>
                    )}
                     {generatedImage && (
                        <Button className="w-full" onClick={reset} variant="secondary">
                            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                    )}
                 </div>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            <Check className="mr-2 h-4 w-4" /> Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
