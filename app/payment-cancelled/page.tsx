'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, ArrowLeft } from 'lucide-react';

export default function PaymentCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Payment Cancelled
            </CardTitle>
            <CardDescription className="text-lg">
              Your payment was not completed
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">No Charges Made</h3>
              <p className="text-red-700 text-sm">
                Your payment was cancelled and no charges were made to your account.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => router.back()}
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
