# Environment Configuration Guide

This guide explains how to configure the dynamic domain system for the TDCL URL Shortener.

## Environment Variables

The application uses different environment variables for development and production:

### Development (.env)
```env
VITE_APP_DOMAIN=localhost:5173
VITE_API_BASE_URL=/api
VITE_SHORT_DOMAIN=localhost:3000
```

**Note**: In development, `VITE_API_BASE_URL=/api` uses Vite's proxy to forward requests to `localhost:3000`.

### Production (.env.production)
```env
VITE_APP_DOMAIN=yourdomain.com
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_SHORT_DOMAIN=yourdomain.com
```

## Proxy Configuration

### Development Proxy

The Vite development server is configured to proxy all `/api` requests to `localhost:3000`. This:

- **Eliminates CORS issues** during development
- **Simplifies API calls** (no need for full URLs)
- **Matches production behavior** where frontend and backend share the same domain

### How the Proxy Works

```typescript
// In development: /api/users/shorten -> http://localhost:3000/api/users/shorten
// In production: /api/users/shorten -> https://yourdomain.com/api/users/shorten

const response = await fetch('/api/users/shorten', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

### Proxy Configuration (vite.config.ts)

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false
    }
  }
}
```

### Testing the Proxy

In development mode, you'll see an "Test API Connection" button that verifies the proxy is working correctly.

## Environment Variables Explanation

- **VITE_APP_DOMAIN**: The domain where your frontend application is hosted
- **VITE_API_BASE_URL**: The base URL for your backend API
- **VITE_SHORT_DOMAIN**: The domain used for shortened URLs

## Setup Instructions

1. **Development Setup**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your development settings
   # The default settings should work for local development
   ```

2. **Production Setup**:
   ```bash
   # Create production environment file
   cp .env.example .env.production
   
   # Edit .env.production with your production domains
   ```

## How It Works

### Dynamic URL Generation

The `generateShortUrl()` function automatically:
- Uses `http://` for development
- Uses `https://` for production
- Constructs URLs using the configured domain

Example outputs:
- **Development**: `http://localhost:3000/abc123`
- **Production**: `https://yourdomain.com/abc123`

### API Integration

When you're ready to connect to a real backend:

```typescript
import { UrlService } from '@/lib/api'

// This will automatically use the correct API URL
const result = await UrlService.shortenUrl({
  url: 'https://example.com/very/long/url',
  customCode: 'my-code'
})
```

### Development Indicators

In development mode, you'll see:
- A "DEV" badge in the header
- The current short domain displayed in the navigation

## Deployment

### Frontend Deployment
1. Set your production environment variables
2. Build the application: `pnpm build`
3. Deploy the `dist` folder to your hosting provider

### Backend Requirements
Your backend should handle:
- `POST /api/urls/shorten` - Create short URLs
- `GET /api/urls/:shortCode/analytics` - Get analytics
- `POST /api/urls/validate` - Validate URLs
- `GET /:shortCode` - Redirect to original URL

## Environment Detection

The application automatically detects the environment:

```typescript
import { isDevelopmentMode, getEnvironmentInfo } from '@/lib/config'

if (isDevelopmentMode()) {
  console.log('Running in development mode')
}

console.log(getEnvironmentInfo())
```

## Troubleshooting

### Common Issues

1. **URLs not generating correctly**:
   - Check your `.env` file exists
   - Ensure variable names start with `VITE_`
   - Restart the development server after changing env vars

2. **API calls failing**:
   - Verify `VITE_API_BASE_URL` is correct
   - Check backend server is running
   - Ensure CORS is configured for your domain

3. **Production deployment issues**:
   - Verify `.env.production` file is properly configured
   - Check build process includes environment variables
   - Ensure hosting provider supports environment variables

### Environment Variable Priority

Vite loads environment variables in this order:
1. `.env.production` (production build)
2. `.env.local` (always loaded, git ignored)
3. `.env` (default)
4. `.env.example` (for reference only)

## Security Notes

- Never commit `.env.local` or `.env.production` with sensitive data
- Use `.env.example` for documentation
- Environment variables prefixed with `VITE_` are exposed to the client
- Don't put secrets in `VITE_` variables as they're visible in the browser