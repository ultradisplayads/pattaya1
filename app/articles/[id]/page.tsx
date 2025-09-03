import { useStrapiArticle } from '@/hooks/use-strapi-articles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { transformStrapiArticle } from '@/lib/strapi-articles-api';
import { buildStrapiUrl } from '@/lib/strapi-config';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { article, loading, error } = useStrapiArticle(params.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h2 className="text-xl font-semibold mb-2">Article Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  {error || 'The article you are looking for does not exist.'}
                </p>
                <Link href="/news">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to News
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const transformedArticle = transformStrapiArticle(article);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/news">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to News
              </Button>
            </Link>
          </div>

          {/* Article */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-3xl font-bold leading-tight">
                    {transformedArticle.title}
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {transformedArticle.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {transformedArticle.author}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(transformedArticle.publishedAt), { addSuffix: true })}
                  </div>
                  {transformedArticle.category && (
                    <Badge variant="secondary">
                      {transformedArticle.category}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {transformedArticle.featuredImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={buildStrapiUrl(transformedArticle.featuredImage)}
                    alt={transformedArticle.imageAlt || transformedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {transformedArticle.description}
                </p>
                
                {transformedArticle.content && (
                  <div 
                    className="mt-6 prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: transformedArticle.content }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
