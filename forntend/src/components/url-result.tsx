import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, Check, QrCode, ExternalLink } from "lucide-react"
import QRCode from "qrcode"

interface ShortenedUrl {
  shortCode: string
  originalUrl: string
  shortUrl: string
  qrCode?: string
}

interface UrlResultProps {
  result: ShortenedUrl
}

export function UrlResult({ result }: UrlResultProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")

  useEffect(() => {
    // Generate QR code
    QRCode.toDataURL(result.shortUrl, {
      width: 200,
      margin: 2,
    }).then(setQrCodeDataUrl)
  }, [result.shortUrl])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const openUrl = () => {
    window.open(result.shortUrl, "_blank")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl text-green-600">
          <Check className="h-5 w-5" />
          URL Shortened Successfully!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Short URL Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Your shortened URL:
          </label>
          <div className="flex gap-2">
            <Input
              value={result.shortUrl}
              readOnly
              className="font-mono text-blue-600"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={openUrl}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <p className="text-sm text-green-600">Copied to clipboard!</p>
          )}
        </div>

        {/* Original URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Original URL:
          </label>
          <Input
            value={result.originalUrl}
            readOnly
            className="text-gray-600 text-sm"
          />
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="text-sm font-medium text-gray-700">QR Code</span>
          </div>
          {qrCodeDataUrl && (
            <div className="p-4 bg-white rounded-lg border">
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code for shortened URL"
                className="w-32 h-32"
              />
            </div>
          )}
          <p className="text-xs text-gray-500 text-center max-w-sm">
            Scan this QR code with your phone to quickly access the shortened URL
          </p>
        </div>

        {/* Statistics placeholder */}
        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Short Code: <span className="font-mono">{result.shortCode}</span></span>
            <span>Created: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}