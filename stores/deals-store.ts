import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Deal {
  id: string;
  deal_title: string;
  slug: string;
  description: string;
  original_price: number;
  sale_price: number;
  deal_category: string;
  isActive: boolean;
  featured: boolean;
  views: number;
  clicks: number;
  conversions: number;
  expiry_date_time?: string;
  requires_reservation?: boolean;
  quantity_total?: number;
  quantity_remaining?: number;
  image_gallery?: Array<{
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  }>;
  business?: {
    name: string;
    address: string;
    rating?: number;
    reviewCount?: number;
    logo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DealsFilters {
  category?: string;
  business?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  active?: boolean;
  search?: string;
}

interface DealsState {
  // Data state
  deals: Deal[];
  filteredDeals: Deal[];
  currentDeal: Deal | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  
  // Pagination
  page: number;
  pageSize: number;
  total: number;
  
  // Filters
  filters: DealsFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Actions
  setDeals: (deals: Deal[]) => void;
  setCurrentDeal: (deal: Deal | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Filtering and sorting
  setFilters: (filters: Partial<DealsFilters>) => void;
  clearFilters: () => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotal: (total: number) => void;
  
  // Async actions
  fetchDeals: (filters?: Partial<DealsFilters>, page?: number) => Promise<void>;
  fetchDeal: (id: string) => Promise<void>;
  searchDeals: (query: string) => Promise<void>;
  refreshDeals: () => Promise<void>;
  
  // Utility actions
  getDealById: (id: string) => Deal | undefined;
  getDealsByCategory: (category: string) => Deal[];
  getFeaturedDeals: () => Deal[];
  getActiveDeals: () => Deal[];
  
  // Internal filtering method
  applyFilters: () => void;
}

const initialFilters: DealsFilters = {
  category: undefined,
  business: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  featured: false,
  active: true,
  search: undefined,
};

export const useDealsStore = create<DealsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      deals: [],
      filteredDeals: [],
      currentDeal: null,
      isLoading: false,
      error: null,
      hasMore: true,
      page: 1,
      pageSize: 20,
      total: 0,
      filters: initialFilters,
      sortBy: 'createdAt',
      sortOrder: 'desc',

      // Synchronous actions
      setDeals: (deals) => {
        set({ deals });
        get().applyFilters();
      },

      setCurrentDeal: (deal) => set({ currentDeal: deal }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      setFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        set({ filters: updatedFilters, page: 1 }); // Reset to first page when filters change
        get().applyFilters();
      },

      clearFilters: () => {
        set({ filters: initialFilters, page: 1 });
        get().applyFilters();
      },

      setSort: (sortBy, sortOrder) => {
        set({ sortBy, sortOrder });
        get().applyFilters();
      },

      setPage: (page) => set({ page }),

      setPageSize: (pageSize) => set({ pageSize, page: 1 }),

      setTotal: (total) => set({ total }),

      // Filtering logic
      applyFilters: () => {
        const { deals, filters, sortBy, sortOrder } = get();
        
        let filtered = [...deals];

        // Apply filters
        if (filters.category) {
          filtered = filtered.filter(deal => 
            deal.deal_category?.toLowerCase() === filters.category?.toLowerCase()
          );
        }

        if (filters.business) {
          filtered = filtered.filter(deal => 
            deal.business?.name?.toLowerCase().includes(filters.business?.toLowerCase() || '')
          );
        }

        if (filters.minPrice !== undefined) {
          filtered = filtered.filter(deal => deal.sale_price >= (filters.minPrice || 0));
        }

        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter(deal => deal.sale_price <= (filters.maxPrice || Infinity));
        }

        if (filters.featured) {
          filtered = filtered.filter(deal => deal.featured);
        }

        if (filters.active) {
          filtered = filtered.filter(deal => deal.isActive);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(deal =>
            deal.deal_title.toLowerCase().includes(searchLower) ||
            deal.description.toLowerCase().includes(searchLower) ||
            deal.business?.name.toLowerCase().includes(searchLower)
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let aValue: any = a[sortBy as keyof Deal];
          let bValue: any = b[sortBy as keyof Deal];

          // Handle nested properties
          if (sortBy === 'business.name') {
            aValue = a.business?.name;
            bValue = b.business?.name;
          }

          // Handle dates
          if (aValue && bValue && !isNaN(new Date(aValue).getTime())) {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          }

          // Handle numbers
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          }

          // Handle strings
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          return 0;
        });

        set({ filteredDeals: filtered });
      },

      // Async actions
      fetchDeals: async (filters = {}, page = 1) => {
        try {
          set({ isLoading: true, error: null });

          // Build query parameters
          const params = new URLSearchParams();
          params.append('page', page.toString());
          params.append('pageSize', get().pageSize.toString());
          
          if (filters.category) params.append('category', filters.category);
          if (filters.business) params.append('business', filters.business);
          if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
          if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
          if (filters.featured) params.append('featured', 'true');
          if (filters.active) params.append('active', 'true');
          if (filters.search) params.append('search', filters.search);

          const response = await fetch(`/api/deals?${params.toString()}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch deals');
          }

          const data = await response.json();
          
          if (page === 1) {
            // First page - replace deals
            set({ 
              deals: data.data || [], 
              total: data.meta?.pagination?.total || 0,
              hasMore: (data.meta?.pagination?.page || 1) < (data.meta?.pagination?.pageCount || 1)
            });
          } else {
            // Subsequent pages - append deals
            const currentDeals = get().deals;
            set({ 
              deals: [...currentDeals, ...(data.data || [])],
              hasMore: (data.meta?.pagination?.page || 1) < (data.meta?.pagination?.pageCount || 1)
            });
          }

          set({ page });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchDeal: async (id) => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch(`/api/deals/${id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch deal');
          }

          const data = await response.json();
          set({ currentDeal: data });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      searchDeals: async (query) => {
        if (!query.trim()) {
          get().clearFilters();
          return;
        }

        get().setFilters({ search: query });
        await get().fetchDeals({ search: query }, 1);
      },

      refreshDeals: async () => {
        await get().fetchDeals(get().filters, 1);
      },

      // Utility actions
      getDealById: (id) => {
        return get().deals.find(deal => deal.id === id);
      },

      getDealsByCategory: (category) => {
        return get().deals.filter(deal => 
          deal.deal_category?.toLowerCase() === category.toLowerCase()
        );
      },

      getFeaturedDeals: () => {
        return get().deals.filter(deal => deal.featured && deal.isActive);
      },

      getActiveDeals: () => {
        return get().deals.filter(deal => deal.isActive);
      },
    }),
    {
      name: 'deals-store',
    }
  )
);
