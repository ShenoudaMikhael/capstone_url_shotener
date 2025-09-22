import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Link, Loader2 } from "lucide-react"
import { generateShortUrl } from "@/lib/config"

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  customCode: z.string().optional(),
})

type UrlFormData = z.infer<typeof urlSchema>

interface ShortenedUrl {
  shortCode: string
  originalUrl: string
  shortUrl: string
  qrCode?: string
}

interface UrlShortenerFormProps {
  onUrlShortened: (data: ShortenedUrl) => void
}

export function UrlShortenerForm({ onUrlShortened }: UrlShortenerFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
      customCode: "",
    },
  })

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call to getApiUrl('/urls/shorten')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const shortCode = data.customCode || Math.random().toString(36).substring(2, 8)
      const mockResponse: ShortenedUrl = {
        shortCode,
        originalUrl: data.url,
        shortUrl: generateShortUrl(shortCode),
      }
      
      onUrlShortened(mockResponse)
      form.reset()
    } catch (error) {
      console.error("Error shortening URL:", error)
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