import { buildApiUrl } from './strapi-config';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRates {
  rates: Record<string, number>;
  timestamp: string;
  source: string;
  baseCurrency: string;
}

export interface ConversionResult {
  from: {
    currency: string;
    amount: number;
  };
  to: {
    currency: string;
    amount: number;
  };
  rate: number;
  timestamp: string;
  source: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
  timestamp: string;
}

export interface HistoricalData {
  currency: string;
  baseCurrency: string;
  history: HistoricalRate[];
  currentRate: number;
  period: string;
}

export interface CurrencyConverterSettings {
  enabled: boolean;
  defaultFromCurrency: string;
  defaultToCurrency: string;
  updateFrequencyMinutes: number;
  supportedCurrencies: string[];
  sponsoredEnabled: boolean;
  sponsorName?: string;
  sponsorLogo?: string;
}

class CurrencyAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = buildApiUrl('/currency-converter');
  }

  /**
   * Get current exchange rates
   */
  async getRates(): Promise<ExchangeRates> {
    try {
      const response = await fetch(`${this.baseUrl}/rates`, {
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
        throw new Error(data.error || 'Failed to fetch exchange rates');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  }

  /**
   * Convert currency
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
   * Get supported currencies
   */
  async getCurrencies(): Promise<Currency[]> {
    try {
      const response = await fetch(`${this.baseUrl}/currencies`, {
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

      return data.data.currencies;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  }

  /**
   * Get historical rates
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
        defaultFromCurrency: 'THB',
        defaultToCurrency: 'USD',
        updateFrequencyMinutes: 5,
        supportedCurrencies: ['THB', 'USD', 'EUR', 'GBP', 'JPY', 'KRW', 'SGD', 'MYR', 'IDR', 'PHP', 'VND', 'CNY', 'HKD', 'TWD', 'AUD', 'CAD', 'CHF', 'NZD', 'INR', 'RUB'],
        sponsoredEnabled: false
      };
    }
  }
}

export const currencyApi = new CurrencyAPI();
