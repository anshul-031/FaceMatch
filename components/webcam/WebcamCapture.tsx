"use client";

import { useRef, useState, useCallback } from 'react';
import { Camera, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setIsVideoReady(false);
    }
  }, []);

  const handleVideoReady = () => {
    setIsVideoReady(true);
  };

  const captureImage = useCallback(() => {
    if (videoRef.current && isVideoReady) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
        onCapture(imageData);
        stopCamera();
      }
    }
  }, [onCapture, stopCamera, isVideoReady]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          onLoadedData={handleVideoReady}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-2 justify-center">
        {!isStreaming ? (
          <Button onClick={startCamera} variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button 
              onClick={captureImage} 
              variant="default"
              disabled={!isVideoReady}
            >
              <Camera className="mr-2 h-4 w-4" />
              {isVideoReady ? 'Capture' : 'Loading...'}
            </Button>
            <Button onClick={stopCamera} variant="outline">
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
          </>
        )}
      </div>
    </div>
  );
}