import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebase';

type UploadProgress = {
  progress: number;
  downloadUrl: string | null;
};

export const useUploadMedia = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    progress: 0,
    downloadUrl: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    file: File,
    path: string = 'uploads'
  ): Promise<string> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const storage = getStorage(app);
      const timestamp = Date.now();
      const fileName = `${path}/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress({
              progress,
              downloadUrl: null,
            });
          },
          (error) => {
            // Handle errors
            setError(error.message);
            setIsUploading(false);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setProgress({
              progress: 100,
              downloadUrl,
            });
            setIsUploading(false);
            resolve(downloadUrl);
          }
        );
      });
    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
      throw err;
    }
  };

  const validateFile = (file: File, options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}) => {
    const { maxSizeMB = 5, allowedTypes = [] } = options;

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File size should not exceed ${maxSizeMB}MB`);
    }

    // Check file type if specified
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`);
    }

    return true;
  };

  return {
    uploadFile,
    validateFile,
    progress: progress.progress,
    downloadUrl: progress.downloadUrl,
    error,
    isUploading,
  };
};