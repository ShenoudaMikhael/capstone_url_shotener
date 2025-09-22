import { useState } from "react"
import { Header, Footer } from "./components/layout"
import { UrlShortenerForm } from "./components/url-shortener-form"
import { UrlResult } from "./components/url-result"
import { FeaturesSection } from "./components/features-section"
import { ApiTestComponent } from "./components/api-test"
import { isDevelopmentMode } from "./lib/config"
import "./App.css"

interface ShortenedUrl {
  shortCode: string
  originalUrl: string
  shortUrl: string
  qrCode?: string
}

function App() {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null)

  const handleUrlShortened = (data: ShortenedUrl) => {
    setShortenedUrl(data)
  }

  const handleCreateAnother = () => {
    setShortenedUrl(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Shorten URLs,
                <span className="text-blue-600"> Amplify Reach</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Transform your long, complex URLs into short, powerful links with built-in analytics, 
                QR codes, and customization options. No registration required.
              </p>
            </div>
            
            {/* Main Form/Result Area */}
            <div className="max-w-4xl mx-auto">
              {!shortenedUrl ? (
                <div>
                  <UrlShortenerForm onUrlShortened={handleUrlShortened} />
                  {isDevelopmentMode() && <ApiTestComponent />}
                </div>
              ) : (
                <div className="space-y-6">
                  <UrlResult result={shortenedUrl} />
                  <div className="text-center">
                    <button
                      onClick={handleCreateAnother}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Create another short URL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Trusted by Users Worldwide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600">URLs Shortened</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
                  <div className="text-gray-600">Clicks Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="analytics" className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust TDCL Shortener for their URL management needs. 
              Start shortening your URLs today!
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Shortening
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
