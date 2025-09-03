import { BreakingNewsFeed } from "@/components/news/breaking-news-feed";

export default function BreakingNewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Breaking News</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest breaking news from multiple sources
            </p>
          </div>
          <BreakingNewsFeed />
        </div>
      </div>
    </div>
  );
}
