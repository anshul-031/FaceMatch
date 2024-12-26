import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from './logger';
import { GeminiKeyManager } from './gemini/key-manager';
import { ApiError } from './error-utils';
import { FACE_COMPARISON_PROMPT } from './gemini/prompts';
import { parseFaceComparisonResponse } from './gemini/response-parser';
import type { FaceComparisonResult } from './types/face-comparison';

const keyManager = new GeminiKeyManager();

export async function compareFaces(
  image1Base64: string,
  image2Base64: string
): Promise<FaceComparisonResult> {
  try {
    const apiKey = keyManager.getNextKey();
    logger.info('Using Gemini 1.5 Flash for face comparison');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      FACE_COMPARISON_PROMPT,
      {
        inlineData: { data: image1Base64, mimeType: 'image/jpeg' }
      },
      {
        inlineData: { data: image2Base64, mimeType: 'image/jpeg' }
      }
    ]);

    const response = result.response.text();
    logger.info('Face comparison completed', { response });
    
    return parseFaceComparisonResponse(response);
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