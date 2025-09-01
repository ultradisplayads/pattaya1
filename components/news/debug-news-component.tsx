'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DebugNewsComponent() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
    
    const results: any = {
      apiUrl,
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Test articles endpoint
    try {
      const response = await fetch(`${apiUrl}/articles?populate=*&sort=publishedAt:desc`);
      const data = await response.json();
      results.tests.articles = {
        status: response.status,
        success: response.ok,
        count: data.data?.length || 0,
        data: data.data?.slice(0, 2) // First 2 articles for debugging
      };
    } catch (error: any) {
      results.tests.articles = {
        error: error.message,
        success: false
      };
    }

    // Test breaking news
    try {
      const response = await fetch(`${apiUrl}/breaking-news/live`);
      const data = await response.json();
      results.tests.breakingNews = {
        status: response.status,
        success: response.ok,
        count: data.data?.length || 0,
        data: data
      };
    } catch (error: any) {
      results.tests.breakingNews = {
        error: error.message,
        success: false
      };
    }

    // Test categories
    try {
      const response = await fetch(`${apiUrl}/categories`);
      const data = await response.json();
      results.tests.categories = {
        status: response.status,
        success: response.ok,
        count: data.data?.length || 0
      };
    } catch (error: any) {
      results.tests.categories = {
        error: error.message,
        success: false
      };
    }

    setDebugInfo(results);
    setLoading(false);
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🔍 Debug Information
          <Button onClick={testEndpoints} disabled={loading} size="sm" variant="outline">
            {loading ? 'Testing...' : 'Refresh Tests'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
