"use client";

import { Upload } from 'lucide-react';
import { handleImageUpload } from '@/lib/image-utils';

interface ImageUploadProps {
  image: string | null;
  setImage: (value: string | null) => void;
}

export function ImageUpload({ image, setImage }: ImageUploadProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      {image ? (
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt="Uploaded image"
          className="mx-auto max-h-48 object-contain"
        />
      ) : (
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, setImage)}
        className="mt-4"
      />
    </div>
  );
}