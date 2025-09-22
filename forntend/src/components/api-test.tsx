import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getApiUrl } from '@/lib/config'

export function ApiTestComponent() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testApiConnection = async () => {
    setIsLoading(true)
    setTestResult('')

    try {
      // Test the proxy by making a request to /api/health or any endpoint
      const response = await fetch(getApiUrl('/health'))
      
      if (response.ok) {
        const data = await response.text()
        setTestResult(`✅ API Connected: ${data}`)
      } else {
        setTestResult(`❌ API Error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setTestResult(`❌ Connection Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <Button 
          onClick={testApiConnection}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </Button>
        <span className="text-sm text-gray-600">
          (Tests proxy to {getApiUrl('/health')})
        </span>
      </div>
      {testResult && (
        <div className="text-sm mt-2 p-2 bg-white rounded border">
          {testResult}
        </div>
      )}
    </div>
  )
}