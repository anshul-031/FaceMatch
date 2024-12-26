# Face Match API

A Next.js application that uses Google's Gemini 1.5 Flash model to compare faces in images and determine if they belong to the same person.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your Gemini API keys to `.env`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Compare Faces

**Endpoint:** `POST /api/compare-faces`

Compare two face images and get a similarity percentage.

**Request Body:**
```json
{
  "image1": "base64_encoded_image_string",
  "image2": "base64_encoded_image_string"
}
```

**Success Response:**
```json
{
  "isMatch": true,
  "matchPercentage": 95
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Testing

Import the `face-match-api.postman_collection.json` into Postman to test the API endpoints.

## Environment Variables

- `GEMINI_API_KEYS`: Comma-separated list of Gemini API keys for key rotation
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `LOG_LEVEL`: Logging level (default: info)