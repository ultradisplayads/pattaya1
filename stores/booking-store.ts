import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  dealId: string;
  dealTitle: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
  businessName?: string;
  specialRequests?: string;
  requiresReservation?: boolean;
  selectedDateTime?: string;
}

export interface Booking {
  id: string;
  dealId: string;
  dealTitle: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'redeemed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  quantity: number;
  totalAmount: number;
  bookingDateTime?: string;
  specialRequests?: string;
  confirmationCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingState {
  // Cart state
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  
  // Booking state
  currentBooking: Booking | null;
  userBookings: Booking[];
  isLoading: boolean;
  error: string | null;
  
  // Cart actions
  addToCart: (item: Omit<CartItem, 'id' | 'total'>) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  updateCartTotals: () => void;
  
  // Booking actions
  createBooking: (cartItems: CartItem[]) => Promise<Booking[]>;
  confirmPayment: (bookingId: string, paymentIntentId: string) => Promise<void>;
  fetchUserBookings: () => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      cartItems: [],
      cartTotal: 0,
      cartCount: 0,
      currentBooking: null,
      userBookings: [],
      isLoading: false,
      error: null,

      // Cart actions
      addToCart: (item) => {
        const { cartItems } = get();
        const existingItem = cartItems.find(cartItem => cartItem.dealId === item.dealId);
        
        if (existingItem) {
          // Update existing item
          const updatedItems = cartItems.map(cartItem =>
            cartItem.dealId === item.dealId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity, total: (cartItem.quantity + item.quantity) * cartItem.price }
              : cartItem
          );
          set({ cartItems: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            ...item,
            id: `${item.dealId}-${Date.now()}`,
            total: item.quantity * item.price,
          };
          set({ cartItems: [...cartItems, newItem] });
        }
        
        get().updateCartTotals();
      },

      removeFromCart: (id) => {
        const { cartItems } = get();
        const updatedItems = cartItems.filter(item => item.id !== id);
        set({ cartItems: updatedItems });
        get().updateCartTotals();
      },

      updateCartItem: (id, updates) => {
        const { cartItems } = get();
        const updatedItems = cartItems.map(item =>
          item.id === id ? { ...item, ...updates, total: (updates.quantity || item.quantity) * item.price } : item
        );
        set({ cartItems: updatedItems });
        get().updateCartTotals();
      },

      clearCart: () => {
        set({ cartItems: [], cartTotal: 0, cartCount: 0 });
      },

      updateCartItemQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        get().updateCartItem(id, { quantity });
      },

      updateCartTotals: () => {
        const { cartItems } = get();
        const total = cartItems.reduce((sum, item) => sum + item.total, 0);
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        set({ cartTotal: total, cartCount: count });
      },

      // Booking actions
      createBooking: async (cartItems) => {
        try {
          set({ isLoading: true, error: null });
          
          const token = localStorage.getItem('jwt');
          if (!token) throw new Error('Authentication required');

          const bookings: Booking[] = [];
          
          for (const item of cartItems) {
            const response = await fetch(`/api/deals/${item.dealId}/purchase`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                quantity: item.quantity,
                special_requests: item.specialRequests,
                booking_date_time: item.selectedDateTime,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to create booking');
            }

            const { booking } = await response.json();
            bookings.push(booking);
          }

          // Clear cart after successful booking creation
          get().clearCart();
          
          set({ currentBooking: bookings[0] || null });
          return bookings;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      confirmPayment: async (bookingId, paymentIntentId) => {
        try {
          set({ isLoading: true, error: null });
          
          const token = localStorage.getItem('jwt');
          if (!token) throw new Error('Authentication required');

          const response = await fetch(`/api/bookings/${bookingId}/confirm-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ payment_intent_id: paymentIntentId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Payment confirmation failed');
          }

          // Update local booking state
          const { userBookings } = get();
          const updatedBookings = userBookings.map(booking =>
            booking.id === bookingId
              ? { ...booking, status: 'confirmed' as const, paymentStatus: 'paid' as const }
              : booking
          );
          set({ userBookings: updatedBookings });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUserBookings: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const token = localStorage.getItem('jwt');
          if (!token) throw new Error('Authentication required');

          const response = await fetch('/api/bookings/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch bookings');
          }

          const bookings = await response.json();
          set({ userBookings: bookings });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      cancelBooking: async (bookingId) => {
        try {
          set({ isLoading: true, error: null });
          
          const token = localStorage.getItem('jwt');
          if (!token) throw new Error('Authentication required');

          const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to cancel booking');
          }

          // Update local booking state
          const { userBookings } = get();
          const updatedBookings = userBookings.map(booking =>
            booking.id === bookingId
              ? { ...booking, status: 'cancelled' as const }
              : booking
          );
          set({ userBookings: updatedBookings });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Utility actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        cartCount: state.cartCount,
      }),
    }
  )
);
