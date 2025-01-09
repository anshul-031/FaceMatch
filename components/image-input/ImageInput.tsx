"use client";

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebcamCapture } from '../webcam/WebcamCapture';
import { ImageUpload } from './ImageUpload';
import { ImagePreview } from './ImagePreview';

interface ImageInputProps {
  imageNum: number;
  image: string | null;
  setImage: (value: string | null) => void;
}

export function ImageInput({ imageNum, image, setImage }: ImageInputProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Photo {imageNum}</h2>
        {image ? (
          <ImagePreview image={image} onClear={() => setImage(null)} />
        ) : (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="webcam">Webcam</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <ImageUpload image={image} setImage={setImage} />
            </TabsContent>
            <TabsContent value="webcam">
              <WebcamCapture onCapture={setImage} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Card>
  );
}