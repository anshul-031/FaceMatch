"use client";

import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  title: string;
  preview: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUpload({ title, preview, onChange }: ImageUploadProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[200px]">
          {preview ? (
            <img
              src={preview}
              alt={`${title} preview`}
              className="max-h-48 mx-auto object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">Click to upload image</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
}