import { NewsAdminDashboard } from "@/components/news/news-admin-dashboard";

export default function NewsAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">News Administration</h1>
            <p className="text-muted-foreground">
              Manage breaking news articles, moderation, and sources
            </p>
          </div>
          <NewsAdminDashboard />
        </div>
      </div>
    </div>
  );
}
