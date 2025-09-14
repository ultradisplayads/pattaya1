'use client';

import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Star, Eye, Calendar, User, ChevronLeft, ChevronRight, TrendingUp, Hash } from 'lucide-react';
import { fetchApprovedVideos, fetchPromotedVideos, formatViewCount, formatPublishedDate, getYouTubeEmbedUrl, getYouTubeWatchUrl } from '@/lib/videoApi';
import type { VideoData } from '@/lib/videoApi';

interface TrendingTopic {
  topic: string;
  count: number;
  totalViews: number;
  engagementScore: number;
  latestVideo?: {
    id: string;
    title: string;
    videoId: string;
    thumbnailUrl: string;
  } | null;
}

interface FeaturedVideosWidgetProps {
  showBrowse?: boolean;
  showPromoted?: boolean;
  maxVideos?: number;
  autoPlay?: boolean;
  className?: string;
}

const FeaturedVideosWidget: React.FC<FeaturedVideosWidgetProps> = ({
  showBrowse = true,
  showPromoted = true,
  maxVideos = 6,
  autoPlay = false,
  className = ""
}) => {
  const [promotedVideos, setPromotedVideos] = useState<VideoData[]>([]);
  const [browseVideos, setBrowseVideos] = useState<VideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'promoted'>('browse');
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [showTrending, setShowTrending] = useState(false);


  // Fetch all approved videos for browsing
  const loadBrowseVideos = async () => {
    try {
      // Fetch all videos by using a large page size
      const response = await fetchApprovedVideos({ page: 1, pageSize: 100 });
      
      if (response.success) {
        setBrowseVideos(response.data);
        if (response.meta) {
          setTotalPages(response.meta.totalPages);
        }
        // Set first video as selected if none selected
        if (response.data.length > 0 && !selectedVideo) {
          setSelectedVideo(response.data[0]);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch browse videos');
      }
    } catch (err) {
      console.error('Error fetching browse videos:', err);
      setError('Failed to load browse videos');
    }
  };

  // Fetch promoted videos
  const loadPromotedVideos = async () => {
    try {
      const response = await fetchPromotedVideos();
      
      if (response.success) {
        setPromotedVideos(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch promoted videos');
      }
    } catch (err) {
      console.error('Error fetching promoted videos:', err);
    }
  };

  // Fetch trending topics
  const loadTrendingTopics = async () => {
    try {
      const response = await fetch('/api/videos/trending?limit=8');
      const data = await response.json();
      
      if (data.success) {
        setTrendingTopics(data.data);
      } else {
        throw new Error('Failed to fetch trending topics');
      }
    } catch (err) {
      console.error('Error fetching trending topics:', err);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        showBrowse && loadBrowseVideos(),
        showPromoted && loadPromotedVideos(),
        loadTrendingTopics()
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const handleVideoSelect = (video: VideoData) => {
    setSelectedVideo(video);
  };

  const handleTabChange = async (tab: 'browse' | 'promoted') => {
    setActiveTab(tab);
    setTabLoading(true);
    
    try {
      if (tab === 'browse' && browseVideos.length === 0) {
        await loadBrowseVideos();
      }
      if (tab === 'promoted' && promotedVideos.length === 0) {
        await loadPromotedVideos();
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
    } finally {
      setTabLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadBrowseVideos();
  };

  const getCurrentVideos = () => {
    switch (activeTab) {
      case 'browse':
        return browseVideos;
      case 'promoted':
        return promotedVideos;
      default:
        return browseVideos;
    }
  };

  const VideoCard: React.FC<{ video: VideoData; isSelected?: boolean }> = ({ video, isSelected }) => (
    <div
      className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 bg-white/80 backdrop-blur-sm border border-white/60 ${
        isSelected 
          ? 'ring-2 ring-purple-500 shadow-xl transform scale-105' 
          : 'hover:shadow-lg hover:transform hover:scale-[1.02] hover:bg-white/90'
      }`}
      onClick={() => handleVideoSelect(video)}
    >
      <div className="relative aspect-video">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-95 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 shadow-lg">
            <Play className="text-purple-500 fill-current" size={20} />
          </div>
        </div>
        
        {/* Promoted badge */}
        {video.isPromoted && (
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-medium rounded-xl shadow-sm">
              <Star size={10} />
              <span>SPONSORED</span>
            </div>
          </div>
        )}
        
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-xl font-medium">
              {video.duration.replace('PT', '').replace('M', ':').replace('S', '')}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 leading-tight text-gray-900" title={video.title}>
          {video.title}
        </h3>
        
        {video.channelName && (
          <div className="flex items-center gap-1.5 mb-2">
            <User size={12} className="text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-600 font-medium truncate">{video.channelName}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-sm">
            <Eye size={10} className="text-gray-500" />
            <span className="font-medium text-gray-600">{formatViewCount(video.viewCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-sm">
            <Calendar size={10} className="text-blue-500" />
            <span className="font-medium text-blue-600">{formatPublishedDate(video.publishedAt)}</span>
          </div>
        </div>
        
        {/* Sponsor info for promoted videos */}
        {video.isPromoted && video.sponsorName && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center text-xs text-orange-600">
              <span className="font-semibold truncate">Sponsored by: {video.sponsorName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border-0 overflow-hidden ${className}`}>
        <div className="bg-white border-b border-gray-100/60 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-2xl">
              <div className="h-6 w-6 bg-red-500/20 rounded-lg"></div>
            </div>
            <div className="h-6 bg-gray-100 rounded-xl w-40"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="aspect-video bg-gray-100 rounded-2xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-video bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border-0 overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="text-center text-red-600">
            <div className="p-6 bg-red-50 rounded-2xl mb-4">
              <div className="h-16 w-16 bg-red-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
            </div>
            <p className="text-lg font-semibold mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl shadow-lg border-0 overflow-hidden ${className}`}>
      {/* Apple-style Header with tabs */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Featured Videos</h2>
              <p className="text-sm text-purple-100 font-medium">Discover trending content</p>
            </div>
          </div>
          <div className="flex gap-2">
            {showBrowse && (
              <button
                onClick={() => handleTabChange('browse')}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === 'browse'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                Browse
              </button>
            )}
            
            {showPromoted && (
              <button
                onClick={() => handleTabChange('promoted')}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === 'promoted'
                    ? 'bg-white text-orange-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                Sponsored
              </button>
            )}

            <button
              onClick={() => {
                console.log('Trending button clicked, current state:', showTrending);
                setShowTrending(!showTrending);
                console.log('Trending state should now be:', !showTrending);
              }}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                showTrending
                  ? 'bg-white text-green-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <TrendingUp size={16} className="inline mr-1.5" />
              Trending
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100/50">
        {/* Main video player */}
        {selectedVideo && (
          <div className="mb-6">
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.videoId, autoPlay)}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 leading-tight text-gray-900">{selectedVideo.title}</h3>
                {selectedVideo.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{selectedVideo.description}</p>
                )}
                
                <div className="flex items-center flex-wrap gap-3 text-sm">
                  {selectedVideo.channelName && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-sm">
                      <User size={14} className="text-gray-600" />
                      <span className="font-medium text-gray-700">{selectedVideo.channelName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-sm">
                    <Eye size={14} className="text-blue-600" />
                    <span className="font-medium text-blue-700">{formatViewCount(selectedVideo.viewCount)} views</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow-sm">
                    <Calendar size={14} className="text-green-600" />
                    <span className="font-medium text-green-700">{formatPublishedDate(selectedVideo.publishedAt)}</span>
                  </div>
                </div>
                
                {/* Sponsor info for promoted videos */}
                {selectedVideo.isPromoted && selectedVideo.sponsorName && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-2xl shadow-sm">
                    <div className="flex items-center text-sm text-orange-700">
                      <Star size={16} className="mr-2" />
                      <span className="font-semibold">Sponsored by: {selectedVideo.sponsorName}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <a
                href={getYouTubeWatchUrl(selectedVideo.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ExternalLink size={14} />
                YouTube
              </a>
            </div>
          </div>
        )}

        {/* Video grid */}
        {tabLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-video bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {getCurrentVideos().map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isSelected={selectedVideo?.id === video.id}
              />
            ))}
          </div>
        )}

        {/* Trending Topics Section */}
        {showTrending && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 rounded-2xl border border-emerald-200/60 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-sm">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
                <p className="text-sm text-gray-600 font-medium">{trendingTopics.length} topics found</p>
              </div>
            </div>
            
            {trendingTopics.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-white/70 rounded-2xl mb-4 shadow-sm">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
                </div>
                <p className="text-gray-600 font-medium">Loading trending topics...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={topic.topic}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                    onClick={() => {
                      // You can implement topic-based filtering here
                      console.log('Clicked topic:', topic.topic);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-emerald-500" />
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {topic.topic}
                        </span>
                      </div>
                      <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-sm">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span className="font-semibold">{topic.count} videos</span>
                      <span className="font-semibold">{formatViewCount(topic.totalViews)} views</span>
                    </div>
                    
                    {/* Engagement indicator */}
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 h-2 rounded-full transition-all duration-300 group-hover:from-emerald-500 group-hover:via-teal-500 group-hover:to-cyan-600 shadow-sm"
                          style={{ 
                            width: `${Math.min(100, (topic.engagementScore / Math.max(...trendingTopics.map(t => t.engagementScore))) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <button
                onClick={loadTrendingTopics}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Refresh Trending Topics
              </button>
            </div>
          </div>
        )}

        {/* Show video count for each tab */}
        <div className="text-center text-sm text-gray-500 mt-4">
          {activeTab === 'browse' && `Showing ${browseVideos.length} approved videos`}
          {activeTab === 'promoted' && `Showing ${promotedVideos.length} sponsored videos`}
          {showTrending && (
            <div className="mt-1 text-xs text-green-600">
              {trendingTopics.length} trending topics found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedVideosWidget;
