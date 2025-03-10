"use client";

import { useState } from "react";
import axios from "axios";

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const uploadImages = async (files: FileList | File[]) => {
    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "https://192.168.1.253:8080/FileUpload/ImageUpload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        const imageUrl = `https://192.168.1.253:8080/images/${response.data}`;
        console.log(imageUrl);
        uploadedUrls.push(imageUrl);
        return imageUrl;
      } catch (err) {
        setError("Upload failed. Please try again.");
        console.error("Error uploading file:", err);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    setImageUrls(results.filter((url) => url !== null) as string[]);
    setUploading(false);

    return results;
  };

  return { uploadImages, uploading, error, imageUrls };
};

export default useImageUpload;
