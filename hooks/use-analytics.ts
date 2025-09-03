"use client"

import { useCallback } from 'react'

interface AnalyticsEvent {
  action: 'impression' | 'click'
  category: 'sponsored_content' | 'news'
  label: string
  value?: number
  postId: string
  sponsorName?: string
  url?: string
}

export function useAnalytics() {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      // Google Analytics 4 tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_parameters: {
            post_id: event.postId,
            sponsor_name: event.sponsorName,
            url: event.url
          }
        })
      }

      // Send to Strapi for internal metrics
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }, [])

  const trackSponsoredImpression = useCallback((postId: string, sponsorName: string) => {
    trackEvent({
      action: 'impression',
      category: 'sponsored_content',
      label: `sponsored_post_${postId}`,
      postId,
      sponsorName
    })
  }, [trackEvent])

  const trackSponsoredClick = useCallback((postId: string, sponsorName: string, url: string) => {
    trackEvent({
      action: 'click',
      category: 'sponsored_content',
      label: `sponsored_post_${postId}`,
      value: 1,
      postId,
      sponsorName,
      url
    })
  }, [trackEvent])

  const trackNewsClick = useCallback((postId: string, url: string) => {
    trackEvent({
      action: 'click',
      category: 'news',
      label: `news_post_${postId}`,
      value: 1,
      postId,
      url
    })
  }, [trackEvent])

  return {
    trackSponsoredImpression,
    trackSponsoredClick,
    trackNewsClick
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}
