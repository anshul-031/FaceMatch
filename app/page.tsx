"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageInput } from "@/components/ImageInput";

export default function Home() {
  const [sourceImage, setSourceImage] = useState<string>("");
  const [targetImage, setTargetImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    match: boolean;
    confidence: number;
    message: string;
  } | null>(null);

  const handleImageSelect = (base64: string, type: "source" | "target") => {
    if (type === "source") {
      setSourceImage(base64);
    } else {
      setTargetImage(base64);
    }
  };

  const handleCompare = async () => {
    if (!sourceImage || !targetImage) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/compare-faces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image1: sourceImage,
          image2: targetImage,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error comparing faces:", error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSourceImage("");
    setTargetImage("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Face Comparison Tool
          </h1>
          <p className="text-lg text-gray-600">
            Upload or capture two images to check if they belong to the same person
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ImageInput
            title="First Image"
            preview={sourceImage}
            onImageSelect={(base64) => handleImageSelect(base64, "source")}
            onImageCapture={(base64) => handleImageSelect(base64, "source")}
          />
          <ImageInput
            title="Second Image"
            preview={targetImage}
            onImageSelect={(base64) => handleImageSelect(base64, "target")}
            onImageCapture={(base64) => handleImageSelect(base64, "target")}
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleCompare}
            disabled={!sourceImage || !targetImage || loading}
            className="w-40"
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Compare Faces"
            )}
          </Button>
          <Button onClick={reset} variant="outline" className="w-40">
            Reset
          </Button>
        </div>

        {result && (
          <Card className="mt-8 p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Results</h2>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  {result.message}
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Confidence Score: {result.confidence.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}