import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export const useImageUpload = () => {
  const [imageUploadPercent, setImageUploadPercent] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  const handleImageFileUpload = async (file) => {
    if (isImageUploading) return;

    setIsImageUploading(true);
    setImageUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    try {
      uploadTask.on('state_changed', (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadPercent(Math.round(progress));
      });

      await uploadTask;

      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

      // Clear upload progress after successful upload
      setImageUploadPercent(null);

      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageUploadPercent(null);
      setImageUploadError('Image upload failed. Please try again.');
    } finally {
      setIsImageUploading(false);
    }
  };

  return {
    handleImageFileUpload,
    imageUploadPercent,
    isImageUploading,
    imageUploadError,
    setImageUploadError,
  };
};
