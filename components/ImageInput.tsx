"use client";

import { useState } from "react";
import { Upload, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebcamCapture } from "./WebcamCapture";
import { cn } from "@/lib/utils";

interface ImageInputProps {
  title: string;
  preview: string;
  onImageSelect: (file: File) => void;
  onImageCapture: (dataUrl: string) => void;
}

export function ImageInput({ title, preview, onImageSelect, onImageCapture }: ImageInputProps) {
  const [isWebcam, setIsWebcam] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleWebcamCapture = (imageData: string) => {
    onImageCapture(imageData);
    setIsWebcam(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsWebcam(!isWebcam)}
          >
            {isWebcam ? <Upload className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          </Button>
        </div>

        <div className={cn(
          "relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[200px]",
          isWebcam && "border-none p-0"
        )}>
          {isWebcam ? (
            <WebcamCapture onCapture={handleWebcamCapture} />
          ) : (
            <>
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
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}