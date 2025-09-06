import { NewsAggregator } from "@/components/widgets/news-aggregator"
import { BreakingNewsFeed } from "@/components/news/breaking-news-feed"
import { StrapiArticlesFeed } from "@/components/news/strapi-articles-feed"

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Pattaya News</h1>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Strapi Articles Feed */}
          <StrapiArticlesFeed showSponsored={true} maxArticles={10} />
          
          {/* Breaking News Feed */}
          <BreakingNewsFeed />
          
          {/* Existing News Aggregator */}
          <NewsAggregator theme="primary" />
        </div>
      </div>
    </div>
  )
}
