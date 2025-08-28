import { STRAPI_CONFIG } from "./firebase"

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
      console.error('[StrapiAPI] Request failed', { url, error })
      throw error
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
}

export const strapiAPI = new StrapiAPI() 