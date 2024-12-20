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
    const formData = await request.formData();
    const sourceImage = formData.get("sourceImage") as File;
    const targetImage = formData.get("targetImage") as File;

    if (!sourceImage || !targetImage) {
      return NextResponse.json(
        { error: "Both images are required" },
        { status: 400 }
      );
    }

    const sourceBuffer = Buffer.from(await sourceImage.arrayBuffer());
    const targetBuffer = Buffer.from(await targetImage.arrayBuffer());

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