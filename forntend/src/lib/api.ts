import { getApiUrl } from '@/lib/config'

export interface ShortenUrlRequest {
  url: string
  customCode?: string
  password?: string
  expiresAt?: string
}

export interface ShortenUrlResponse {
  shortCode: string
  originalUrl: string
  shortUrl: string
  qrCode?: string
  createdAt: string
  expiresAt?: string
}

export interface UrlAnalytics {
  totalClicks: number
  uniqueClicks: number
  clicksByDate: Array<{ date: string; clicks: number }>
  topReferrers: Array<{ referrer: string; count: number }>
  deviceBreakdown: Array<{ device: string; count: number }>
}

/**
 * API service for URL shortening operations
 */
export class UrlService {
  /**
   * Shortens a URL
   * @param data - The URL shortening request data
   * @returns Promise with the shortened URL response
   */
  static async shortenUrl(data: ShortenUrlRequest): Promise<ShortenUrlResponse> {
    try {
      const response = await fetch(getApiUrl('/urls/shorten'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error shortening URL:', error)
      throw error
    }
  }

  /**
   * Gets analytics for a shortened URL
   * @param shortCode - The short code to get analytics for
   * @returns Promise with analytics data
   */
  static async getAnalytics(shortCode: string): Promise<UrlAnalytics> {
    try {
      const response = await fetch(getApiUrl(`/urls/${shortCode}/analytics`))

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  }

  /**
   * Validates if a URL is accessible
   * @param url - The URL to validate
   * @returns Promise with validation result
   */
  static async validateUrl(url: string): Promise<{ isValid: boolean; message?: string }> {
    try {
      const response = await fetch(getApiUrl('/urls/validate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error validating URL:', error)
      return { isValid: false, message: 'Unable to validate URL' }
    }
  }
}