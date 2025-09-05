'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from './countdown-timer';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore, useBookingStore } from '@/stores';
import { stripePromise } from '@/lib/stripe-config';
import { Calendar, MapPin, Star, ShoppingCart, Clock, Heart, Share2 } from 'lucide-react';

interface DealCardProps {
  deal: {
    id: string;
    deal_title: string;
    description: string;
    original_price: number;
    sale_price: number;
    deal_category: string;
    slug: string;
    isActive: boolean;
    featured: boolean;
    views: number;
    clicks: number;
    conversions: number;
    expiry_date_time?: string;
    requires_reservation?: boolean;
    business?: {
      name: string;
      address: string;
    };
    image_gallery?: any[];
  };
  showCountdown?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export function DealCard({ 
  deal, 
  showCountdown = true, 
  showActions = true,
  variant = 'default'
}: DealCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  
  // Store hooks
  const { isAuthenticated } = useAuthStore();
  const { addToCart, cartItems } = useBookingStore();

  const discountPercentage = Math.round(((deal.original_price - deal.sale_price) / deal.original_price) * 100);
  const savings = deal.original_price - deal.sale_price;
  const isInCart = cartItems.some(item => item.dealId === deal.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const handleBookNow = () => {
    if (!deal.isActive) {
      toast({
        title: "Deal Unavailable",
        description: "This deal is currently not available for booking.",
        variant: "destructive",
      });
      return;
    }

    // Redirect to payment page instead of requiring authentication
    redirectToPaymentPage();
  };

  const redirectToPaymentPage = async () => {
    try {
      // Create a payment intent on the backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId: deal.id,
          dealTitle: deal.deal_title,
          amount: deal.sale_price,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { paymentIntentId } = await response.json();
      
      // Redirect to our custom payment page
      window.location.href = `/payment/${paymentIntentId}`;
    } catch (error) {
      console.error('Payment intent error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to redirect to payment page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      dealId: deal.id,
      dealTitle: deal.deal_title,
      quantity: 1,
      price: deal.sale_price,
      image: deal.image_gallery?.[0]?.url,
      businessName: deal.business?.name,
      requiresReservation: deal.requires_reservation,
    });

    toast({
      title: "Added to Cart",
      description: `${deal.deal_title} has been added to your cart.`,
      variant: "default",
    });
  };



  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite 
        ? `${deal.deal_title} removed from favorites.`
        : `${deal.deal_title} added to favorites.`,
      variant: "default",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: deal.deal_title,
        text: `Check out this amazing deal: ${deal.deal_title}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Deal link has been copied to clipboard.",
        variant: "default",
      });
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg">
          {deal.image_gallery && deal.image_gallery.length > 0 ? (
            <img
              src={deal.image_gallery[0].url}
              alt={deal.deal_title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-8 h-8" />
            </div>
          )}
          
          {deal.featured && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          
          <Badge className="absolute top-2 right-2 bg-red-500 text-white border-0 text-xs">
            -{discountPercentage}%
          </Badge>
        </div>

        <CardContent className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">
            {deal.deal_title}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold text-green-600">
              {formatCurrency(deal.sale_price)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(deal.original_price)}
            </span>
          </div>

          {showCountdown && deal.expiry_date_time && (
            <div className="mb-3">
              <CountdownTimer 
                expiryDate={deal.expiry_date_time} 
                size="sm"
                onExpire={() => {
                  toast({
                    title: "Deal Expired",
                    description: "This deal has expired.",
                    variant: "destructive",
                  });
                }}
              />
            </div>
          )}

          {showActions && (
            <div className="flex gap-2 mt-3">
              <Button 
                onClick={handleBookNow}
                disabled={!deal.isActive}
                size="sm"
                className="flex-1 text-xs"
              >
                {deal.isActive ? 'Book Now' : 'Unavailable'}
              </Button>
              
              {!isInCart && (
                <Button 
                  onClick={handleAddToCart}
                  variant="outline"
                  size="sm"
                  className="px-2 min-w-0"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              )}
              

            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        {/* Deal Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg">
          {deal.image_gallery && deal.image_gallery.length > 0 ? (
            <img
              src={deal.image_gallery[0].url}
              alt={deal.deal_title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-16 h-16" />
            </div>
          )}
          
          {/* Featured Badge */}
          {deal.featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          
          {/* Discount Badge */}
          <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0">
            -{discountPercentage}%
          </Badge>

          {/* Action Buttons */}
          <div className="absolute top-3 right-16 flex gap-2">
            <button
              onClick={handleFavorite}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm"
            >
              <Heart 
                className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
              />
            </button>
            
            <button
              onClick={handleShare}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Countdown Timer */}
          {showCountdown && deal.expiry_date_time && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                <CountdownTimer 
                  expiryDate={deal.expiry_date_time}
                  size="sm"
                  onExpire={() => {
                    toast({
                      title: "Deal Expired",
                      description: "This deal has expired.",
                      variant: "destructive",
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <CardHeader className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {deal.deal_category}
            </Badge>
            <div className="text-right">
              <div className="text-sm text-gray-500 line-through">
                {formatCurrency(deal.original_price)}
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(deal.sale_price)}
              </div>
            </div>
          </div>
          
          <CardTitle className="text-lg leading-tight mb-2">
            {deal.deal_title}
          </CardTitle>
          
          <CardDescription className="text-sm text-gray-600 line-clamp-3">
            {deal.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          {/* Business Info */}
          {deal.business && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{deal.business.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{deal.business.address}</span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <div>
              <div className="font-medium">{deal.views}</div>
              <div>Views</div>
            </div>
            <div>
              <div className="font-medium">{deal.clicks}</div>
              <div>Clicks</div>
            </div>
            <div>
              <div className="font-medium">{deal.conversions}</div>
              <div>Bookings</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              onClick={handleBookNow}
              disabled={!deal.isActive}
              className="flex-1 min-w-0 text-sm"
              size="sm"
            >
              {deal.isActive ? (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Book Now
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Unavailable
                </>
              )}
            </Button>
            

            
            {!isInCart && (
              <Button 
                onClick={handleAddToCart}
                variant="outline"
                size="sm"
                className="px-3 min-w-0"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>


    </>
  );
}
