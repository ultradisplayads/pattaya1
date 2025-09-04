'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { stripePromise } from '@/lib/stripe-config';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { buildApiUrl } from '@/lib/strapi-config';

interface PaymentPageProps {
  params: {
    paymentIntentId: string;
  };
}

interface PaymentIntentData {
  clientSecret: string;
  amount: number;
  currency: string;
  dealTitle: string;
  dealId: string;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentForm({ paymentData }: { paymentData: PaymentIntentData }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Stripe has not loaded yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: 'Customer Name',
              email: 'customer@example.com',
            },
          },
        }
      );

      if (error) {
        setPaymentStatus('error');
        setErrorMessage(error.message || 'Payment failed');
        toast({
          title: "Payment Failed",
          description: error.message || 'Payment failed',
          variant: "destructive",
        });
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentStatus('success');
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed.",
          variant: "default",
        });
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push(`/payment-success?deal_id=${paymentData.dealId}`);
        }, 2000);
      }
    } catch (error: any) {
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Payment failed');
      toast({
        title: "Payment Error",
        description: error.message || 'Payment failed',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
        <Button onClick={() => router.push('/')}>
          Return to Home
        </Button>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="text-center py-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setPaymentStatus('idle')}>
            Try Again
          </Button>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="card-element">Card Details</Label>
          <div className="mt-2 p-3 border border-gray-300 rounded-md">
            <CardElement
              id="card-element"
              options={cardElementOptions}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Deal:</span>
            <span>{paymentData.dealTitle}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold">{formatCurrency(paymentData.amount, paymentData.currency)}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ${formatCurrency(paymentData.amount, paymentData.currency)}`
        )}
      </Button>
    </form>
  );
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<PaymentIntentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        // In a real app, you'd fetch this from your backend
        // For now, we'll simulate it with the payment intent ID
        const response = await fetch(('/api/create-payment-intent'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dealId: 'demo-deal',
            dealTitle: 'Demo Deal',
            amount: 2799,
            quantity: 1,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment data');
        }

        const data = await response.json();
        setPaymentData({
          clientSecret: data.clientSecret,
          amount: data.amount,
          currency: data.currency,
          dealTitle: 'Demo Deal',
          dealId: 'demo-deal',
        });
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load payment page",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading payment page...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Failed to load payment data'}</p>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Payment</CardTitle>
              <CardDescription>
                Secure payment for {paymentData.dealTitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <PaymentForm paymentData={paymentData} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
