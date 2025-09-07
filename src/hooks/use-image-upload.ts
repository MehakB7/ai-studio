import { useState } from "react";
import { resizeImage, fileToDataUrl } from "@/lib/image-utils";

interface UploadedImage {
  file: File;
  dataUrl: string;
  name: string;
  size: number;
}

export function useImageUpload() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.match(/^image\/(png|jpeg)$/)) {
      throw new Error("Only PNG and JPEG files are allowed");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Please upload an image smaller than 10MB");
    }

    setIsProcessing(true);

    try {
      let processedFile = file;
      if (file.size > 5 * 1024 * 1024) {
        processedFile = await resizeImage(file);
      }

      const dataUrl = await fileToDataUrl(processedFile);

      setUploadedImage({
        file: processedFile,
        dataUrl,
        name: file.name,
        size: processedFile.size,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  return {
    uploadedImage,
    isProcessing,
    handleFileUpload,
    removeImage,
  };
}
