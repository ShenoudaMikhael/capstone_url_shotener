# URL Shortener API Documentation

## Overview

The URL Shortener API provides RESTful endpoints for creating, managing, and analyzing shortened URLs. All API endpoints are prefixed with `/api` and return JSON responses.

**Base URL**: `http://localhost:3000` (development)  
**API Version**: v1  
**Content-Type**: `application/json`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Error Handling

The API uses conventional HTTP response codes to indicate success or failure:

- `200` - OK: Request succeeded
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation errors
- `500` - Internal Server Error: Server error

### Error Response Format

```json
{
  "error": "Error message describing what went wrong",
  "details": "Additional error details (optional)"
}
```

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the API server is running and healthy.

#### Response

**200 OK**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-22T10:30:00.000Z",
  "uptime": 3600
}
```

#### Example

```bash
curl -X GET "http://localhost:3000/health"
```

---

### 2. Shorten URL

**POST** `/api/urls/shorten`

Create a shortened URL from a long URL.

#### Request Body

```json
{
  "originalUrl": "https://www.example.com/very/long/url/path",
  "customCode": "mycode" // optional
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `originalUrl` | string | Yes | The URL to be shortened. Must be a valid HTTP/HTTPS URL |
| `customCode` | string | No | Custom short code (3-20 characters, alphanumeric) |

#### Response

**201 Created**
```json
{
  "id": 1,
  "originalUrl": "https://www.example.com/very/long/url/path",
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "clickCount": 0,
  "isCustom": false,
  "isActive": true,
  "createdAt": "2025-09-22T10:30:00.000Z",
  "updatedAt": "2025-09-22T10:30:00.000Z"
}
```

#### Error Responses

**400 Bad Request** - Invalid URL format
```json
{
  "error": "Invalid URL format. Please provide a valid HTTP or HTTPS URL."
}
```

**422 Unprocessable Entity** - Custom code already exists
```json
{
  "error": "Custom short code 'mycode' is already in use. Please choose a different code."
}
```

#### Examples

**Basic URL shortening:**
```bash
curl -X POST "http://localhost:3000/api/urls/shorten" \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://www.google.com"
  }'
```

**Custom short code:**
```bash
curl -X POST "http://localhost:3000/api/urls/shorten" \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://www.github.com",
    "customCode": "github"
  }'
```

---

### 3. Redirect to Original URL

**GET** `/:shortCode`

Redirect to the original URL and increment click counter.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `shortCode` | string | Yes | The short code to redirect |

#### Response

**302 Found** - Redirects to original URL

**404 Not Found** - Short code not found
```json
{
  "error": "Short URL not found"
}
```

#### Examples

**Browser redirect:**
```
http://localhost:3000/abc123
```

**cURL (follow redirects):**
```bash
curl -L "http://localhost:3000/abc123"
```

**cURL (see redirect headers):**
```bash
curl -I "http://localhost:3000/abc123"
```

---

### 4. Get URL Statistics

**GET** `/api/urls/stats/:shortCode`

Retrieve detailed statistics for a shortened URL.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `shortCode` | string | Yes | The short code to get statistics for |

#### Response

**200 OK**
```json
{
  "id": 1,
  "shortCode": "abc123",
  "originalUrl": "https://www.example.com/very/long/url/path",
  "shortUrl": "http://localhost:3000/abc123",
  "clickCount": 42,
  "isCustom": false,
  "isActive": true,
  "createdAt": "2025-09-22T10:30:00.000Z",
  "updatedAt": "2025-09-22T12:45:00.000Z",
  "expiresAt": null
}
```

#### Error Responses

**404 Not Found**
```json
{
  "error": "Short URL not found. Please check the short code and try again."
}
```

#### Examples

```bash
curl -X GET "http://localhost:3000/api/urls/stats/abc123"
```

---

## Data Models

### URL Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier (auto-increment) |
| `originalUrl` | text | The original long URL |
| `shortCode` | string | The unique short code (indexed) |
| `clickCount` | integer | Number of times the URL has been accessed |
| `isActive` | boolean | Whether the URL is active (default: true) |
| `isCustom` | boolean | Whether the short code was custom or generated |
| `createdAt` | datetime | When the URL was created |
| `updatedAt` | datetime | When the URL was last updated |
| `expiresAt` | datetime | Optional expiration date |

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing:
- 100 requests per minute per IP for URL shortening
- 1000 requests per minute per IP for redirects
- 500 requests per minute per IP for statistics

## CORS Policy

CORS is enabled for all origins in development mode. For production, configure specific allowed origins in the CORS middleware.

## Database Considerations

### Indexes

The following indexes are automatically created:
- Primary key on `id`
- Unique index on `shortCode` (first 10 characters for TEXT compatibility)
- Index on `originalUrl` (first 100 characters for analytics)

### Constraints

- `shortCode` must be unique
- `originalUrl` cannot be null
- `clickCount` defaults to 0
- `isActive` defaults to true
- `isCustom` defaults to false

## Testing Examples

### Complete Workflow Test

```bash
#!/bin/bash

# 1. Check API health
echo "Testing API health..."
curl -X GET "http://localhost:3000/health"

# 2. Create a shortened URL
echo -e "\n\nCreating shortened URL..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/urls/shorten" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.example.com"}')

echo $RESPONSE

# Extract short code from response (requires jq)
SHORT_CODE=$(echo $RESPONSE | jq -r '.shortCode')

# 3. Test redirect (this will follow the redirect)
echo -e "\n\nTesting redirect..."
curl -L "http://localhost:3000/$SHORT_CODE"

# 4. Check statistics
echo -e "\n\nChecking statistics..."
curl -X GET "http://localhost:3000/api/urls/stats/$SHORT_CODE"
```

### Error Handling Tests

```bash
# Test invalid URL
curl -X POST "http://localhost:3000/api/urls/shorten" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "not-a-valid-url"}'

# Test missing URL
curl -X POST "http://localhost:3000/api/urls/shorten" \
  -H "Content-Type: application/json" \
  -d '{}'

# Test non-existent short code
curl -X GET "http://localhost:3000/nonexistent"

# Test non-existent stats
curl -X GET "http://localhost:3000/api/urls/stats/nonexistent"
```

## Integration Examples

### JavaScript/TypeScript

```typescript
interface ShortenRequest {
  originalUrl: string;
  customCode?: string;
}

interface ShortenResponse {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  isCustom: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class UrlShortenerClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async shortenUrl(request: ShortenRequest): Promise<ShortenResponse> {
    const response = await fetch(`${this.baseUrl}/api/urls/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to shorten URL');
    }

    return response.json();
  }

  async getStats(shortCode: string): Promise<ShortenResponse> {
    const response = await fetch(`${this.baseUrl}/api/urls/stats/${shortCode}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get statistics');
    }

    return response.json();
  }
}

// Usage example
const client = new UrlShortenerClient();

try {
  const result = await client.shortenUrl({
    originalUrl: 'https://www.example.com',
    customCode: 'example'
  });
  
  console.log('Shortened URL:', result.shortUrl);
  
  // Get statistics
  const stats = await client.getStats(result.shortCode);
  console.log('Click count:', stats.clickCount);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Python

```python
import requests
import json

class UrlShortenerClient:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
    
    def shorten_url(self, original_url, custom_code=None):
        data = {"originalUrl": original_url}
        if custom_code:
            data["customCode"] = custom_code
        
        response = requests.post(
            f"{self.base_url}/api/urls/shorten",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Error {response.status_code}: {response.json().get('error')}")
    
    def get_stats(self, short_code):
        response = requests.get(f"{self.base_url}/api/urls/stats/{short_code}")
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error {response.status_code}: {response.json().get('error')}")

# Usage example
client = UrlShortenerClient()

try:
    result = client.shorten_url("https://www.example.com", "python-example")
    print(f"Shortened URL: {result['shortUrl']}")
    
    stats = client.get_stats(result['shortCode'])
    print(f"Click count: {stats['clickCount']}")
except Exception as e:
    print(f"Error: {e}")
```

## Security Considerations

1. **Input Validation**: All inputs are validated before processing
2. **URL Validation**: Only HTTP/HTTPS URLs are accepted
3. **XSS Prevention**: No user input is directly rendered in HTML
4. **SQL Injection**: Using Sequelize ORM with parameterized queries
5. **Rate Limiting**: Should be implemented for production use

## Performance Notes

- Database indexes on `shortCode` and `originalUrl` for fast lookups
- Consider implementing caching for frequently accessed URLs
- Use connection pooling for database connections
- Monitor response times and optimize queries as needed

## Future Enhancements

- User authentication and authorization
- Custom domains support
- Bulk operations
- Advanced analytics (device, location, referrer tracking)
- URL expiration dates
- QR code generation
- API versioning
- Rate limiting and abuse prevention