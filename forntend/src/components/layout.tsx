import { Link, BarChart3, Shield, Zap } from "lucide-react"
import { isDevelopmentMode, config } from "@/lib/config"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              TDCL Shortener
            </h1>
            {isDevelopmentMode() && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                DEV
              </span>
            )}
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a 
              href="#analytics" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Analytics
            </a>
            <a 
              href="#about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </a>
            {isDevelopmentMode() && (
              <span className="text-xs text-gray-500">
                {config.shortDomain}
              </span>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">
                TDCL Shortener
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Fast, reliable, and anonymous URL shortening service with analytics.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Instant URL shortening
              </li>
              <li className="flex items-center gap-2">
                <BarChart3 className="h-3 w-3" />
                Click analytics
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Privacy-focused
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Tools</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>QR Code Generator</li>
              <li>Custom Short Codes</li>
              <li>Password Protection</li>
              <li>Expiration Dates</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2025 TDCL URL Shortener. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}