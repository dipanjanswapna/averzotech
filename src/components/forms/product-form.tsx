import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MediaUploader } from '@/components/ui/media-uploader';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    images: initialData?.images || [],
    video: initialData?.video || '',
  });
  const { toast } = useToast();

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const handleVideoUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      video: url
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one product image",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label>Product Images</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.images.map((url: string, index: number) => (
              <Card key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index)
                  }))}
                >
                  Remove
                </Button>
              </Card>
            ))}
            {formData.images.length < 5 && (
              <MediaUploader
                onUploadComplete={handleImageUpload}
                maxSizeMB={2}
                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                uploadPath="products/images"
                aspectRatio="1"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Upload up to 5 product images (required)
          </p>
        </div>

        <div>
          <Label>Product Video</Label>
          {formData.video ? (
            <Card className="relative aspect-video">
              <video
                src={formData.video}
                controls
                className="w-full h-full rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setFormData(prev => ({ ...prev, video: '' }))}
              >
                Remove
              </Button>
            </Card>
          ) : (
            <MediaUploader
              onUploadComplete={handleVideoUpload}
              maxSizeMB={10}
              allowedTypes={['video/mp4']}
              uploadPath="products/videos"
              aspectRatio="16/9"
            />
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Upload a product video (optional, max 10MB)
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
}