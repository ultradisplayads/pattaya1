'use client';

import React from 'react';
import FeaturedVideosWidget from '@/components/video/featured-videos-widget';

export default function TestVideoWidget() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Widget Test Page</h1>
          <p className="text-gray-600">Test the Featured Videos Widget with trending topics functionality</p>
        </div>
        
        <div className="space-y-8">
          <FeaturedVideosWidget 
            showBrowse={true}
            showPromoted={true}
            maxVideos={12}
            autoPlay={false}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}