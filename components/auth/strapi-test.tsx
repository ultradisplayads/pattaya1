'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useStrapiApi } from '@/hooks/use-strapi-api'

export function StrapiTest() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { fetchFromStrapi } = useStrapiApi()

  const testStrapiConnection = async () => {
    setIsLoading(true)
    setTestResult('Testing Strapi connection...')
    
    try {
      const response = await fetchFromStrapi('/api/global')
      if (response) {
        setTestResult('✅ Strapi connection successful!')
      } else {
        setTestResult('❌ Strapi connection failed - no response')
      }
    } catch (error) {
      setTestResult(`❌ Strapi connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Strapi API Test</CardTitle>
        <CardDescription>
          Test the connection to your Strapi backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testStrapiConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Test Strapi Connection'}
        </Button>
        
        {testResult && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

