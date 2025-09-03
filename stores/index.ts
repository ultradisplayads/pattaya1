// Export all stores
export { useAuthStore } from './auth-store';
export { useBookingStore } from './booking-store';
export { useDealsStore } from './deals-store';

// Export types for external use
export type { User } from './auth-store';
export type { CartItem, Booking } from './booking-store';
export type { Deal, DealsFilters } from './deals-store';
