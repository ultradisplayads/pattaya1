'use client';

import { useState, useEffect, useCallback } from 'react';
import { newsApi, NewsArticle, DashboardData } from '@/lib/news-api';

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsApi.getLiveNews();
      setArticles(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch news');
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const pinArticle = useCallback(async (id: string) => {
    try {
      await newsApi.pinArticle(id);
      await fetchLiveNews(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to pin article');
    }
  }, [fetchLiveNews]);

  const unpinArticle = useCallback(async (id: string) => {
    try {
      await newsApi.unpinArticle(id);
      await fetchLiveNews(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to unpin article');
    }
  }, [fetchLiveNews]);

  const voteArticle = useCallback(async (id: string, type: 'upvote' | 'downvote') => {
    try {
      if (type === 'upvote') {
        await newsApi.upvoteArticle(id);
      } else {
        await newsApi.downvoteArticle(id);
      }
      await fetchLiveNews(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to vote on article');
    }
  }, [fetchLiveNews]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      await newsApi.fetchNews();
      await fetchLiveNews(); // Refresh data after fetch
    } catch (err: any) {
      setError(err.message || 'Failed to fetch new articles');
    } finally {
      setLoading(false);
    }
  }, [fetchLiveNews]);

  useEffect(() => {
    fetchLiveNews();
  }, [fetchLiveNews]);

  return {
    articles,
    loading,
    error,
    fetchLiveNews,
    pinArticle,
    unpinArticle,
    voteArticle,
    fetchNews,
  };
}

export function useNewsDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardResponse, articlesResponse] = await Promise.all([
        newsApi.getDashboard(),
        newsApi.getAllNews()
      ]);
      setDashboard(dashboardResponse);
      setAllArticles(articlesResponse.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const moderateArticle = useCallback(async (id: string, action: 'approve' | 'reject' | 'hide') => {
    try {
      switch (action) {
        case 'approve':
          await newsApi.approveArticle(id);
          break;
        case 'reject':
          await newsApi.rejectArticle(id);
          break;
        case 'hide':
          await newsApi.hideArticle(id);
          break;
      }
      await fetchDashboard(); // Refresh data
    } catch (err: any) {
      setError(err.message || `Failed to ${action} article`);
    }
  }, [fetchDashboard]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    allArticles,
    loading,
    error,
    fetchDashboard,
    moderateArticle,
  };
}
