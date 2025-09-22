import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Link, Loader2 } from "lucide-react"
import { getApiUrl } from "@/lib/config"

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  customCode: z.string().optional(),
})

type UrlFormData = z.infer<typeof urlSchema>

interface ShortenedUrl {
  shortCode: string
  originalUrl: string
  shortUrl: string
  createdAt?: string
  clickCount?: number
  existing?: boolean
  qrCode?: string
}

interface UrlShortenerFormProps {
  onUrlShortened: (data: ShortenedUrl) => void
}

export function UrlShortenerForm({ onUrlShortened }: UrlShortenerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
      customCode: "",
    },
  })

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true)
    setError(null) // Clear previous errors
    
    try {
      const apiUrl = getApiUrl('/urls/shorten');
      console.log("Calling API URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: data.url,
          customCode: data.customCode
        })
      });

      console.log("API Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to shorten URL');
      }

      const result = await response.json();
      
      // Transform the backend response to match the expected interface
      const shortenedUrl: ShortenedUrl = {
        shortCode: result.shortCode,
        originalUrl: result.originalUrl,
        shortUrl: result.shortUrl,
        createdAt: result.createdAt,
        clickCount: result.clickCount,
        existing: result.existing,
      };
      
      onUrlShortened(shortenedUrl);
      form.reset();
    } catch (error) {
      console.error("Error shortening URL:", error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Link className="h-6 w-6" />
          Shorten Your URL
        </CardTitle>
        <p className="text-gray-600">
          Paste your long URL below and get a short, shareable link instantly
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/very/long/url/that/needs/shortening"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Short Code (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-custom-code"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-gray-500">
                    Leave empty for a random short code
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
                  Shortening...
                </>
              ) : (
                "Shorten URL"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}