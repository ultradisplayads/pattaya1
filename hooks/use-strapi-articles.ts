'use client';

import { useState, useEffect, useCallback } from 'react';
import { strapiArticlesApi, StrapiArticle, Author, Category, transformStrapiArticle } from '@/lib/strapi-articles-api';

export function useStrapiArticles() {
  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 25,
    pageCount: 0,
    total: 0
  });

  const fetchArticles = useCallback(async (params?: {
    page?: number;
    pageSize?: number;
    sort?: string;
    filters?: any;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await strapiArticlesApi.getArticles(params);
      console.log('Strapi API Response:', response);
      setArticles(response.data);
      setPagination(response.meta.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch articles');
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchArticles = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchArticles();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await strapiArticlesApi.searchArticles(query);
      setArticles(response.data);
      setPagination(response.meta.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to search articles');
    } finally {
      setLoading(false);
    }
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    pagination,
    fetchArticles,
    searchArticles,
  };
}

export function useStrapiAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await strapiArticlesApi.getAuthors();
      setAuthors(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch authors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return {
    authors,
    loading,
    error,
    fetchAuthors,
  };
}

export function useStrapiCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await strapiArticlesApi.getCategories();
      setCategories(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
  };
}

export function useStrapiArticle(id: string | number) {
  const [article, setArticle] = useState<StrapiArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await strapiArticlesApi.getArticle(id);
      setArticle(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    article,
    loading,
    error,
    fetchArticle,
  };
}
