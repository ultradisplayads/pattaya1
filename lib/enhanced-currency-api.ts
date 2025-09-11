import { buildApiUrl } from './strapi-config';

export interface EnhancedCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  region: string;
  isPopular?: boolean;
  isCrypto?: boolean;
}

export interface ExchangeRates {
  rates: Record<string, number>;
  timestamp: string;
  source: string;
  baseCurrency: string;
  trending?: TrendingCurrency[];
  lastUpdated: string;
}

export interface ConversionResult {
  from: {
    currency: string;
    amount: number;
    symbol: string;
  };
  to: {
    currency: string;
    amount: number;
    symbol: string;
  };
  rate: number;
  timestamp: string;
  source: string;
  change24h?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface TrendingCurrency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  rate: number;
  change24h: number;
  trend: 'up' | 'down' | 'stable';
  volume?: number;
  rank: number;
}

export interface HistoricalRate {
  date: string;
  rate: number;
  timestamp: string;
  change?: number;
}

export interface HistoricalData {
  currency: string;
  baseCurrency: string;
  history: HistoricalRate[];
  currentRate: number;
  period: string;
  symbol: string;
  flag: string;
}

export interface CurrencyListResponse {
  currencies: EnhancedCurrency[];
  total: number;
  baseCurrency: string;
  lastUpdated: string;
  regions: string[];
}

export interface CurrencyConverterSettings {
  enabled: boolean;
  defaultFromCurrency: string;
  defaultToCurrency: string;
  updateFrequencyMinutes: number;
  supportedCurrencies: string[];
  sponsoredEnabled: boolean;
  regions: string[];
  popularCurrencies: string[];
  lastUpdated: string;
}

class EnhancedCurrencyAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = buildApiUrl('/currency-converter');
  }

  /**
   * Get current exchange rates with trending data
   */
  async getRates(): Promise<ExchangeRates> {
    try {
      const response = await fetch(`${this.baseUrl}/rates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 120 } // Cache for 2 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch exchange rates');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  }

  /**
   * Convert currency with enhanced result
   */
  async convert(from: string, to: string, amount: number): Promise<ConversionResult> {
    try {
      const params = new URLSearchParams({
        from,
        to,
        amount: amount.toString()
      });

      const response = await fetch(`${this.baseUrl}/convert?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to convert currency');
      }

      return data.data;
    } catch (error) {
      console.error('Error converting currency:', error);
      throw error;
    }
  }

  /**
   * Get supported currencies with filtering options
   */
  async getCurrencies(options?: {
    search?: string;
    region?: string;
    popular?: boolean;
  }): Promise<CurrencyListResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.search) params.append('search', options.search);
      if (options?.region) params.append('region', options.region);
      if (options?.popular) params.append('popular', 'true');

      const response = await fetch(`${this.baseUrl}/currencies?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch currencies');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  }

  /**
   * Get trending currencies
   */
  async getTrending(): Promise<TrendingCurrency[]> {
    try {
      const response = await fetch(`${this.baseUrl}/trending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch trending currencies');
      }

      return data.data.trending;
    } catch (error) {
      console.error('Error fetching trending currencies:', error);
      throw error;
    }
  }

  /**
   * Get historical rates with enhanced data
   */
  async getHistory(currency: string, days: number = 7): Promise<HistoricalData> {
    try {
      const params = new URLSearchParams({
        currency,
        days: days.toString()
      });

      const response = await fetch(`${this.baseUrl}/history?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 1800 } // Cache for 30 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch historical rates');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching historical rates:', error);
      throw error;
    }
  }

  /**
   * Get widget settings
   */
  async getSettings(): Promise<CurrencyConverterSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 1800 } // Cache for 30 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch settings');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Return default settings if API fails
      return {
        enabled: true,
        defaultFromCurrency: 'USD',
        defaultToCurrency: 'THB',
        updateFrequencyMinutes: 2,
        supportedCurrencies: ['THB', 'USD', 'EUR', 'GBP', 'JPY', 'KRW', 'SGD', 'MYR', 'IDR', 'PHP', 'VND', 'CNY', 'HKD', 'TWD', 'AUD', 'CAD', 'CHF', 'NZD', 'INR', 'RUB'],
        sponsoredEnabled: false,
        regions: ['Asia', 'Europe', 'North America', 'Oceania', 'South America', 'Africa', 'Middle East'],
        popularCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'AUD', 'CAD', 'KRW', 'INR'],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Search currencies
   */
  async searchCurrencies(query: string): Promise<EnhancedCurrency[]> {
    try {
      const response = await this.getCurrencies({ search: query });
      return response.currencies;
    } catch (error) {
      console.error('Error searching currencies:', error);
      return [];
    }
  }

  /**
   * Get currencies by region
   */
  async getCurrenciesByRegion(region: string): Promise<EnhancedCurrency[]> {
    try {
      const response = await this.getCurrencies({ region });
      return response.currencies;
    } catch (error) {
      console.error('Error fetching currencies by region:', error);
      return [];
    }
  }

  /**
   * Get popular currencies
   */
  async getPopularCurrencies(): Promise<EnhancedCurrency[]> {
    try {
      const response = await this.getCurrencies({ popular: true });
      return response.currencies;
    } catch (error) {
      console.error('Error fetching popular currencies:', error);
      return [];
    }
  }
}

export const enhancedCurrencyApi = new EnhancedCurrencyAPI();
