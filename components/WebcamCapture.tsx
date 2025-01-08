"use client";

import { useRef, useState } from "react";
import { Camera, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      onCapture(imageData);
      stopWebcam();
    }
  };

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full rounded-lg ${!isStreaming && "hidden"}`}
      />
      <div className="flex justify-center gap-2">
        {!isStreaming ? (
          <Button onClick={startWebcam} variant="outline" size="sm">
            <Camera className="w-4 h-4 mr-2" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={captureImage} variant="default" size="sm">
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
            <Button onClick={stopWebcam} variant="outline" size="sm">
              <StopCircle className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </>
        )}
      </div>
    </div>
  );
}