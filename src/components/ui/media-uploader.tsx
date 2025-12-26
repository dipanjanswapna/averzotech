import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUploadMedia } from '@/hooks/use-upload-media';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

interface MediaUploaderProps {
  onUploadComplete?: (url: string) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  uploadPath?: string;
  aspectRatio?: string;
  className?: string;
  preview?: boolean;
}

export function MediaUploader({
  onUploadComplete,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
  uploadPath = 'uploads',
  aspectRatio = '16/9',
  className = '',
  preview = true,
}: MediaUploaderProps) {
  const { uploadFile, validateFile, progress, downloadUrl, isUploading } = useUploadMedia();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      validateFile(file, { maxSizeMB, allowedTypes });

      // Create preview URL
      if (preview) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }

      // Upload file
      const url = await uploadFile(file, uploadPath);
      
      // Notify success
      toast({
        title: "Upload Complete",
        description: "Your media has been uploaded successfully.",
      });

      // Call callback
      onUploadComplete?.(url);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [uploadFile, validateFile, maxSizeMB, allowedTypes, uploadPath, preview, onUploadComplete, toast]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className="relative border-2 border-dashed rounded-lg p-4 text-center hover:border-primary cursor-pointer"
        style={{ aspectRatio }}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
          disabled={isUploading}
        />
        
        {/* Preview */}
        {preview && (previewUrl || downloadUrl) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {(previewUrl || downloadUrl)?.startsWith('data:video') || (previewUrl || downloadUrl)?.endsWith('.mp4') ? (
              <video
                src={previewUrl || downloadUrl || ''}
                className="max-w-full max-h-full object-contain"
                controls
              />
            ) : (
              <Image
                src={previewUrl || downloadUrl || ''}
                alt="Preview"
                fill
                className="object-contain"
              />
            )}
          </div>
        )}

        {/* Upload UI */}
        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading... {progress.toFixed(0)}%</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag &amp; drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: {maxSizeMB}MB
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: {allowedTypes.map(type => type.split('/')[1]).join(', ')}
              </p>
            </>
          )}
        </div>
      </div>

      {downloadUrl && onUploadComplete && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onUploadComplete(downloadUrl)}
        >
          Use This Media
        </Button>
      )}
    </div>
  );
}