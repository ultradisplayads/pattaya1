'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Receipt } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dealId = searchParams.get('deal_id');
  const [dealTitle, setDealTitle] = useState('Your Deal');

  useEffect(() => {
    // You can fetch deal details here if needed
    if (dealId) {
      // Fetch deal details from your API
      // setDealTitle(deal.title);
    }
  }, [dealId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg">
              Thank you for your purchase
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Booking Confirmed</h3>
              <p className="text-green-700 text-sm">
                Your {dealTitle} has been successfully booked. You will receive a confirmation email shortly.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/')}
                className="w-full"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.print()}
                className="w-full"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Booking ID: {dealId || 'N/A'}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-auto px-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
