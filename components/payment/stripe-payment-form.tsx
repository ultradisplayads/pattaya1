'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  dealId: string;
  dealTitle: string;
  onPaymentSuccess: (paymentResult: any) => void;
  onPaymentError: (error: string) => void;
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

export function StripePaymentForm({
  amount,
  currency = 'thb',
  dealId,
  dealTitle,
  onPaymentSuccess,
  onPaymentError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

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
      // First, create a booking and get payment intent from our backend
      const response = await fetch(`/api/deals/${dealId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
        },
        body: JSON.stringify({
          quantity,
          special_requests: specialRequests,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { payment, booking } = await response.json();

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        payment.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: 'Customer Name', // You can get this from user profile
              email: 'customer@example.com', // You can get this from user profile
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful, confirm with our backend
        const confirmResponse = await fetch(`/api/deals/${dealId}/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt') || ''}`,
          },
          body: JSON.stringify({
            payment_intent_id: payment.payment_intent_id,
          }),
        });

        if (!confirmResponse.ok) {
          throw new Error('Payment confirmed with Stripe but failed to confirm with our system');
        }

        setPaymentStatus('success');
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed.",
          variant: "default",
        });

        onPaymentSuccess({
          paymentIntent,
          booking,
          amount: payment.amount,
        });
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error: any) {
      setPaymentStatus('error');
      setErrorMessage(error.message);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      onPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const totalAmount = amount * quantity;

  if (paymentStatus === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Book Another Deal
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">Payment Failed</h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <Button 
            onClick={() => setPaymentStatus('idle')} 
            variant="outline"
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>
          Secure payment powered by Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Deal Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{dealTitle}</h4>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Price per unit:</span>
              <span>{formatAmount(amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium text-gray-900">
                <span>Total:</span>
                <span>{formatAmount(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Quantity and Special Requests */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="special-requests">Special Requests (Optional)</Label>
              <Input
                id="special-requests"
                placeholder="Any special requirements..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Card Element */}
          <div>
            <Label>Card Details</Label>
            <div className="mt-1 p-3 border rounded-md bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ${formatAmount(totalAmount)}`
            )}
          </Button>

          {/* Security Notice */}
          <p className="text-xs text-gray-500 text-center">
            🔒 Your payment information is secure and encrypted. We never store your card details.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
