'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiryDate: string;
  onExpire?: () => void;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ 
  expiryDate, 
  onExpire, 
  showIcon = true, 
  size = 'md' 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiryDate).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        onExpire?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiryDate, onExpire]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-red-600 font-medium">
        {showIcon && <Clock className="w-4 h-4" />}
        <span>Expired</span>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        {showIcon && <Clock className="w-4 h-4" />}
        <span>Loading...</span>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {showIcon && <Clock className={`${iconSizes[size]} text-orange-500`} />}
      
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md font-mono font-bold">
              {formatNumber(timeLeft.days)}
            </div>
            <span className={`${sizeClasses[size]} text-gray-500 font-medium`}>d</span>
          </>
        )}
        
        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md font-mono font-bold">
          {formatNumber(timeLeft.hours)}
        </div>
        <span className={`${sizeClasses[size]} text-gray-500 font-medium`}>h</span>
        
        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md font-mono font-bold">
          {formatNumber(timeLeft.minutes)}
        </div>
        <span className={`${sizeClasses[size]} text-gray-500 font-medium`}>m</span>
        
        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md font-mono font-bold">
          {formatNumber(timeLeft.seconds)}
        </div>
        <span className={`${sizeClasses[size]} text-gray-500 font-medium`}>s</span>
      </div>
    </div>
  );
}
