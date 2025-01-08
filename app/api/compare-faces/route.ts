import { RekognitionClient, CompareFacesCommand } from "@aws-sdk/client-rekognition";
import { NextRequest, NextResponse } from "next/server";

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  try {
    const { image1, image2 } = await request.json();

    if (!image1 || !image2) {
      return NextResponse.json(
        { error: "Both images are required" },
        { status: 400 }
      );
    }

    const sourceBuffer = Buffer.from(image1, 'base64');
    const targetBuffer = Buffer.from(image2, 'base64');

    const command = new CompareFacesCommand({
      SourceImage: { Bytes: sourceBuffer },
      TargetImage: { Bytes: targetBuffer },
      SimilarityThreshold: 90,
    });

    const response = await rekognition.send(command);

    if (!response.FaceMatches || response.FaceMatches.length === 0) {
      return NextResponse.json({
        match: false,
        confidence: 0,
        message: "No face matches found",
      });
    }

    const confidence = response.FaceMatches[0].Similarity || 0;

    return NextResponse.json({
      match: confidence > 90,
      confidence,
      message: confidence > 90 ? "Same person detected" : "Different persons detected",
    });
  } catch (error) {
    console.error("Error comparing faces:", error);
    return NextResponse.json(
      { error: "Error processing face comparison" },
      { status: 500 }
    );
  }
}