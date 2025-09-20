/**
 * Search Tracking Utility
 * Tracks search queries for trending analysis
 */

interface SearchTrackingData {
  query: string;
  category?: string;
  source?: string;
  userAgent?: string;
  sessionId?: string;
  timestamp?: number;
}

interface TrackingResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

class SearchTracker {
  private sessionId: string;
  private isTrackingEnabled: boolean = true;
  private trackingQueue: SearchTrackingData[] = [];
  private isProcessing: boolean = false;
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    // Enable tracking in both development and production
    this.isTrackingEnabled = typeof window !== 'undefined';
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track a search query
   */
  async trackSearch(data: SearchTrackingData): Promise<TrackingResponse> {
    if (!this.isTrackingEnabled) {
      return { success: false, message: 'Tracking disabled' };
    }

    // Validate input
    if (!data.query || typeof data.query !== 'string' || data.query.trim().length === 0) {
      return { success: false, error: 'Invalid query' };
    }

    // Normalize query
    const normalizedQuery = data.query.trim().toLowerCase();
    
    // Skip very short queries
    if (normalizedQuery.length < 2) {
      return { success: false, message: 'Query too short' };
    }

    // Skip common words
    const skipWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
    if (skipWords.includes(normalizedQuery)) {
      return { success: false, message: 'Common word' };
    }

    // Track immediately for better real-time experience
    try {
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
      
      await this.sendTrackingRequest({
        ...data,
        query: normalizedQuery,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        userAgent
      });

      console.log('✅ Search tracked immediately:', normalizedQuery);
      return { success: true, message: 'Search tracked successfully' };
    } catch (error) {
      console.error('❌ Failed to track search immediately:', error);
      
      // Fallback to queue if immediate tracking fails
      this.trackingQueue.push({
        ...data,
        query: normalizedQuery,
        sessionId: this.sessionId,
        timestamp: Date.now()
      });

      // Process queue with shorter debounce
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.processTrackingQueue();
      }, 200); // Reduced to 200ms for faster fallback

      return { success: true, message: 'Search queued for retry' };
    }
  }

  /**
   * Process the tracking queue
   */
  private async processTrackingQueue(): Promise<void> {
    if (this.isProcessing || this.trackingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const queue = [...this.trackingQueue];
    this.trackingQueue = [];

    try {
      // Get user agent
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';

      // Process each item in the queue
      for (const item of queue) {
        try {
          await this.sendTrackingRequest({
            ...item,
            userAgent
          });
        } catch (error) {
          console.warn('Failed to track search query:', error);
        }
      }
    } catch (error) {
      console.error('Error processing tracking queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Send tracking request to backend
   */
  private async sendTrackingRequest(data: SearchTrackingData): Promise<void> {
    // Try to get API base from environment or use localhost for development
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 
                    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                      ? 'http://localhost:1337' 
                      : 'https://api.pattaya1.com');
    
    console.log('🔍 Sending search tracking request to:', `${API_BASE}/api/search-analytics/track`);
    console.log('📊 Tracking data:', {
      query: data.query,
      category: data.category || 'General',
      source: data.source || 'unknown'
    });
    
    const response = await fetch(`${API_BASE}/api/search-analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: data.query,
        category: data.category || 'General',
        source: data.source || 'unknown',
        userAgent: data.userAgent,
        sessionId: data.sessionId
      })
    });

    console.log('📡 Tracking response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Tracking request failed:', response.status, errorText);
      throw new Error(`Tracking request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Tracking response:', result);
    
    if (!result.success) {
      throw new Error(`Tracking failed: ${result.message || 'Unknown error'}`);
    }
  }

  /**
   * Track search with automatic source detection
   */
  async trackSearchQuery(query: string, options: {
    category?: string;
    source?: string;
    component?: string;
  } = {}): Promise<TrackingResponse> {
    const source = options.source || options.component || 'unknown';
    
    return this.trackSearch({
      query,
      category: options.category,
      source
    });
  }

  /**
   * Get trending topics
   */
  async getTrendingTopics(options: {
    limit?: number;
    category?: string;
    timeWindow?: string;
  } = {}): Promise<any> {
    try {
      // Use the same API base logic as tracking
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 
                      (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                        ? 'http://localhost:1337' 
                        : 'https://api.pattaya1.com');
      
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.category) params.append('category', options.category);
      if (options.timeWindow) params.append('timeWindow', options.timeWindow);

      console.log('🔥 Fetching trending topics from:', `${API_BASE}/api/search-analytics/trending?${params}`);

      const response = await fetch(`${API_BASE}/api/search-analytics/trending?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('📡 Trending response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to fetch trending topics:', response.status, errorText);
        throw new Error(`Failed to fetch trending topics: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Trending topics result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching trending topics:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Get analytics stats
   */
  async getAnalyticsStats(): Promise<any> {
    try {
      // Use the same API base logic as other functions
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 
                      (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                        ? 'http://localhost:1337' 
                        : 'https://api.pattaya1.com');
      
      console.log('📊 Fetching analytics stats from:', `${API_BASE}/api/search-analytics/stats`);
      
      const response = await fetch(`${API_BASE}/api/search-analytics/stats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('📡 Analytics stats response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to fetch analytics stats:', response.status, errorText);
        throw new Error(`Failed to fetch analytics stats: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Analytics stats result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching analytics stats:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Enable or disable tracking
   */
  setTrackingEnabled(enabled: boolean): void {
    this.isTrackingEnabled = enabled;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Clear tracking queue
   */
  clearQueue(): void {
    this.trackingQueue = [];
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Manually trigger trending calculation
   */
  async calculateTrending(): Promise<any> {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 
                      (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                        ? 'http://localhost:1337' 
                        : 'https://api.pattaya1.com');
      
      console.log('🎯 Triggering trending calculation at:', `${API_BASE}/api/search-analytics/calculate`);
      
      const response = await fetch(`${API_BASE}/api/search-analytics/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📡 Trending calculation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to trigger trending calculation:', response.status, errorText);
        throw new Error(`Failed to trigger trending calculation: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('🎯 Trending calculation result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error triggering trending calculation:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
}

// Create singleton instance
const searchTracker = new SearchTracker();

export default searchTracker;
export { SearchTracker, type SearchTrackingData, type TrackingResponse };
