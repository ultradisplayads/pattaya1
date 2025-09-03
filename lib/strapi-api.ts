import { STRAPI_CONFIG } from "./strapi-config"

export interface StrapiUser {
  id: number
  username: string
  email: string
  firebaseUid: string
  role: {
    name: string
    type: string
  }
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
}

export interface StrapiAuthResponse {
  user: StrapiUser
  message: string
}

export interface FirebaseUserProfilePayload {
  firebaseUid: string
  email?: string
  displayName?: string
  photoURL?: string
  phoneNumber?: string
  emailVerified?: boolean
}

export interface SponsoredPost {
  id: number
  attributes: {
    Title: string
    Content: string
    URL: string
    Sponsor: string
    CallToAction?: string
    Category?: string
    Active: boolean
    Priority: number
    Image?: {
      data?: {
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    SponsorLogo?: {
      data?: {
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    Logo?: {
      data?: {
        attributes: {
          url: string
          alternativeText?: string
        }
      }
    }
    PublishedTimestamp?: string
    ExpiryDate?: string
    TargetWidgets?: string[]
    impressions?: number
    clicks?: number
    clickThroughRate?: number
    SponsorshipType?: 'banner' | 'content' | 'mixed'
    DisplayText?: string
    SponsorWebsite?: string
    createdAt: string
    updatedAt: string
  }
}

export interface WidgetConfig {
  id: number
  attributes: {
    widgetId: string
    isSponsoredWidget: boolean
    sponsorName?: string
    sponsorBanner?: string
    sponsorLogo?: string
    sponsorUrl?: string
    displayText?: string
    sponsorshipType?: 'banner' | 'content' | 'mixed'
    createdAt: string
    updatedAt: string
  }
}

class StrapiAPI {
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
      console.log('[StrapiAPI] Request', { url, method: config.method || 'GET', headers: config.headers })
      const response = await fetch(url, config)
      const text = await response.text()
      let json: any = null
      try { json = text ? JSON.parse(text) : null } catch {}
      console.log('[StrapiAPI] Response', { url, status: response.status, ok: response.ok, body: json || text })
      
      if (!response.ok) {
        const errorData = json || {}
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return json as T
    } catch (error) {
      const err = error as any
      const message = err?.message || String(err)
      console.error('[StrapiAPI] Request failed', { url, method: config.method || 'GET', message, error: err })
      throw err
    }
  }

  // Register user in Strapi
  async registerUser(userData: {
    username: string
    email: string
    firebaseUid: string
    password?: string
  }): Promise<StrapiAuthResponse> {
    return this.request<StrapiAuthResponse>('/firebase-auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Login user in Strapi
  async loginUser(firebaseUid: string): Promise<StrapiAuthResponse> {
    return this.request<StrapiAuthResponse>('/firebase-auth/login', {
      method: 'POST',
      body: JSON.stringify({ firebaseUid }),
    })
  }

  // Get current user from Strapi
  async getCurrentUser(token: string): Promise<StrapiUser> {
    return this.request<StrapiUser>('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Get auth status via Firebase middleware (does not require Strapi JWT)
  async getAuthStatus(token: string): Promise<any> {
    return this.request('/test/auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Get server status
  async getServerStatus(): Promise<any> {
    return this.request('/test/status')
  }

  // Confirm user in Strapi after successful email OTP verification
  async confirmUser(email: string, token?: string): Promise<{ ok: boolean; message?: string }> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return this.request<{ ok: boolean; message?: string }>(
      '/firebase-auth/confirm',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ email }),
      }
    )
  }

  // Upsert Firebase user profile into Strapi (idempotent)
  async syncFirebaseUser(profile: FirebaseUserProfilePayload, token?: string): Promise<{ ok: boolean }> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return this.request<{ ok: boolean }>(
      '/firebase-auth/sync',
      {
        method: 'POST',
        headers,
        body: JSON.stringify(profile),
      }
    )
  }

  // Get sponsored posts
  async getSponsoredPosts(filters?: { active?: boolean; targetWidget?: string }): Promise<SponsoredPost[]> {
    let query = '/sponsored-posts?populate=*'
    
    if (filters?.active !== undefined) {
      query += `&filters[Active][$eq]=${filters.active}`
    }
    if (filters?.targetWidget) {
      query += `&filters[TargetWidgets][$contains]=${filters.targetWidget}`
    }
    
    const response = await this.request<{ data: SponsoredPost[] }>(query)
    return response.data
  }

  // Get widget configuration
  async getWidgetConfig(widgetId: string): Promise<WidgetConfig | null> {
    try {
      const response = await this.request<{ data: WidgetConfig[] }>(`/widget-configs?filters[widgetId][$eq]=${widgetId}`)
      return response.data[0] || null
    } catch (error) {
      console.error('Failed to fetch widget config:', error)
      return null
    }
  }

  // Update widget configuration
  async updateWidgetConfig(widgetId: string, config: Partial<WidgetConfig['attributes']>): Promise<WidgetConfig> {
    const existingConfig = await this.getWidgetConfig(widgetId)
    
    if (existingConfig) {
      return this.request<{ data: WidgetConfig }>(`/widget-configs/${existingConfig.id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: config }),
      }).then(response => response.data)
    } else {
      return this.request<{ data: WidgetConfig }>('/widget-configs', {
        method: 'POST',
        body: JSON.stringify({ data: { widgetId, ...config } }),
      }).then(response => response.data)
    }
  }

  // Track sponsored content analytics
  async trackSponsoredAnalytics(data: {
    type: 'impression' | 'click'
    sponsoredPostId: number
    timestamp: string
    userAgent?: string
    referrer?: string
  }): Promise<void> {
    await this.request('/sponsored-analytics', {
      method: 'POST',
      body: JSON.stringify({ data }),
    })
  }

  // Update sponsored post metrics
  async updateSponsoredMetrics(postId: number, type: 'impression' | 'click'): Promise<void> {
    const field = type === 'impression' ? 'impressions' : 'clicks'
    
    // Get current post to increment the counter
    const post = await this.request<{ data: SponsoredPost }>(`/sponsored-posts/${postId}`)
    const currentCount = post.data.attributes[field] || 0
    
    await this.request(`/sponsored-posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          [field]: currentCount + 1
        }
      }),
    })
  }
}

export const strapiAPI = new StrapiAPI() 