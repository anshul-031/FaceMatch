export const FACE_COMPARISON_PROMPT = `Analyze these two face images and provide:
1. A match percentage (0-100) indicating how similar the faces are
2. A boolean (true/false) indicating if they are the same person

Respond in this exact format:
percentage: [number]
match: [true/false]

Be very strict in the comparison - focus on facial features, structure, and unique characteristics.`;