"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Star,
  Share2,
  Heart,
  Award,
  Building,
  CheckCircle,
  ExternalLink,
  Package,
  TrendingUp,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"

// Define types for exhibitor data
interface Exhibitor {
  id: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  website?: string
  companyName?: string
  companyLogo?: string
  industry?: string
  companySize?: string
  foundedYear?: string
  headquarters?: string
  specialties?: string[]
  certifications?: string[]
  isVerified: boolean
  createdAt: string
}

// Define types for event data based on your MongoDB structure
interface Event {
  rating: any
  images: any
  _id: string
  title: string
  description: string
  shortDescription?: string
  slug: string
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "upcoming" | "completed" | "cancelled"
  category: string
  tags: string[]
  isFeatured: boolean
  isVIP: boolean
  startDate: string | { $date: string }
  endDate: string | { $date: string }
  registrationStart: string | { $date: string }
  registrationEnd: string | { $date: string }
  timezone: string
  venueId: string | null
  isVirtual: boolean
  virtualLink: string | null
  address: string
  location: string | { city?: string; venue?: string }
  city: string
  state: string | null
  country: string
  zipCode: string | null
  maxAttendees: number | null
  currentAttendees: number | { $numberLong: string }
  currency: string
  bannerImage: string | null
  thumbnailImage: string | null
  isPublic: boolean
  requiresApproval: boolean
  allowWaitlist: boolean
  refundPolicy: string | null
  metaTitle: string | null
  metaDescription: string | null
  organizerId: string | { $oid: string }
  createdAt: string | { $date: string }
  updatedAt: string | { $date: string }
  averageRating: number
  totalReviews: number | { $numberLong: string }
}

// Review interface
interface Review {
  id: string
  rating: number
  title: string
  comment: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {review.user?.avatar ? (
              <img
                src={review.user.avatar}
                alt={`${review.user.firstName} ${review.user.lastName}`}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {review.user.firstName?.[0]}{review.user.lastName?.[0]}
                </span>
              </div>
            )}
            <div>
              <h4 className="font-medium">
                {review.user.firstName} {review.user.lastName}
              </h4>
              <p className="text-sm text-gray-500">
                {format(new Date(review.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-1 text-sm font-medium">{review.rating}</span>
          </div>
        </div>

        {review.title && (
          <h5 className="font-semibold text-lg mb-2">{review.title}</h5>
        )}

        <p className="text-gray-700">{review.comment}</p>
      </CardContent>
    </Card>
  )
}

// Add Review Component
function AddReview({ exhibitorId, onReviewAdded }: { exhibitorId: string; onReviewAdded: (review: Review) => void }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || rating === 0) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/exhibitors/${exhibitorId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, comment }),
      })

      if (res.ok) {
        const newReview = await res.json()
        onReviewAdded(newReview)
        setShowSuccessMessage(true)
        setRating(0)
        setTitle("")
        setComment("")

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 3000)
      } else {
        const error = await res.json()
        alert(`❌ ${error.error || "Failed to add review"}`)
      }
    } catch (err) {
      console.error(err)
      alert("⚠️ Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={28}
                    className={
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : "Select rating"}
              </span>
            </div>

            <input
              type="text"
              placeholder="Review title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <textarea
              placeholder="Share your experience with this exhibitor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={4}
              required
            />

            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-48 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Thank you for your review!</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to safely extract date
const safeFormatDate = (dateInput: string | { $date: string } | null | undefined): string => {
  if (!dateInput) return "Date TBD";

  try {
    const dateString = typeof dateInput === 'string' ? dateInput : dateInput?.$date;
    if (!dateString) return "Date TBD";

    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Helper function to safely access location
const getLocationString = (location: string | { city?: string; venue?: string }): string => {
  if (typeof location === 'string') {
    return location || "Location TBD";
  }

  const city = location?.city || "";
  const venue = location?.venue || "";

  if (city && venue) {
    return `${city}, ${venue}`;
  } else if (city) {
    return city;
  } else if (venue) {
    return venue;
  }

  return "Location TBD";
};

// Helper function to extract date from MongoDB format
const extractDate = (dateObj: any): string => {
  if (!dateObj) return "";
  if (typeof dateObj === 'string') return dateObj;
  if (dateObj.$date) return dateObj.$date;
  return "";
};

// Helper function to extract number from MongoDB format
const extractNumber = (numObj: any): number => {
  if (!numObj) return 0;
  if (typeof numObj === 'number') return numObj;
  if (numObj.$numberLong) return parseInt(numObj.$numberLong, 10);
  return 0;
};

// Main Exhibitor Page Component
export default function ExhibitorPage() {
  const params = useParams()
  const router = useRouter()
  const exhibitorId = params.id as string

  const [activeTab, setActiveTab] = useState("overview")
  const [eventsTab, setEventsTab] = useState("upcoming")
  const [currentPage, setCurrentPage] = useState(1)
  const [exhibitor, setExhibitor] = useState<Exhibitor | null>(null)
  const [exhibitorEvents, setExhibitorEvents] = useState<Event[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const eventsPerPage = 6

  // Fetch exhibitor data
  useEffect(() => {
    async function fetchExhibitor() {
      try {
        const response = await fetch(`/api/exhibitors/${exhibitorId}`)
        const data = await response.json()

        if (data.success) {
          setExhibitor(data.exhibitor)
        } else {
          console.error("Failed to fetch exhibitor:", data.error)
        }
      } catch (error) {
        console.error("Error fetching exhibitor:", error)
      } finally {
        setLoading(false)
      }
    }

    if (exhibitorId) {
      fetchExhibitor()
    }
  }, [exhibitorId])

  // Fetch exhibitor events data
  useEffect(() => {
    async function fetchExhibitorEvents() {
      if (!exhibitorId) return;

      setEventsLoading(true);
      try {
        const response = await fetch(`/api/events/exhibitors/${exhibitorId}`);
        const data = await response.json();
        console.log("Events API Response:", data);

        if (data.success) {
          const events = data.data?.events || data.events || data.data || [];
          console.log("Processed events:", events);

          const transformedEvents = events.map((item: any) => {
            const event = item.event || item;
            return {
              ...event,
              startDate: extractDate(event.startDate),
              endDate: extractDate(event.endDate),
              status: determineEventStatus(event.startDate, event.endDate),
              rating: {
                average: event.averageRating || 0,
                count: extractNumber(event.totalReviews) || 0
              },
              location: {
                city: event.city || "Unknown City",
                venue: event.location || event.address || "Unknown Venue"
              },
              images: event.bannerImage || event.thumbnailImage ?
                [{ url: event.bannerImage || event.thumbnailImage }] :
                []
            };
          });

          setExhibitorEvents(transformedEvents);
        } else {
          console.error("Failed to fetch exhibitor events:", data.message);
          setExhibitorEvents([]);
        }
      } catch (error) {
        console.error("Error fetching exhibitor events:", error);
        setExhibitorEvents([]);
      } finally {
        setEventsLoading(false);
      }
    }

    if (exhibitorId) {
      fetchExhibitorEvents();
    }
  }, [exhibitorId]);

  // Fetch reviews data
  useEffect(() => {
    async function fetchReviews() {
      if (!exhibitorId) return;

      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/exhibitors/${exhibitorId}/reviews`)
        if (res.ok) {
          const data = await res.json()
          setReviews(data.reviews || [])
        } else {
          console.error("Failed to fetch reviews")
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setReviewsLoading(false);
      }
    }

    if (exhibitorId) {
      fetchReviews();
    }
  }, [exhibitorId]);

  // Handle new review submission
  const handleReviewAdded = (newReview: Review) => {
    setReviews(prevReviews => [newReview, ...prevReviews])
  }

  // Determine event status based on dates
  const determineEventStatus = (startDate: any, endDate: any): "upcoming" | "completed" | "cancelled" => {
    const start = extractDate(startDate);
    const end = extractDate(endDate);

    if (!start) return "upcoming";

    const now = new Date();
    const eventStart = new Date(start);
    const eventEnd = new Date(end || start);

    if (now > eventEnd) return "completed";
    if (now < eventStart) return "upcoming";
    return "upcoming";
  };

  // Mock data for achievements and social proof
  const mockDetails = {
    achievements: [
      "Best Tech Innovation Award 2023",
      "Top 50 Startups in India 2022",
      "Excellence in Customer Service",
      "Sustainability Leader Recognition",
    ],
    socialProof: {
      clientsServed: "500+",
      projectsCompleted: "1,200+",
      yearsExperience: "8+",
      teamSize: "150+",
    },
  }

  // Calculate exhibitor statistics
  const stats = useMemo(() => {
    const totalEvents = exhibitorEvents.length;

    const upcomingEvents = exhibitorEvents.filter(
      (event) => event.status === "upcoming"
    ).length;

    const completedEvents = exhibitorEvents.filter(
      (event) => event.status === "completed"
    ).length;

    const cancelledEvents = exhibitorEvents.filter(
      (event) => event.status === "cancelled"
    ).length;

    const avgRating =
      exhibitorEvents.length > 0
        ? exhibitorEvents.reduce((sum, event) => {
          const rating = event.rating?.average || 0;
          return sum + rating;
        }, 0) / exhibitorEvents.length
        : 4.8;

    // Calculate average review rating
    const reviewAvgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return {
      totalEvents,
      upcomingEvents,
      completedEvents,
      cancelledEvents,
      pastEvents: completedEvents + cancelledEvents,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewAvgRating: Math.round(reviewAvgRating * 10) / 10,
      totalReviews: reviews.length,
      clientsServed: mockDetails.socialProof.clientsServed,
    };
  }, [exhibitorEvents, reviews]);

  // Filter events based on active events tab
  const filteredEvents = useMemo(() => {
    if (eventsTab === "upcoming") {
      return exhibitorEvents.filter(event => event.status === "upcoming");
    } else {
      return exhibitorEvents.filter(event =>
        event.status === "completed" || event.status === "cancelled"
      );
    }
  }, [exhibitorEvents, eventsTab]);

  // Pagination for events
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)

  // Reset to page 1 when events tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [eventsTab]);

  const formatDateRange = (startDate: string | { $date: string }, endDate: string | { $date: string }) => {
    const start = safeFormatDate(startDate);
    const end = safeFormatDate(endDate);

    if (start === "Date TBD" && end === "Date TBD") return "Date TBD";
    if (start === end) return start;
    return `${start} - ${end}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading exhibitor details...</div>
      </div>
    )
  }

  if (!exhibitor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Exhibitor Not Found</h1>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      </div>
    )
  }

  const exhibitorName = exhibitor.companyName || `${exhibitor.firstName} ${exhibitor.lastName}`.trim() || "Exhibitor"
  const exhibitorLogo = exhibitor.companyLogo || exhibitor.avatar
  const exhibitorDescription = exhibitor.bio || "No description available."
  const exhibitorSpecialties = exhibitor.specialties || ["Enterprise Software", "AI/ML Solutions", "Cloud Computing"]
  const exhibitorCertifications = exhibitor.certifications || ["ISO 27001:2013", "SOC 2 Type II", "GDPR Compliant"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#002C71] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Exhibitor Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={exhibitorLogo || "/placeholder.svg"} alt={exhibitorName} />
                <AvatarFallback className="text-2xl font-bold bg-white text-blue-600">
                  {exhibitorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {exhibitor.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Exhibitor Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{exhibitorName}</h1>
                <div className="space-x-8">
                  <Badge className="bg-gray-200 w-20 py-2 text-yellow-900 rounded-sm">
                    Active
                  </Badge>
                </div>
              </div>
              <p className="text-xl text-blue-100 mb-4">{exhibitorDescription}</p>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 text-blue-100">
                {exhibitor.headquarters && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{exhibitor.headquarters}</span>
                  </div>
                )}
                {exhibitor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{exhibitor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{exhibitor.email}</span>
                </div>
                {exhibitor.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a href={exhibitor.website} className="hover:text-white transition-colors">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="space-x-3">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Heart className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: exhibitor.firstName,
                          text: "Check out this event!",
                          url: window.location.href,
                        })
                          .catch((err) => console.error("Error sharing:", err));
                      } else {
                        alert("Sharing is not supported in this browser.");
                      }
                    }}
                  
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              <button className="bg-red-500 text-white w-50 py-2 rounded-sm">
                Schedule Meeting
              </button>

              {/* <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
              <div className="text-sm text-gray-600">Events Participated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.clientsServed}</div>
              <div className="text-sm text-gray-600">Clients Served</div>
            </div>
            {/* <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">{stats.avgRating}</span>
              </div>
              <div className="text-sm text-gray-600">Event Rating</div>
            </div> */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">{stats.reviewAvgRating}</span>
                {/* <span className="text-sm text-gray-500">({stats.totalReviews})</span> */}
              </div>
              <div className="text-sm text-gray-600">Event Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{mockDetails.socialProof.yearsExperience}</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{exhibitor.foundedYear || "2015"}</div>
              <div className="text-sm text-gray-600">Founded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events ({stats.totalEvents})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({stats.totalReviews})</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Highlights */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      About {exhibitorName}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{exhibitorDescription}</p>
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Recent Event Participation</h3>
                    {eventsLoading ? (
                      <div className="text-center py-8">Loading events...</div>
                    ) : exhibitorEvents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No events found for this exhibitor.
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {exhibitorEvents.slice(0, 3).map((event) => {
                            if (!event) return null;

                            return (
                              <div
                                key={event._id}
                                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => {
                                  // Navigate to event details page or open modal
                                  console.log('Event clicked:', event._id);
                                }}
                              >
                                {/* Event Image */}
                                <div className="relative w-16 h-16 flex-shrink-0">
                                  <Image
                                    alt={event.title || "Event"}
                                    src={event.images?.[0]?.url || "/images/signupimg.png"}
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 min-w-0">
                                  {/* Event Title with Rating */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                      {event.title || "Untitled Event"}
                                    </h4>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span className="text-xs font-medium text-yellow-800">
                                        {event.rating?.average || "4.5"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Event Date */}
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDateRange(event.startDate, event.endDate)}</span>
                                  </div>

                                  {/* Event Location */}
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{getLocationString(event.location)}</span>
                                  </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex-shrink-0">
                                  <Badge
                                    variant={
                                      event.status === "upcoming" ? "default" :
                                        event.status === "completed" ? "secondary" : "destructive"
                                    }
                                    className="ml-2"
                                  >
                                    {event.status === "upcoming" ? "Upcoming" :
                                      event.status === "completed" ? "Completed" :
                                        event.status === "cancelled" ? "Cancelled" : "Unknown"}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* View All Button - Only show if there are more than 3 events */}
                        {exhibitorEvents.length > 3 && (
                          <div className="mt-6 text-center">
                            <Button
                              variant="outline"
                              onClick={() => setActiveTab("events")}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              View All Events ({exhibitorEvents.length})
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Key Metrics */}
                {/* <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Key Metrics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clients Served</span>
                        <span className="font-semibold">{mockDetails.socialProof.clientsServed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Projects Completed</span>
                        <span className="font-semibold">{mockDetails.socialProof.projectsCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team Size</span>
                        <span className="font-semibold">{mockDetails.socialProof.teamSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company Size</span>
                        <span className="font-semibold">{exhibitor.companySize || "201-500 employees"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Reviews</span>
                        <span className="font-semibold">{stats.totalReviews}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}

                {/* Specialties */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {exhibitorSpecialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements
                    </h3>
                    <div className="space-y-2">
                      {mockDetails.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                    <div className="space-y-2">
                      {exhibitorCertifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Event Participation History</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {eventsTab === "upcoming"
                    ? `${stats.upcomingEvents} upcoming events`
                    : `${stats.pastEvents} past events`
                  }
                </span>
              </div>
            </div>

            {/* Events Sub-tabs */}
            <Tabs value={eventsTab} onValueChange={setEventsTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-xs">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>

              {/* Upcoming Events Tab */}
              <TabsContent value="upcoming" className="space-y-6">
                {eventsLoading ? (
                  <div className="text-center py-12">Loading events...</div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h4 className="text-lg font-semibold mb-2">No Upcoming Events</h4>
                    <p>This exhibitor doesn't have any upcoming events scheduled.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedEvents.map((event) => {
                        if (!event) return null;

                        return (
                          <Card key={event._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-0">
                              <div className="relative">
                                <Image
                                  src={event.images?.[0]?.url || "/herosection-images/weld.jpg"}
                                  alt={event.title || "Event"}
                                  width={400}
                                  height={200}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                                {event.isFeatured && (
                                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900">Featured</Badge>
                                )}
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-lg mb-2 line-clamp-1">{event.title || "Untitled Event"}</h4>
                                <div className="space-y-2 mb-3">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {formatDateRange(event.startDate, event.endDate)}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {getLocationString(event.location)}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium">{event.rating?.average || "N/A"}</span>
                                    <span className="text-sm text-gray-500">({event.rating?.count || 0})</span>
                                  </div>
                                  <Badge variant="default">
                                    {event.status || "upcoming"}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 rounded text-sm ${currentPage === page ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                              {page}
                            </button>
                          )
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Past Events Tab */}
              <TabsContent value="past" className="space-y-6">
                {eventsLoading ? (
                  <div className="text-center py-12">Loading events...</div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h4 className="text-lg font-semibold mb-2">No Past Events</h4>
                    <p>This exhibitor hasn't participated in any past events yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedEvents.map((event) => {
                        if (!event) return null;

                        return (
                          <Card key={event._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-0">
                              <div className="relative">
                                <Image
                                  src={event.images?.[0]?.url || "/herosection-images/weld.jpg"}
                                  alt={event.title || "Event"}
                                  width={400}
                                  height={200}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                                {event.isFeatured && (
                                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900">Featured</Badge>
                                )}
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-lg mb-2 line-clamp-1">{event.title || "Untitled Event"}</h4>
                                <div className="space-y-2 mb-3">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {formatDateRange(event.startDate, event.endDate)}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {getLocationString(event.location)}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium">{event.rating?.average || "4.5"}</span>
                                    {/* <span className="text-sm text-gray-500">({event.rating?.count ||})</span> */}
                                  </div>
                                  <Badge variant={event.status === "completed" ? "secondary" : "destructive"}>
                                    {event.status || "completed"}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 rounded text-sm ${currentPage === page ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                              {page}
                            </button>
                          )
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Founded</label>
                      <p className="text-gray-900">{exhibitor.foundedYear || "2015"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Headquarters</label>
                      <p className="text-gray-900">{exhibitor.headquarters || "Bangalore, India"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="text-gray-900">{exhibitor.industry || "Technology"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Size</label>
                      <p className="text-gray-900">{exhibitor.companySize || "201-500 employees"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <a
                        href={exhibitor.website || "#"}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {exhibitor.website || "https://techcorp.com"}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact</label>
                      <div className="space-y-1">
                        <p className="text-gray-900">{exhibitor.phone || "+91 98765 43210"}</p>
                        <p className="text-gray-900">{exhibitor.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Business Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Events Participated</span>
                      <span className="font-semibold">{stats.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clients Served</span>
                      <span className="font-semibold">{mockDetails.socialProof.clientsServed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects Completed</span>
                      <span className="font-semibold">{mockDetails.socialProof.projectsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Years of Experience</span>
                      <span className="font-semibold">{mockDetails.socialProof.yearsExperience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{stats.reviewAvgRating}</span>
                        <span className="text-sm text-gray-500">({stats.totalReviews})</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Full Description</h3>
                <p className="text-gray-600 leading-relaxed">{exhibitorDescription}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Review Form and All Reviews */}
                <div className="lg:col-span-3 space-y-6">
                  <AddReview exhibitorId={exhibitorId} onReviewAdded={handleReviewAdded} />

                  {/* All Reviews Section in Scrollable Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        All Reviews ({reviews.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {reviewsLoading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-gray-500">Loading reviews...</p>
                        </div>
                      ) : reviews.length > 0 ? (
                        <div
                          className="space-y-4 max-h-[600px] overflow-y-auto p-6 pt-0"
                          style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#cbd5e0 #f7fafc'
                          }}
                        >
                          {reviews.map((review) => (
                            <div key={review.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                              <ReviewCard review={review} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 px-6">
                          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2 text-gray-700">No Reviews Yet</h3>
                          <p className="text-gray-500 max-w-md mx-auto">
                            Be the first to share your experience with this exhibitor! Your review will help others make better decisions.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}