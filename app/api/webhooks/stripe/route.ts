import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Check if Stripe is properly initialized
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please check your environment variables.' },
      { status: 500 }
    );
  }

  // Check if webhook secret is available
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook secret is not configured.' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Handle successful payment
        // You can create a booking here, send confirmation emails, etc.
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        
        // Handle failed payment
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { dealId, dealTitle, quantity } = paymentIntent.metadata;
  
  console.log('Processing successful payment:', {
    paymentIntentId: paymentIntent.id,
    dealId,
    dealTitle,
    quantity,
    amount: paymentIntent.amount,
  });

  // TODO: Create booking in your database
  // TODO: Send confirmation email
  // TODO: Update inventory
  // TODO: Send notifications
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { dealId, dealTitle } = paymentIntent.metadata;
  
  console.log('Processing failed payment:', {
    paymentIntentId: paymentIntent.id,
    dealId,
    dealTitle,
    lastPaymentError: paymentIntent.last_payment_error?.message,
  });

  // TODO: Send failure notification
  // TODO: Update payment status
  // TODO: Handle retry logic
}
