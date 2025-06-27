export interface EventImage {
  id: string
  url: string
  alt: string
  type: "main" | "gallery"
}

export interface EventOrganizer {
  id: string
  name: string
  description: string
  phone: string
  email: string
  avatar: string
}

export interface EventPricing {
  general: number
  student?: number
  vip?: number
  currency: string
}

export interface EventTimings {
  startDate: string
  endDate: string
  dailyStart: string
  dailyEnd: string
  timezone: string
}

export interface ExhibitSpaceCost {
  type: string
  description: string
  pricePerSqm: number
  minArea: number
}

export interface FeaturedItem {
  id: string
  name: string
  description: string
  image: string
  rating: number
  category: string
}

export interface TouristAttraction {
  id: string
  name: string
  description: string
  image: string
  rating: number
  category: string
}

export interface Event {
  id: string
  title: string
  description: string
  highlights: string[]
  location: {
    city: string
    venue: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  timings: EventTimings
  pricing: EventPricing
  stats: {
    expectedVisitors: string
    exhibitors: string
    duration: string
  }
  organizer: EventOrganizer
  images: EventImage[]
  categories: string[]
  rating: {
    average: number
    count: number
  }
  ageLimit: string
  dressCode: string
  exhibitSpaceCosts: ExhibitSpaceCost[]
  featuredItems: FeaturedItem[]
  featuredExhibitors: FeaturedItem[]
  touristAttractions: TouristAttraction[]
  tags: string[]
  status: "upcoming" | "ongoing" | "completed"
  followers: number
  isVerified: boolean
}

// Mock event data
export const events: Record<string, Event> = {
  "catering-decor-expo-2025": {
    id: "catering-decor-expo-2025",
    title: "Catering and Decor Expo 2025",
    description:
      "The biggest food & beverage and catering focused event, bringing together professionals dealing with food catering. The event will showcase the latest trends in catering equipment, food presentation, and decor solutions for events and weddings.",
    highlights: [
      "Latest catering equipment",
      "Food styling and presentation",
      "Event decor solutions",
      "Networking opportunities",
      "Live cooking demonstrations",
      "Industry expert sessions",
    ],
    location: {
      city: "Mumbai",
      venue: "Bombay Exhibition Centre",
      address: "Goregaon East, Mumbai, Maharashtra 400063",
      coordinates: {
        lat: 19.1595,
        lng: 72.8656,
      },
    },
    timings: {
      startDate: "2025-02-15",
      endDate: "2025-02-17",
      dailyStart: "10:00",
      dailyEnd: "19:00",
      timezone: "IST",
    },
    pricing: {
      general: 2500,
      student: 1500,
      currency: "₹",
    },
    stats: {
      expectedVisitors: "10,000+",
      exhibitors: "200+",
      duration: "3 Days",
    },
    organizer: {
      id: "eventcorp-india",
      name: "EventCorp India",
      description: "Professional Event Management",
      phone: "+91 98765 43210",
      email: "info@eventcorp.in",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "Main expo hall with catering displays",
        type: "main",
      },
      {
        id: "2",
        url: "/images/yogaslide.jpg",
        alt: "Professional food display setup",
        type: "gallery",
      },
      {
        id: "3",
        url: "/images/yogaslide.jpg",
        alt: "Professional food display setup",
        type: "gallery",
      },
      {
        id: "4",
        url: "/images/yogaslide.jpg",
        alt: "Professional food display setup",
        type: "gallery",
      },
    ],
    categories: ["Expo", "Business Event"],
    rating: {
      average: 4.5,
      count: 234,
    },
    ageLimit: "18+ years",
    dressCode: "Business Casual",
    exhibitSpaceCosts: [
      {
        type: "Raw Space",
        description: "Raw Space (per sq.m) - excluding GST (9 sq.m min)",
        pricePerSqm: 2500,
        minArea: 9,
      },
    ],
    featuredItems: [
      {
        id: "1",
        name: "Premium Catering Equipment",
        description: "Professional grade equipment for events",
        image: "/placeholder.svg?height=60&width=60&text=Equipment",
        rating: 4.5,
        category: "Equipment",
      },
      {
        id: "2",
        name: "Elegant Table Settings",
        description: "Luxury table decoration and settings",
        image: "/placeholder.svg?height=60&width=60&text=Decor",
        rating: 4.7,
        category: "Decor",
      },
    ],
    featuredExhibitors: [],
    touristAttractions: [
      {
        id: "1",
        name: "Gateway of India",
        description: "Historic monument and popular tourist spot",
        image: "/placeholder.svg?height=60&width=60&text=Gateway",
        rating: 4.6,
        category: "Monument",
      },
    ],
    tags: ["catering", "decor", "expo", "business", "food", "events"],
    status: "upcoming",
    followers: 3032,
    isVerified: true,
  },
}

// Helper functions
export function getEventById(id: string): Event | null {
  return events[id] || null
}

export function getAllEvents(): Event[] {
  return Object.values(events)
}

export function getEventsByCategory(category: string): Event[] {
  return Object.values(events).filter((event) =>
    event.categories.some((cat) => cat.toLowerCase().includes(category.toLowerCase())),
  )
}

export function getEventsByLocation(city: string): Event[] {
  return Object.values(events).filter((event) => event.location.city.toLowerCase().includes(city.toLowerCase()))
}
