"use client";

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  image: string;
  onClear: () => void;
}

export function ImagePreview({ image, onClear }: ImagePreviewProps) {
  return (
    <div className="relative">
      <div className="border rounded-lg p-4">
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt="Preview"
          className="mx-auto max-h-48 object-contain"
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
        onClick={onClear}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}