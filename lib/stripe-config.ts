import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with your publishable key
export const stripePromise = loadStripe(
  'pk_test_51Rwip8Ic8ZcBN40l7HtvyAQ1QRJJcxs5Aa0maYNAcLm7LQNYivv2QnP1okERrtLqzMDnnncim5DwYDFHM9MSoVvT00fLii70wy'
);

// Stripe configuration
export const stripeConfig = {
  currency: 'thb',
  locale: 'en',
  paymentMethodTypes: ['card'],
};