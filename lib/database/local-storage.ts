// Local storage database for business directory
export interface Business {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  address: string
  phone?: string
  email?: string
  website?: string
  rating: number
  reviewCount: number
  priceRange?: string
  images?: string[]
  hours?: {
    open: string
    close: string
  }
  features?: string[]
  isOpen?: boolean
  distance?: number
  tier?: 'platinum' | 'gold' | 'silver' | 'free'
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  category: string
  venue: string
  date: string
  time: string
  endTime: string
  price: {
    min: number
    max: number
    currency: string
  }
  image?: string
  tags: string[]
  capacity: number
  ticketsAvailable: number
  organizer: string
  isFeatured: boolean
  isPopular: boolean
  status?: 'upcoming' | 'live' | 'ended'
  location?: string
  attendees?: number
  isFree?: boolean
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  category?: string
  subcategory?: string
  isOpenNow?: boolean
  distance?: number
  priceRange?: string[]
  amenities?: string[]
}

class LocalDB {
  private businesses: Business[] = []
  private events: Event[] = []
  private initialized = false

  init() {
    if (this.initialized) return
    
    // Initialize with sample data
    this.businesses = [
      {
        id: '1',
        name: 'The Beach House Restaurant',
        description: 'Fine dining with ocean views and fresh seafood',
        category: 'restaurants-dining',
        subcategory: 'fine-dining',
        address: '123 Beach Road, Pattaya',
        phone: '+66 38 123 456',
        rating: 4.8,
        reviewCount: 245,
        priceRange: '$$$',
        images: ['/placeholder.svg?height=200&width=400'],
        hours: { open: '11:00', close: '22:00' },
        features: ['Ocean View', 'Reservations Accepted', 'Credit Cards Accepted'],
        isOpen: true,
        distance: 0.5,
        tier: 'gold',
        tags: ['seafood', 'fine-dining', 'ocean-view'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Pattaya Night Market',
        description: 'Local street food and shopping experience',
        category: 'shopping',
        subcategory: 'markets',
        address: '456 Walking Street, Pattaya',
        phone: '+66 38 234 567',
        rating: 4.2,
        reviewCount: 189,
        priceRange: '$',
        images: ['/placeholder.svg?height=200&width=400'],
        hours: { open: '18:00', close: '02:00' },
        features: ['Street Food', 'Local Products', 'Cash Only'],
        isOpen: true,
        distance: 1.2,
        tier: 'free',
        tags: ['street-food', 'shopping', 'local'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'Serenity Spa Resort',
        description: 'Luxury spa treatments and wellness services',
        category: 'health-wellness',
        subcategory: 'spas',
        address: '789 Resort Road, Pattaya',
        phone: '+66 38 345 678',
        rating: 4.9,
        reviewCount: 156,
        priceRange: '$$$$',
        images: ['/placeholder.svg?height=200&width=400'],
        hours: { open: '09:00', close: '21:00' },
        features: ['Luxury Spa', 'Reservations Required', 'Credit Cards Accepted'],
        isOpen: true,
        distance: 2.1,
        tier: 'platinum',
        tags: ['spa', 'wellness', 'luxury'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
    
    // Initialize with sample event data
    this.events = [
      {
        id: '1',
        title: 'Pattaya Music Festival 2024',
        description: 'Three-day international music festival featuring top DJs and live bands from around the world',
        category: 'music',
        venue: 'Pattaya Beach Central',
        date: '2024-03-15',
        time: '18:00',
        endTime: '02:00',
        price: { min: 500, max: 2000, currency: 'THB' },
        image: '/placeholder.svg?height=200&width=400&query=music-festival',
        tags: ['music', 'festival', 'beach', 'international'],
        capacity: 10000,
        ticketsAvailable: 3500,
        organizer: 'Pattaya Events Co.',
        isFeatured: true,
        isPopular: true,
        status: 'upcoming',
        location: 'Pattaya Beach Central',
        attendees: 6500,
        isFree: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Thai Cooking Masterclass',
        description: 'Learn authentic Thai cooking techniques from professional chefs in hands-on workshop',
        category: 'workshop',
        venue: 'Culinary Arts Center',
        date: '2024-02-28',
        time: '14:00',
        endTime: '17:00',
        price: { min: 1200, max: 1200, currency: 'THB' },
        image: '/placeholder.svg?height=200&width=400&query=cooking-class',
        tags: ['cooking', 'thai food', 'workshop', 'hands-on'],
        capacity: 20,
        ticketsAvailable: 8,
        organizer: 'Thai Culinary School',
        isFeatured: true,
        isPopular: false,
        status: 'upcoming',
        location: 'Culinary Arts Center',
        attendees: 12,
        isFree: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        title: 'Sunset Beach Yoga',
        description: 'Relaxing yoga session on the beach with certified instructors as the sun sets',
        category: 'wellness',
        venue: 'Jomtien Beach',
        date: '2024-02-25',
        time: '17:30',
        endTime: '19:00',
        price: { min: 300, max: 300, currency: 'THB' },
        image: '/placeholder.svg?height=200&width=400&query=beach-yoga',
        tags: ['yoga', 'beach', 'sunset', 'wellness'],
        capacity: 50,
        ticketsAvailable: 25,
        organizer: 'Pattaya Wellness Center',
        isFeatured: false,
        isPopular: true,
        status: 'upcoming',
        location: 'Jomtien Beach',
        attendees: 25,
        isFree: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        title: 'Night Market Food Tour',
        description: 'Guided tour through Pattaya\'s best night markets with tastings and cultural insights',
        category: 'food',
        venue: 'Various Night Markets',
        date: '2024-02-26',
        time: '19:00',
        endTime: '22:00',
        price: { min: 800, max: 800, currency: 'THB' },
        image: '/placeholder.svg?height=200&width=400&query=night-market-tour',
        tags: ['food tour', 'night market', 'local culture', 'guided'],
        capacity: 15,
        ticketsAvailable: 6,
        organizer: 'Pattaya Food Tours',
        isFeatured: true,
        isPopular: true,
        status: 'upcoming',
        location: 'Various Night Markets',
        attendees: 9,
        isFree: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
    
    this.initialized = true
  }

  async getBusinesses(): Promise<Business[]> {
    this.init()
    return this.businesses
  }

  async searchBusinesses(query: string, filters: SearchFilters): Promise<Business[]> {
    this.init()
    
    let results = this.businesses

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase()
      results = results.filter(business => 
        business.name.toLowerCase().includes(searchTerm) ||
        business.description.toLowerCase().includes(searchTerm) ||
        business.category.toLowerCase().includes(searchTerm) ||
        business.subcategory.toLowerCase().includes(searchTerm) ||
        business.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter(business => 
        business.category === filters.category
      )
    }

    // Apply subcategory filter
    if (filters.subcategory) {
      results = results.filter(business => 
        business.subcategory === filters.subcategory
      )
    }

    // Apply open now filter
    if (filters.isOpenNow) {
      results = results.filter(business => business.isOpen)
    }

    // Apply distance filter
    if (filters.distance) {
      results = results.filter(business => 
        (business.distance || 0) <= filters.distance!
      )
    }

    return results
  }

  async getBusinessById(id: string): Promise<Business | null> {
    this.init()
    return this.businesses.find(business => business.id === id) || null
  }

  async getEvents(): Promise<Event[]> {
    this.init()
    return this.events
  }

  async getEventById(id: string): Promise<Event | null> {
    this.init()
    return this.events.find(event => event.id === id) || null
  }

  async searchEvents(query: string, filters: any = {}): Promise<Event[]> {
    this.init()
    
    let results = this.events

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase()
      results = results.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm) ||
        event.venue.toLowerCase().includes(searchTerm) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      results = results.filter(event => event.category === filters.category)
    }

    // Apply price range filter
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      results = results.filter(event => {
        return filters.priceRanges.some((rangeId: string) => {
          switch (rangeId) {
            case 'free':
              return event.price.min === 0
            case 'budget':
              return event.price.min > 0 && event.price.min <= 500
            case 'mid':
              return event.price.min > 500 && event.price.min <= 1500
            case 'premium':
              return event.price.min > 1500
            default:
              return true
          }
        })
      })
    }

    return results
  }
}

export const localDB = new LocalDB()
