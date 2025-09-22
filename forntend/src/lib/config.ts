/**
 * Configuration utility for handling different environments
 */

export const config = {
  // API base URL for backend calls
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Domain for shortened URLs
  shortDomain: import.meta.env.VITE_SHORT_DOMAIN || 'localhost:3000',
  
  // Current app domain
  appDomain: import.meta.env.VITE_APP_DOMAIN || 'localhost:5173',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const

/**
 * Generates a shortened URL based on the current environment
 * @param shortCode - The short code for the URL
 * @returns The complete shortened URL
 */
export function generateShortUrl(shortCode: string): string {
  const protocol = config.isDevelopment ? 'http' : 'https'
  return `${protocol}://${config.shortDomain}/${shortCode}`
}

/**
 * Gets the API endpoint URL
 * @param endpoint - The API endpoint path
 * @returns The complete API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${config.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

/**
 * Gets the current base URL of the application
 * @returns The current application base URL
 */
export function getBaseUrl(): string {
  const protocol = config.isDevelopment ? 'http' : 'https'
  return `${protocol}://${config.appDomain}`
}

/**
 * Detects if we're running in development mode
 * @returns boolean indicating if in development
 */
export function isDevelopmentMode(): boolean {
  return config.isDevelopment
}

/**
 * Gets environment-specific configuration
 * @returns Configuration object with environment details
 */
export function getEnvironmentInfo() {
  return {
    environment: config.isDevelopment ? 'development' : 'production',
    apiBaseUrl: config.apiBaseUrl,
    shortDomain: config.shortDomain,
    appDomain: config.appDomain,
  }
}