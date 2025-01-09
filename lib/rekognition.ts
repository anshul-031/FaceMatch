import { RekognitionClient, CompareFacesCommand } from "@aws-sdk/client-rekognition";
import logger from './logger';
import { ApiError } from './error-utils';
import type { FaceComparisonResult } from './types/face-comparison';

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function compareFaces(
  image1Base64: string,
  image2Base64: string
): Promise<FaceComparisonResult> {
  try {
    logger.info('Starting face comparison with AWS Rekognition');

    const sourceImage = Buffer.from(image1Base64, 'base64');
    const targetImage = Buffer.from(image2Base64, 'base64');

    const command = new CompareFacesCommand({
      SourceImage: { Bytes: sourceImage },
      TargetImage: { Bytes: targetImage },
      SimilarityThreshold: 80,
    });

    const response = await rekognition.send(command);
    logger.info('Face comparison completed', { response });

    if (!response.FaceMatches || response.FaceMatches.length === 0) {
      return {
        isMatch: false,
        matchPercentage: 0,
      };
    }

    // Get the highest confidence match
    const bestMatch = response.FaceMatches.reduce((prev, current) => {
      return (prev.Similarity || 0) > (current.Similarity || 0) ? prev : current;
    });

    return {
      isMatch: (bestMatch.Similarity || 0) >= 90,
      matchPercentage: Math.round(bestMatch.Similarity || 0),
    };
  } catch (error) {
    logger.error('Error comparing faces:', error);
    if (error instanceof Error) {
      throw new ApiError(
        'Failed to process face comparison: ' + error.message,
        500
      );
    }
    throw new ApiError('Failed to process face comparison', 500);
  }
}