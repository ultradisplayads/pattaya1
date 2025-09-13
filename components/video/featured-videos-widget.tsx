'use client';

import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Star, Eye, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchApprovedVideos, fetchPromotedVideos, formatViewCount, formatPublishedDate, getYouTubeEmbedUrl, getYouTubeWatchUrl } from '@/lib/videoApi';
import type { VideoData } from '@/lib/videoApi';

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

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        showBrowse && loadBrowseVideos(),
        showPromoted && loadPromotedVideos()
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
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
          : 'hover:shadow-md hover:transform hover:scale-102'
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
          <Play className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200" size={32} />
        </div>
        
        {/* Promoted badge */}
        {video.isPromoted && (
          <div className="absolute top-1 left-1">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center">
              <Star size={8} className="mr-0.5" />
              SPONSORED
            </span>
          </div>
        )}
        
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-1 right-1">
            <span className="bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
              {video.duration.replace('PT', '').replace('M', ':').replace('S', '')}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-2">
        <h3 className="font-semibold text-xs line-clamp-2 mb-1 leading-tight" title={video.title}>
          {video.title}
        </h3>
        
        {video.channelName && (
          <div className="flex items-center text-gray-600 text-xs mb-1 truncate">
            <User size={10} className="mr-1 flex-shrink-0" />
            <span className="truncate">{video.channelName}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <div className="flex items-center">
            <Eye size={10} className="mr-1" />
            <span className="text-xs">{formatViewCount(video.viewCount)}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={10} className="mr-1" />
            <span className="text-xs">{formatPublishedDate(video.publishedAt)}</span>
          </div>
        </div>
        
        {/* Sponsor info for promoted videos */}
        {video.isPromoted && video.sponsorName && (
          <div className="mt-1 pt-1 border-t border-gray-200">
            <div className="flex items-center text-xs text-blue-600">
              <span className="font-medium text-xs truncate">Sponsored by: {video.sponsorName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-300 rounded-lg mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header with tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-800">Featured Videos</h2>
          <div className="flex space-x-1">
            {showBrowse && (
              <button
                onClick={() => handleTabChange('browse')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'browse'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Browse
              </button>
            )}
            
            {showPromoted && (
              <button
                onClick={() => handleTabChange('promoted')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'promoted'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sponsored
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Main video player */}
        {selectedVideo && (
          <div className="mb-4">
            <div className="aspect-video rounded-lg overflow-hidden mb-2">
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
                <h3 className="text-sm font-semibold mb-1 line-clamp-2 leading-tight">{selectedVideo.title}</h3>
                {selectedVideo.description && (
                  <p className="text-gray-600 text-xs line-clamp-1 mb-1">{selectedVideo.description}</p>
                )}
                
                <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                  {selectedVideo.channelName && (
                    <div className="flex items-center">
                      <User size={12} className="mr-1" />
                      <span className="truncate max-w-24">{selectedVideo.channelName}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Eye size={12} className="mr-1" />
                    {formatViewCount(selectedVideo.viewCount)} views
                  </div>
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatPublishedDate(selectedVideo.publishedAt)}
                  </div>
                </div>
                
                {/* Sponsor info for promoted videos */}
                {selectedVideo.isPromoted && selectedVideo.sponsorName && (
                  <div className="mt-1 p-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded">
                    <div className="flex items-center text-xs text-orange-700">
                      <Star size={12} className="mr-1" />
                      <span className="font-medium">Sponsored by: {selectedVideo.sponsorName}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <a
                href={getYouTubeWatchUrl(selectedVideo.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
              >
                <ExternalLink size={12} className="mr-1" />
                YouTube
              </a>
            </div>
          </div>
        )}

        {/* Video grid */}
        {tabLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-video bg-gray-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-4">
            {getCurrentVideos().map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isSelected={selectedVideo?.id === video.id}
              />
            ))}
          </div>
        )}

        {/* Show video count for each tab */}
        <div className="text-center text-sm text-gray-500 mt-4">
          {activeTab === 'browse' && `Showing ${browseVideos.length} approved videos`}
          {activeTab === 'promoted' && `Showing ${promotedVideos.length} sponsored videos`}
        </div>
      </div>
    </div>
  );
};

export default FeaturedVideosWidget;
