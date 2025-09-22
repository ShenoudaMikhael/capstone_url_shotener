# URL Shortener API Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-22T10:30:00.000Z",
  "service": "URL Shortener API"
}
```

### 2. Shorten URL
**POST** `/urls/shorten`

Create a short URL from a long URL.

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url",
  "customCode": "optional-custom-code"
}
```

**Response (Success - 201):**
```json
{
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "shortUrl": "http://localhost:3000/abc123",
  "createdAt": "2025-09-22T10:30:00.000Z",
  "clickCount": 0,
  "existing": false
}
```

**Response (Error - 400):**
```json
{
  "error": "Invalid URL format",
  "code": "INVALID_URL"
}
```

**Error Codes:**
- `MISSING_URL` - URL field is required
- `INVALID_URL` - URL format is invalid
- `INVALID_CUSTOM_CODE` - Custom code format is invalid
- `CODE_EXISTS` - Custom code already exists

### 3. Redirect to Original URL
**GET** `/:shortCode`

Redirect to the original URL using the short code.

**Response:**
- **301 Redirect** to original URL (success)
- **404** if short code not found

**Error Response (404):**
```json
{
  "error": "Short URL not found or expired",
  "code": "URL_NOT_FOUND"
}
```

### 4. Get URL Statistics
**GET** `/urls/stats/:shortCode`

Get statistics for a specific short URL.

**Response (200):**
```json
{
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "shortUrl": "http://localhost:3000/abc123",
  "clickCount": 42,
  "createdAt": "2025-09-22T10:30:00.000Z",
  "updatedAt": "2025-09-22T10:35:00.000Z",
  "isCustom": false,
  "isActive": true,
  "expiresAt": null
}
```

### 5. Get All URLs
**GET** `/urls`

Get a paginated list of all URLs.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `search` (optional) - Search in URL or short code

**Example:**
```
GET /urls?page=1&limit=5&search=google
```

**Response (200):**
```json
{
  "urls": [
    {
      "shortCode": "abc123",
      "originalUrl": "https://google.com",
      "shortUrl": "http://localhost:3000/abc123",
      "clickCount": 5,
      "createdAt": "2025-09-22T10:30:00.000Z",
      "isCustom": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "pages": 1
  }
}
```

## CORS Configuration

The API supports CORS for the following origins:
- `http://localhost:5173` (Vite development server)
- `http://localhost:3000` (Local testing)

## Frontend Integration

To use this API with your React frontend form, update your API calls:

```typescript
// Example for the frontend form
const response = await fetch('http://localhost:3000/urls/shorten', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: data.url,
    customCode: data.customCode
  })
});

const result = await response.json();
```

## Testing

Run the test script to verify all endpoints:
```bash
./test-api.sh
```

## Database Schema

The `urls` table contains:
- `id` - Primary key
- `originalUrl` - The original long URL
- `shortCode` - The generated short code (unique)
- `customCode` - Boolean indicating if code was custom
- `clickCount` - Number of times the short URL was accessed
- `isActive` - Whether the URL is active
- `expiresAt` - Optional expiration date
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp