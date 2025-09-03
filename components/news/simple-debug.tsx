'use client';

import { useStrapiArticles } from '@/hooks/use-strapi-articles';
import { Card, CardContent } from '@/components/ui/card';

export function SimpleDebug() {
  const { articles, loading, error } = useStrapiArticles();
  
  return (
    <Card className="mb-4 bg-yellow-50 border-yellow-200">
      <CardContent className="p-4">
        <div className="text-sm">
          <p><strong>Hook Status:</strong></p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <p>Articles Count: {articles.length}</p>
          {articles.length > 0 && (
            <div className="mt-2">
              <p><strong>First Article:</strong></p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                {JSON.stringify(articles[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
