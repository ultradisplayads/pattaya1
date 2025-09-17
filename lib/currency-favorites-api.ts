import { buildApiUrl } from './strapi-config';

export interface CurrencyFavorite {
  id: number;
  attributes: {
    currencyCode: string;
    currencyName: string;
    currencySymbol?: string;
    currencyFlag?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CurrencyTrending {
  id: number;
  attributes: {
    currencyCode: string;
    currencyName: string;
    currencySymbol?: string;
    currencyFlag?: string;
    rateToTHB: number;
    previousRateToTHB?: number;
    change24h: number;
    changePercent24h: number;
    trend: 'up' | 'down' | 'stable';
    rank: number;
    volume24h?: number;
    marketCap?: number;
    lastUpdated: string;
    dataSource: string;
    isActive: boolean;
  };
}

class CurrencyFavoritesAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = buildApiUrl('/currency-favorites');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CurrencyFavoritesAPI request failed:', error);
      throw error;
    }
  }

  // Get user's favorite currencies
  async getUserFavorites(token: string): Promise<CurrencyFavorite[]> {
    const response = await this.request<{ data: CurrencyFavorite[] }>('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Add currency to favorites
  async addToFavorites(
    currencyCode: string,
    currencyName: string,
    currencySymbol?: string,
    currencyFlag?: string,
    token?: string
  ): Promise<CurrencyFavorite> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.request<{ data: CurrencyFavorite }>('/add', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: {
          currencyCode,
          currencyName,
          currencySymbol,
          currencyFlag,
        },
      }),
    });
    return response.data;
  }

  // Remove currency from favorites
  async removeFromFavorites(currencyCode: string, token?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    await this.request(`/remove/${currencyCode}`, {
      method: 'DELETE',
      headers,
    });
  }

  // Update sort order of favorites
  async updateSortOrder(favorites: Array<{ id: number; sortOrder: number }>, token?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    await this.request('/sort', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        data: { favorites },
      }),
    });
  }
}

class CurrencyTrendingAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = buildApiUrl('/currency-trending');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CurrencyTrendingAPI request failed:', error);
      throw error;
    }
  }

  // Get all trending currencies
  async getTrendingCurrencies(limit: number = 50): Promise<CurrencyTrending[]> {
    const response = await this.request<{ data: CurrencyTrending[] }>(`/trending?limit=${limit}`);
    return response.data;
  }

  // Get specific currency trend
  async getCurrencyTrend(currencyCode: string): Promise<CurrencyTrending> {
    const response = await this.request<{ data: CurrencyTrending }>(`/trend/${currencyCode}`);
    return response.data;
  }
}

export const currencyFavoritesAPI = new CurrencyFavoritesAPI();
export const currencyTrendingAPI = new CurrencyTrendingAPI();

