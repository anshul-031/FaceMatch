"use client";

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ImageInput } from '@/components/image-input/ImageInput';
import { getErrorMessage } from '@/lib/error-utils';

export default function Home() {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isMatch: boolean; matchPercentage: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compareFaces = async () => {
    if (!image1 || !image2) {
      toast.error('Please provide both images first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/compare-faces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image1, image2 }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        toast.success('Comparison completed');
      } else {
        throw new Error(data.error || 'Failed to compare faces');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Face Match AI</h1>
          <p className="text-lg text-gray-600">
            Upload or capture two photos to check if they belong to the same person
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ImageInput imageNum={1} image={image1} setImage={setImage1} />
          <ImageInput imageNum={2} image={image2} setImage={setImage2} />
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={compareFaces}
            disabled={loading || !image1 || !image2}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              'Compare Faces'
            )}
          </Button>

          {error && (
            <Card className="p-6 bg-red-50 border-red-200">
              <h3 className="text-xl font-semibold mb-2 text-red-700">Error</h3>
              <p className="text-red-600">{error}</p>
            </Card>
          )}

          {result && !error && (
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">Result</h3>
              <div className="space-y-2">
                <p className="text-lg text-gray-700">
                  Match: <span className="font-semibold">{result.isMatch ? 'Same Person' : 'Different People'}</span>
                </p>
                <p className="text-lg text-gray-700">
                  Similarity: <span className="font-semibold">{result.matchPercentage}%</span>
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}