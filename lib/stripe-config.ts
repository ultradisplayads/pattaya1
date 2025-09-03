import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with your publishable key
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51H...' // Replace with your actual test key
);

// Stripe configuration
export const stripeConfig = {
  currency: 'thb',
  locale: 'en',
  paymentMethodTypes: ['card'],
};