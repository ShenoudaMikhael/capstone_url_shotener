import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BarChart3, Loader2, ExternalLink, Calendar, MousePointer, Link2 } from "lucide-react"
import { getApiUrl } from "@/lib/config"

const statsSchema = z.object({
  shortCode: z.string().min(3, "Short code must be at least 3 characters").max(20, "Short code must be at most 20 characters"),
})

type StatsFormData = z.infer<typeof statsSchema>

interface UrlStats {
  shortCode: string
  originalUrl: string
  shortUrl: string
  clickCount: number
  createdAt: string
  updatedAt: string
  isCustom: boolean
  isActive: boolean
  expiresAt?: string
}

export function UrlStatsChecker() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<UrlStats | null>(null)

  const form = useForm<StatsFormData>({
    resolver: zodResolver(statsSchema),
    defaultValues: {
      shortCode: "",
    },
  })

  const onSubmit = async (data: StatsFormData) => {
    setIsLoading(true)
    setError(null)
    setStats(null)
    
    try {
      const apiUrl = getApiUrl(`/urls/stats/${data.shortCode}`)
      console.log("Fetching stats from:", apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Short URL not found. Please check the short code and try again.')
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch URL statistics')
      }

      const result = await response.json()
      setStats(result)
    } catch (error) {
      console.error("Error fetching URL stats:", error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStats(null)
    setError(null)
    form.reset()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <BarChart3 className="h-6 w-6" />
          Check URL Statistics
        </CardTitle>
        <p className="text-gray-600">
          Enter a short code to view detailed analytics and information
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!stats ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="shortCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="abc123"
                        {...field}
                        className="h-12 font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-gray-500">
                      Enter the short code part of your URL (e.g., "abc123" from "{window.location.origin}/abc123")
                    </p>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Stats...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Get Statistics
                  </>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            {/* URL Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                URL Information
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Short Code:</span>
                  <span className="ml-2 font-mono bg-white px-2 py-1 rounded text-sm">{stats.shortCode}</span>
                  {stats.isCustom && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Custom</span>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600">Short URL:</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Input 
                      value={stats.shortUrl} 
                      readOnly 
                      className="flex-1 bg-white font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(stats.shortUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Original URL:</span>
                  <div className="mt-1 p-2 bg-white rounded border text-sm break-all">
                    {stats.originalUrl}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <MousePointer className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{stats.clickCount}</div>
                <div className="text-sm text-green-700">Total Clicks</div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-blue-600">Created</div>
                <div className="text-xs text-blue-700">{formatDate(stats.createdAt)}</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    stats.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {stats.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 text-gray-800">{formatDate(stats.updatedAt)}</span>
                </div>
                {stats.expiresAt && (
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Expires:</span>
                    <span className="ml-2 text-gray-800">{formatDate(stats.expiresAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Check Another URL
              </Button>
              <Button
                onClick={() => window.open(stats.shortUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit URL
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}