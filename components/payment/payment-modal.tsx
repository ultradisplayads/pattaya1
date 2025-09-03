'use client';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe-config';
import { StripePaymentForm } from './stripe-payment-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  dealId: string;
  dealTitle: string;
  onPaymentSuccess: (paymentResult: any) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  currency = 'thb',
  dealId,
  dealTitle,
  onPaymentSuccess,
  onPaymentError,
}: PaymentModalProps) {
  const handlePaymentSuccess = (paymentResult: any) => {
    onPaymentSuccess(paymentResult);
    // Don't close modal immediately, let user see success message
    // Modal will be closed when they click "Book Another Deal"
  };

  const handlePaymentError = (error: string) => {
    onPaymentError(error);
    // Don't close modal on error, let user see error and retry
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complete Your Booking</span>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogTitle>
          <DialogDescription>
            Secure payment for {dealTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              amount={amount}
              currency={currency}
              dealId={dealId}
              dealTitle={dealTitle}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </Elements>
        </div>
      </DialogContent>
    </Dialog>
  );
}
