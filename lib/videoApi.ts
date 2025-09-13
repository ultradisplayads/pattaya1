interface VideoData {
  id: string;
  videoId: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  channelName?: string;
  publishedAt?: string;
  viewCount?: number;
  duration?: string;
  isPromoted?: boolean;
  sponsorName?: string;
  sponsorLogo?: string;
  promotionEndDate?: string;
}

interface ApiResponse {
  success: boolean;
  data: VideoData[];
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
}

interface DisplaySetParams {
  ids: string[];
}

interface BrowseVideosParams {
  page?: number;
  pageSize?: number;
}

// Fetch videos from Strapi API
export const fetchVideos = async ({ page = 1, pageSize = 12, status = 'active' }: { page?: number; pageSize?: number; status?: string }) => {
  try {
    const response = await fetch(`/api/videos?page=${page}&pageSize=${pageSize}&status=${status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { success: false, error: 'Failed to fetch videos' };
  }
};

// Fetch curated videos for display set (using main videos endpoint)
export const fetchDisplaySetVideos = async ({ ids }: { ids: string[] }) => {
  try {
    // Fetch all active videos and filter by IDs if needed
    const response = await fetchVideos({ pageSize: 100 });
    
    if (response.success && ids.length > 0) {
      // Filter videos by provided IDs if specified
      const filteredVideos = response.data.filter((video: VideoData) => 
        ids.includes(video.videoId)
      );
      return {
        ...response,
        data: filteredVideos.length > 0 ? filteredVideos : response.data.slice(0, 6)
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching display set videos:', error);
    return { success: false, error: 'Failed to fetch display set videos' };
  }
};

// Fetch approved videos for browsing (using main videos endpoint)
export const fetchApprovedVideos = async ({ page = 1, pageSize = 12 }: { page?: number; pageSize?: number }) => {
  try {
    const response = await fetchVideos({ page, pageSize, status: 'active' });
    return response;
  } catch (error) {
    console.error('Error fetching approved videos:', error);
    return { success: false, error: 'Failed to fetch approved videos' };
  }
};

// Fetch promoted videos (filter from main videos endpoint)
export const fetchPromotedVideos = async () => {
  try {
    const response = await fetchVideos({ pageSize: 100 });
    
    if (response.success) {
      // Filter only promoted videos
      const promotedVideos = response.data.filter((video: VideoData) => video.isPromoted);
      return {
        ...response,
        data: promotedVideos
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching promoted videos:', error);
    return { success: false, error: 'Failed to fetch promoted videos' };
  }
};

/**
 * Utility function to get YouTube embed URL
 */
export const getYouTubeEmbedUrl = (videoId: string, autoplay: boolean = false): string => {
  const params = new URLSearchParams();
  if (autoplay) params.append('autoplay', '1');
  params.append('rel', '0'); // Don't show related videos from other channels
  params.append('modestbranding', '1'); // Reduce YouTube branding
  
  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
};

/**
 * Utility function to get YouTube watch URL
 */
export const getYouTubeWatchUrl = (videoId: string): string => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Utility function to get YouTube thumbnail URL with different qualities
 */
export const getYouTubeThumbnailUrl = (videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string => {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg', 
    high: 'hqdefault.jpg',
    standard: 'sddefault.jpg',
    maxres: 'maxresdefault.jpg'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
};

/**
 * Format view count for display
 */
export const formatViewCount = (count?: number): string => {
  if (!count) return 'N/A';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

/**
 * Format duration from seconds to MM:SS or HH:MM:SS format
 */
export const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format date for display
 */
export const formatPublishedDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Check if a video is currently promoted
 */
export const isVideoPromoted = (video: VideoData): boolean => {
  if (!video.isPromoted) return false;
  
  // Check if promotion has expired
  if (video.promotionEndDate) {
    const endDate = new Date(video.promotionEndDate);
    const now = new Date();
    return now <= endDate;
  }
  
  return true;
};

/**
 * Sort videos with promoted content first
 */
export const sortVideosWithPromotedFirst = (videos: VideoData[]): VideoData[] => {
  return [...videos].sort((a, b) => {
    const aPromoted = isVideoPromoted(a);
    const bPromoted = isVideoPromoted(b);
    
    if (aPromoted && !bPromoted) return -1;
    if (!aPromoted && bPromoted) return 1;
    return 0;
  });
};

export type { VideoData, ApiResponse, DisplaySetParams, BrowseVideosParams };
