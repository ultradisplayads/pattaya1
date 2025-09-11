import { STRAPI_CONFIG } from './strapi-config'

// Strapi Article Types
export interface StrapiArticle {
  id: number
  attributes: {
    title: string
    slug: string
    description: string
    content?: string
    publishedAt: string
    createdAt: string
    updatedAt: string
    featuredImage?: {
      data?: {
        attributes: {
          url: string
          alternativeText?: string
          caption?: string
        }
      }
    }
    author?: {
      data?: {
        attributes: {
          name: string
          email?: string
          bio?: string
        }
      }
    }
    category?: {
      data?: {
        attributes: {
          name: string
          slug: string
          description?: string
        }
      }
    }
    tags?: {
      data?: Array<{
        attributes: {
          name: string
          slug: string
        }
      }>
    }
  }
}

export interface Author {
  id: number
  attributes: {
    name: string
    email?: string
    bio?: string
    avatar?: {
      data?: {
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    createdAt: string
    updatedAt: string
  }
}

export interface Category {
  id: number
  attributes: {
    name: string
    slug: string
    description?: string
    createdAt: string
    updatedAt: string
  }
}

export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiListResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Transformed Article Type (for frontend use)
export interface TransformedArticle {
  id: number
  title: string
  slug: string
  description: string
  content?: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  featuredImage?: string
  imageAlt?: string
  author?: string
  category?: string
  tags?: string[]
}

class StrapiArticlesAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = STRAPI_CONFIG.apiUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log('[StrapiArticlesAPI] Request', { url, method: config.method || 'GET' })
      const response = await fetch(url, config)
      const text = await response.text()
      let json: any = null
      try { 
        json = text ? JSON.parse(text) : null 
      } catch (parseError) {
        console.error('[StrapiArticlesAPI] JSON parse error:', parseError, 'Text:', text)
      }
      
      console.log('[StrapiArticlesAPI] Response', { url, status: response.status, ok: response.ok })
      
      if (!response.ok) {
        const errorData = json || {}
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return json as T
    } catch (error) {
      const err = error as any
      const message = err?.message || String(err)
      console.error('[StrapiArticlesAPI] Request failed', { url, method: config.method || 'GET', message, error: err })
      throw err
    }
  }

  // Get articles with pagination and filters
  async getArticles(params?: {
    page?: number
    pageSize?: number
    sort?: string
    filters?: any
  }): Promise<StrapiListResponse<StrapiArticle>> {
    let query = '/articles?populate=*'
    
    if (params?.page) {
      query += `&pagination[page]=${params.page}`
    }
    if (params?.pageSize) {
      query += `&pagination[pageSize]=${params.pageSize}`
    }
    if (params?.sort) {
      query += `&sort=${params.sort}`
    }
    
    // Add filters if provided
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query += `&filters[${key}][$eq]=${encodeURIComponent(String(value))}`
        }
      })
    }

    return this.request<StrapiListResponse<StrapiArticle>>(query)
  }

  // Get a single article by ID
  async getArticle(id: string | number): Promise<StrapiResponse<StrapiArticle>> {
    return this.request<StrapiResponse<StrapiArticle>>(`/articles/${id}?populate=*`)
  }

  // Search articles
  async searchArticles(query: string, params?: {
    page?: number
    pageSize?: number
  }): Promise<StrapiListResponse<StrapiArticle>> {
    let searchQuery = `/articles?populate=*&filters[$or][0][title][$containsi]=${encodeURIComponent(query)}&filters[$or][1][description][$containsi]=${encodeURIComponent(query)}&filters[$or][2][content][$containsi]=${encodeURIComponent(query)}`
    
    if (params?.page) {
      searchQuery += `&pagination[page]=${params.page}`
    }
    if (params?.pageSize) {
      searchQuery += `&pagination[pageSize]=${params.pageSize}`
    }

    return this.request<StrapiListResponse<StrapiArticle>>(searchQuery)
  }

  // Get articles by category
  async getArticlesByCategory(categorySlug: string, params?: {
    page?: number
    pageSize?: number
  }): Promise<StrapiListResponse<StrapiArticle>> {
    let query = `/articles?populate=*&filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}`
    
    if (params?.page) {
      query += `&pagination[page]=${params.page}`
    }
    if (params?.pageSize) {
      query += `&pagination[pageSize]=${params.pageSize}`
    }

    return this.request<StrapiListResponse<StrapiArticle>>(query)
  }

  // Get all authors
  async getAuthors(): Promise<StrapiListResponse<Author>> {
    return this.request<StrapiListResponse<Author>>('/authors?populate=*')
  }

  // Get all categories
  async getCategories(): Promise<StrapiListResponse<Category>> {
    return this.request<StrapiListResponse<Category>>('/categories')
  }

  // Get featured articles
  async getFeaturedArticles(limit: number = 5): Promise<StrapiListResponse<StrapiArticle>> {
    return this.request<StrapiListResponse<StrapiArticle>>(`/articles?populate=*&filters[featured][$eq]=true&pagination[pageSize]=${limit}&sort=publishedAt:desc`)
  }

  // Get latest articles
  async getLatestArticles(limit: number = 10): Promise<StrapiListResponse<StrapiArticle>> {
    return this.request<StrapiListResponse<StrapiArticle>>(`/articles?populate=*&pagination[pageSize]=${limit}&sort=publishedAt:desc`)
  }
}

// Transform Strapi article to frontend-friendly format
export function transformStrapiArticle(article: StrapiArticle): TransformedArticle {
  return {
    id: article.id,
    title: article.attributes.title,
    slug: article.attributes.slug,
    description: article.attributes.description,
    content: article.attributes.content,
    publishedAt: article.attributes.publishedAt,
    createdAt: article.attributes.createdAt,
    updatedAt: article.attributes.updatedAt,
    featuredImage: article.attributes.featuredImage?.data?.attributes?.url,
    imageAlt: article.attributes.featuredImage?.data?.attributes?.alternativeText,
    author: article.attributes.author?.data?.attributes?.name,
    category: article.attributes.category?.data?.attributes?.name,
    tags: article.attributes.tags?.data?.map(tag => tag.attributes.name) || []
  }
}

// Create and export the API instance
export const strapiArticlesApi = new StrapiArticlesAPI()
