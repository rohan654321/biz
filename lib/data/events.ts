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
  // Extended organizer information
  website?: string
  founded?: string
  headquarters?: string
  specialties?: string[]
  certifications?: string[]
  achievements?: string[]
  fullDescription?: string
  socialMedia?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  companySize?: string
  yearsOfExperience?: number
  isVerified?: boolean
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
  originalStartDate?: string
  originalEndDate?: string
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

export interface User {
  id:string
  img?:string
  name:string
  email:string
  password:string
  company:string
  interest?:string
  location:string
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
    country?: string
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
  status: "upcoming" | "live" | "completed"
  followers?: User[]
  isVerified: boolean
  featured?: boolean
  logo?: string
  vip?: boolean
  speakers?: string[]
  exhibitors?: Exhibitor[]
  postponed?: boolean
  postponedReason?: string
}

export interface Exhibitor {
  id: string
  img?:string
  name: string
  company: string
  logo: string
  description: string
  category: string
  products: string[]
  website?: string
  email?: string
  phone?: string
  booth?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  rating: { average: number; count: number }
  isVerified: boolean
  isPremium?: boolean
  specialOffers?: string[]
}

/* ---------- Speaker ---------- */
export interface Speaker {
  id: string
  name: string
  title: string
  company?: string
  image: string
  bio: string
  expertise: string[]
  achievements: string[]
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  rating: { average: number; count: number }
  followers: number
  isVerified: boolean
  dateOfBirth?: string
  mobileNumber?: string
  email?: string
}

/* ---------- Venue ---------- */
export interface Venue {
  id: string
  name: string
  description: string
  images: string[]
  location: {
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  capacity: {
    total: number
    theater: number
    banquet: number
    cocktail: number
    classroom: number
  }
  amenities: string[]
  meetingSpaces: {
    id: string
    name: string
    capacity: number
    area: number
    features: string[]
    hourlyRate: number
    images: string[]
  }[]
  pricing: {
    baseRate: number
    currency: string
    packages: {
      name: string
      price: number
      includes: string[]
    }[]
  }
  availability: {
    [date: string]: boolean
  }
  rating: {
    average: number
    count: number
    breakdown: {
      service: number
      facilities: number
      location: number
      value: number
    }
  }
  reviews: {
    id: string
    author: string
    rating: number
    comment: string
    date: string
    eventType: string
  }[]
  policies: {
    cancellation: string
    catering: string
    parking: string
    accessibility: string
  }
  isVerified: boolean
  isPremium: boolean
}

// Mock event data with comprehensive organizer information
export const events: Record<string, Event> = {
  "catering-decor-expo-2025": {
    id: "catering-decor-expo-2025",
    logo: "/logo/logo.png",
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
      country: "India",
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
      originalStartDate: "2025-01-18",
      originalEndDate: "2025-01-19",
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
      description: "Leading professional event management company specializing in corporate events and trade shows",
      phone: "+91 98765 43210",
      email: "info@eventcorp.in",
      avatar: "/placeholder.svg?height=128&width=128&text=EventCorp",
      website: "https://eventcorp.in",
      founded: "2018",
      headquarters: "Mumbai, India",
      specialties: ["Corporate Events", "Trade Shows", "Conferences", "Exhibitions", "Product Launches"],
      certifications: ["ISO 9001:2015", "Event Management Certified", "Safety Compliance", "Green Event Certified"],
      achievements: [
        "Best Event Management Company 2023",
        "Excellence in Customer Service Award",
        "Top 10 Event Organizers in India",
        "Sustainability in Events Recognition",
        "Innovation in Event Technology Award",
      ],
      fullDescription:
        "EventCorp India is a premier event management company with over 6 years of experience in creating memorable experiences. We specialize in corporate events, trade shows, conferences, and exhibitions. Our team of experienced professionals ensures every event is executed flawlessly, from concept to completion. We have successfully organized over 500 events across India, serving clients from various industries including technology, healthcare, finance, and manufacturing.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/eventcorp-india",
        twitter: "https://twitter.com/eventcorpindia",
        facebook: "https://facebook.com/eventcorpindia",
        instagram: "https://instagram.com/eventcorpindia",
      },
      companySize: "50-100 employees",
      yearsOfExperience: 6,
      isVerified: true,
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
        url: "/images/gpex.jpg",
        alt: "Professional food display setup",
        type: "gallery",
      },
    ],
    categories: ["Expo", "Business Event", "Food & Beverage"],
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
        image:"/images/gpex.jpg",
        rating: 4.5,
        category: "Equipment",
      },
    ],
    featuredExhibitors: [],
    touristAttractions: [
      {
        id: "1",
        name: "Gateway of India",
        description: "Historic monument and popular tourist spot",
        image: "/images/gpex.jpg",
        rating: 4.6,
        category: "Monument",
      },
    ],
    tags: ["catering", "decor", "expo", "business", "food", "events"],
    status: "upcoming",
    isVerified: true,
    vip: true,
    postponed: false,
    featured:true,
    postponedReason: "",
  },
  "london-fintech-expo": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["education", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true,
    vip: true,
  },
    "India-fintech-expo": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["fintech", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true,
    vip: true,

  },
    "goa-fintech-expo": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["fintech", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true,
    vip: true,
  },
  "deli-fintech-expo": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["fintech", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true,
    vip: true,  
  },
  "channai-fintech-expo": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["fintech", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true
  },
   "fintech-expo": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["fintech", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true
  },
   "fintech": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["fintech", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true
  },
   "expo": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["fintech", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true
  },
  "event": {
    id: "london-fintech-expo",
     logo: "/logo/logo.png",
    title: "London FinTech Expo",
    description: "Europe's largest financial technology exhibition and conference.",
    highlights: ["Blockchain", "Digital Banking", "Cryptocurrency"],
    location: {
      city: "London",
      venue: "Bombay Exhibition Centre",
      address: "One Western Gateway, Royal Victoria Dock",
      country: "United Kingdom",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    timings: {
      startDate: "2025-06-18",
      endDate: "2025-06-19",
      dailyStart: "09:00",
      dailyEnd: "17:00",
      timezone: "GMT",
      originalStartDate: "2025-04-10",
      originalEndDate: "2025-04-12",
    },
    pricing: {
      general: 800,
      student: 400,
      currency: "£",
    },
    stats: {
      expectedVisitors: "6000+",
      exhibitors: "250+",
      duration: "2 Days",
    },
    organizer: {
      id: "fintech-london",
      name: "FinTech London Events",
      description: "Premier financial technology event organizer connecting Europe's fintech ecosystem",
      phone: "+44 20 7946 0958",
      email: "info@fintechlondon.com",
      avatar: "/placeholder.svg?height=128&width=128&text=FinTechLDN",
      website: "https://fintechlondon.com",
      founded: "2011",
      headquarters: "London, United Kingdom",
      specialties: ["FinTech Conferences", "Blockchain Events", "Digital Banking Summits", "Crypto Exhibitions"],
      certifications: [
        "Financial Services Event Management",
        "FinTech Specialist Certification",
        "European Event Standards",
        "Financial Regulation Compliance",
      ],
      achievements: [
        "Best FinTech Event Organizer Europe 2023",
        "Excellence in Financial Innovation",
        "Top Financial Technology Conference Company",
        "European FinTech Leadership Award",
        "Blockchain Innovation Recognition",
      ],
      fullDescription:
        "FinTech London Events has been driving Europe's financial technology revolution for over 13 years. We organize premier fintech conferences and exhibitions that connect traditional financial institutions with innovative technology companies, regulatory bodies with disruptive startups, and investors with groundbreaking opportunities. Our events have facilitated the adoption of blockchain technology, digital banking solutions, and cryptocurrency innovations across Europe. We are committed to advancing financial technology and promoting regulatory clarity in the evolving fintech landscape.",
      socialMedia: {
        linkedin: "https://linkedin.com/company/fintech-london",
        twitter: "https://twitter.com/fintechlondon",
        facebook: "https://facebook.com/fintechlondon",
        instagram: "https://instagram.com/fintechlondon",
      },
      companySize: "80-120 employees",
      yearsOfExperience: 13,
      isVerified: true,
    },
    images: [
      {
        id: "1",
        url: "/images/gpex.jpg",
        alt: "FinTech exhibition in London",
        type: "main",
      },
    ],
    categories: ["Finance", "Technology", "Expo"],
    rating: { average: 4.6, count: 180 },
    ageLimit: "18+",
    dressCode: "Business Formal",
    exhibitSpaceCosts: [],
    featuredItems: [],
    featuredExhibitors: [],
    touristAttractions: [],
    tags: ["fintech", "blockchain", "banking", "cryptocurrency"],
    status: "upcoming",
    
    isVerified: true,
    speakers:["sp1","sp2"],
    postponed: true,
    postponedReason: "Due to venue availability issues",
    featured:true
  },
}


export const users: User[] = [
 {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  password: '1234',
  img: '/user.jpg',
  location: 'New York',
  company:"dasdadd"
}
]
export const speakers: Speaker[] = [
  {
    id: "sp1",
    name: "John Doe",
    title: "CEO",
    company: "Tech Innovations Inc.",
    image: "/images/gpex.jpg",
    bio: "John Doe is a visionary leader in the tech industry...",
    expertise: ["AI", "Machine Learning", "Cloud Computing"],
    achievements: ["Keynote Speaker at Tech Conference 2023", "Innovation Award 2022"],
    socialLinks: {
      facebook: "https://facebook.com/johndoe",
      twitter: "https://twitter.com/johndoe",
      instagram: "https://instagram.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
    },
    rating: { average: 4.8, count: 250 },
    followers: 1200,
    isVerified: true,
    dateOfBirth: "1980-05-15",
    mobileNumber: "123-456-7890",
    email: "john.doe@example.com",
  },
  {
    id: "sp2",
    name: "Jane Smith",
    title: "Marketing Director",
    company: "Global Marketing Solutions",
    image: "/images/gpex.jpg",
    bio: "Jane Smith is a seasoned marketing professional...",
    expertise: ["Digital Marketing", "Social Media", "Branding"],
    achievements: ["Marketing Campaign of the Year 2023", "Top 10 Marketing Influencers"],
    socialLinks: {
      facebook: "https://facebook.com/janesmith",
      twitter: "https://twitter.com/janesmith",
      instagram: "https://instagram.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
    },
    rating: { average: 4.5, count: 180 },
    followers: 900,
    isVerified: true,
    dateOfBirth: "1985-08-22",
    mobileNumber: "987-654-3210",
    email: "jane.smith@example.com",
  },
]

export const exhibitors: Exhibitor[] = [
  {
    id: "ex1",
    name: "Sarah Wilson",
    company: "Premium Catering Solutions",
    logo: "/placeholder.svg?height=80&width=80&text=PCS",
    description: "Leading provider of premium catering equipment and solutions for events and hospitality industry.",
    category: "Catering Equipment",
    products: ["Commercial Ovens", "Food Display Units", "Serving Equipment", "Kitchen Appliances"],
    website: "https://premiumcatering.com",
    email: "sarah@premiumcatering.com",
    phone: "+91 98765 12345",
    booth: "A-101",
    socialLinks: {
      linkedin: "https://linkedin.com/company/premium-catering",
      twitter: "https://twitter.com/premiumcatering",
      facebook: "https://facebook.com/premiumcatering",
    },
    rating: { average: 4.7, count: 156 },
    isVerified: true,
    isPremium: true,
    specialOffers: ["20% off on bulk orders", "Free installation service", "Extended warranty"],
  },
  {
    id: "ex2",
    name: "Rajesh Patel",
    company: "Event Decor Masters",
    logo: "/placeholder.svg?height=80&width=80&text=EDM",
    description: "Creative event decoration and design specialists for weddings, corporate events, and celebrations.",
    category: "Event Decoration",
    products: ["Floral Arrangements", "Lighting Solutions", "Stage Backdrops", "Table Settings"],
    website: "https://eventdecormasters.com",
    email: "rajesh@eventdecormasters.com",
    phone: "+91 87654 32109",
    booth: "B-205",
    socialLinks: {
      linkedin: "https://linkedin.com/company/event-decor-masters",
      instagram: "https://instagram.com/event-decor-masters",
    },
    rating: { average: 4.5, count: 89 },
    isVerified: true,
    isPremium: false,
    specialOffers: ["Free consultation", "Package deals available"],
  },
  {
    id: "ex3",
    name: "Chef Amit Kumar",
    company: "Gourmet Food Innovations",
    logo: "/placeholder.svg?height=80&width=80&text=GFI",
    description: "Innovative food solutions and gourmet catering services for high-end events and restaurants.",
    category: "Food & Beverage",
    products: ["Gourmet Meals", "Specialty Cuisines", "Food Styling", "Menu Consulting"],
    website: "https://gourmetfoodinnovations.com",
    email: "amit@gourmetfoodinnovations.com",
    phone: "+91 76543 21098",
    booth: "C-312",
    socialLinks: {
      linkedin: "https://linkedin.com/in/chef-amit-kumar",
      instagram: "https://instagram.com/chefamitkumar",
      facebook: "https://facebook.com/gourmetfoodinnovations",
    },
    rating: { average: 4.9, count: 234 },
    isVerified: true,
    isPremium: true,
    specialOffers: ["Tasting sessions", "Custom menu development", "Chef consultation"],
  },
  {
    id: "ex4",
    name: "Priya Sharma",
    company: "Tech Event Solutions",
    logo: "/placeholder.svg?height=80&width=80&text=TES",
    description: "Cutting-edge technology solutions for modern events including AV equipment and digital displays.",
    category: "Technology",
    products: ["AV Equipment", "LED Displays", "Sound Systems", "Live Streaming"],
    website: "https://techeventsolutions.com",
    email: "priya@techeventsolutions.com",
    phone: "+91 65432 10987",
    booth: "D-418",
    socialLinks: {
      linkedin: "https://linkedin.com/company/tech-event-solutions",
      twitter: "https://twitter.com/techeventsol",
    },
    rating: { average: 4.6, count: 178 },
    isVerified: true,
    isPremium: false,
    specialOffers: ["Equipment rental discounts", "Technical support included"],
  },
  {
    id: "ex5",
    name: "Vikram Singh",
    company: "Luxury Venue Rentals",
    logo: "/placeholder.svg?height=80&width=80&text=LVR",
    description: "Premium venue rental services for exclusive events, weddings, and corporate gatherings.",
    category: "Venue Services",
    products: ["Banquet Halls", "Outdoor Venues", "Corporate Spaces", "Wedding Venues"],
    website: "https://luxuryvenuerentals.com",
    email: "vikram@luxuryvenuerentals.com",
    phone: "+91 54321 09876",
    booth: "E-525",
    socialLinks: {
      linkedin: "https://linkedin.com/company/luxury-venue-rentals",
      instagram: "https://instagram.com/luxuryvenuerentals",
      facebook: "https://facebook.com/luxuryvenuerentals",
    },
    rating: { average: 4.8, count: 145 },
    isVerified: true,
    isPremium: true,
    specialOffers: ["Venue booking discounts", "Complimentary site visits", "Package deals"],
  },
]

export const venues: Venue[] = [
  {
    id: "bombay-exhibition-centre",
    name: "Bombay Exhibition Centre",
    description:
      "Mumbai's premier exhibition and convention center, offering world-class facilities for trade shows, conferences, and corporate events. Located in the heart of Goregaon East with excellent connectivity.",
    images: [
      "/placeholder.svg?height=400&width=600&text=Bombay+Exhibition+Centre+Main",
      "/placeholder.svg?height=300&width=400&text=Exhibition+Hall",
      "/placeholder.svg?height=300&width=400&text=Conference+Room",
      "/placeholder.svg?height=300&width=400&text=Lobby+Area",
    ],
    location: {
      address: "Western Express Highway, Goregaon East",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400063",
      coordinates: {
        lat: 19.1595,
        lng: 72.8656,
      },
    },
    contact: {
      phone: "+91 22 6671 7000",
      email: "info@bombayexhibitioncentre.com",
      website: "https://bombayexhibitioncentre.com",
    },
    capacity: {
      total: 5000,
      theater: 3000,
      banquet: 2500,
      cocktail: 4000,
      classroom: 1500,
    },
    amenities: [
      "Air Conditioning",
      "High-Speed WiFi",
      "Audio/Visual Equipment",
      "Parking for 1000+ vehicles",
      "Food Court",
      "VIP Lounges",
      "Security Services",
      "Wheelchair Accessible",
      "Business Center",
      "Catering Services",
    ],
    meetingSpaces: [
      {
        id: "main-hall",
        name: "Main Exhibition Hall",
        capacity: 5000,
        area: 15000,
        features: ["Modular Layout", "High Ceiling", "Loading Dock", "Climate Control"],
        hourlyRate: 25000,
        images: ["/placeholder.svg?height=300&width=400&text=Main+Hall"],
      },
      {
        id: "conference-room-a",
        name: "Conference Room A",
        capacity: 200,
        area: 500,
        features: ["Projector", "Sound System", "Video Conferencing", "Whiteboard"],
        hourlyRate: 5000,
        images: ["/placeholder.svg?height=300&width=400&text=Conference+A"],
      },
      {
        id: "boardroom",
        name: "Executive Boardroom",
        capacity: 25,
        area: 100,
        features: ["Premium Furniture", "Smart TV", "Coffee Station", "Private Entrance"],
        hourlyRate: 3000,
        images: ["/placeholder.svg?height=300&width=400&text=Boardroom"],
      },
    ],
    pricing: {
      baseRate: 15000,
      currency: "₹",
      packages: [
        {
          name: "Basic Package",
          price: 50000,
          includes: ["Venue Rental", "Basic AV Equipment", "Security", "Cleaning"],
        },
        {
          name: "Premium Package",
          price: 85000,
          includes: ["Venue Rental", "Full AV Setup", "Catering", "Decoration", "Event Coordination"],
        },
        {
          name: "Corporate Package",
          price: 120000,
          includes: ["Venue Rental", "Premium AV", "Catering", "Branding", "Photography", "Event Management"],
        },
      ],
    },
    availability: {
      "2025-01-15": false,
      "2025-01-16": false,
      "2025-01-17": false,
      "2025-02-15": false,
      "2025-02-16": false,
      "2025-02-17": false,
      "2025-03-10": true,
      "2025-03-11": true,
      "2025-03-12": true,
    },
    rating: {
      average: 4.5,
      count: 234,
      breakdown: {
        service: 4.6,
        facilities: 4.4,
        location: 4.7,
        value: 4.3,
      },
    },
    reviews: [
      {
        id: "r1",
        author: "Rajesh Kumar",
        rating: 5,
        comment:
          "Excellent venue for our annual conference. The facilities were top-notch and the staff was very professional.",
        date: "2024-12-15",
        eventType: "Corporate Conference",
      },
      {
        id: "r2",
        author: "Priya Sharma",
        rating: 4,
        comment: "Great location and good facilities. The parking was convenient and the venue was well-maintained.",
        date: "2024-11-28",
        eventType: "Trade Show",
      },
      {
        id: "r3",
        author: "Amit Patel",
        rating: 5,
        comment:
          "Perfect venue for our product launch. The technical support team was excellent and everything went smoothly.",
        date: "2024-10-20",
        eventType: "Product Launch",
      },
    ],
    policies: {
      cancellation:
        "48 hours advance notice required for cancellation. 50% refund for cancellations made 7 days prior.",
      catering: "External catering allowed with prior approval. In-house catering services available.",
      parking: "Complimentary parking for up to 1000 vehicles. Valet parking available at additional cost.",
      accessibility: "Fully wheelchair accessible with ramps, elevators, and accessible restrooms.",
    },
    isVerified: true,
    isPremium: true,
  },
]

// Helper functions
export function getEventById(id: string): Event | undefined {
  return events[id]
}

export function getAllEvents(): Event[] {
  return Object.values(events)
}

export function getEventsByCategory(category: string): Event[] {
  return Object.values(events).filter((event) => event.categories.includes(category))
}

export function getEventsByCity(city: string): Event[] {
  return Object.values(events).filter((event) => event.location.city.toLowerCase() === city.toLowerCase())
}

export function getEventsByOrganizer(organizerId: string): Event[] {
  return Object.values(events).filter((event) => event.organizer.id === organizerId)
}

export function getSpeakerById(id: string): Speaker | undefined {
  return speakers.find((speaker) => speaker.id === id)
}

export function getAllSpeakers(): Speaker[] {
  return speakers
}

export function getExhibitorById(id: string): Exhibitor | undefined {
  return exhibitors.find((exhibitor) => exhibitor.id === id)
}

export function getAllExhibitors(): Exhibitor[] {
  return exhibitors
}

export function getExhibitorsByEvent(eventId: string): Exhibitor[] {
  // For now, return all exhibitors for the catering expo
  if (eventId === "catering-decor-expo-2025") {
    return exhibitors
  }
  return []
}

export function getVenueById(id: string): Venue | undefined {
  return venues.find((venue) => venue.id === id)
}

export function getAllVenues(): Venue[] {
  return venues
}

export function getEventsByVenue(venueId: string): Event[] {
  const venue = getVenueById(venueId)
  if (!venue) return []

  return Object.values(events).filter((event) => {
    // Match by venue name (case-insensitive)
    const eventVenueName = event.location.venue.toLowerCase()
    const targetVenueName = venue.name.toLowerCase()

    console.log("Comparing:", eventVenueName, "with", targetVenueName)

    return eventVenueName === targetVenueName
  })
}

export function getEventsBySpeaker(speakerId: string): { upcoming: Event[]; past: Event[] } {
  const upcomingEvents: Event[] = []
  const pastEvents: Event[] = []

  Object.values(events).forEach((event) => {
    if (event.speakers && event.speakers.includes(speakerId)) {
      if (event.status === "upcoming") {
        upcomingEvents.push(event)
      } else {
        pastEvents.push(event)
      }
    }
  })

  return { upcoming: upcomingEvents, past: pastEvents }
}

// Postponed event functions
export function postponeEvent(eventId: string, reason?: string): boolean {
  const event = events[eventId]
  if (!event) return false

  // Store original dates if not already stored
  if (!event.timings.originalStartDate) {
    event.timings.originalStartDate = event.timings.startDate
    event.timings.originalEndDate = event.timings.endDate
  }

  event.postponed = true
  event.postponedReason = reason || "Event postponed"

  return true
}

export function unpostponeEvent(eventId: string, newStartDate: string, newEndDate: string): boolean {
  const event = events[eventId]
  if (!event) return false

  event.postponed = false
  event.postponedReason = ""
  event.timings.startDate = newStartDate
  event.timings.endDate = newEndDate

  return true
}

export function isEventPostponed(eventId: string): boolean {
  const event = events[eventId]
  return event?.postponed || false
}

export function getOriginalEventDates(eventId: string): { startDate?: string; endDate?: string } {
  const event = events[eventId]
  return {
    startDate: event?.timings.originalStartDate,
    endDate: event?.timings.originalEndDate,
  }
}
