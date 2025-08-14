"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, Building, TrendingUp, Search, Reply, ThumbsUp, AlertCircle } from "lucide-react"

export default function RatingsReviews() {
  const [filterRating, setFilterRating] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [replyText, setReplyText] = useState("")
  const [selectedReview, setSelectedReview] = useState<number | null>(null)

  type RatingKey = 1 | 2 | 3 | 4 | 5;

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      eventName: "Global Tech Conference 2025",
      organizer: {
        name: "Rajesh Kumar",
        company: "TechEvents India",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2025-01-15",
      title: "Outstanding venue and exceptional service!",
      review:
        "The Grand Convention Center exceeded all our expectations. The facilities were top-notch, the staff was incredibly helpful, and the technical support was flawless. Our 1500 attendees were impressed with the venue. The Grand Ballroom was perfect for our keynote sessions, and the breakout rooms were well-equipped. Highly recommend for large-scale conferences.",
      helpful: 12,
      categories: {
        facilities: 5,
        staff: 5,
        location: 4,
        value: 4,
        cleanliness: 5,
      },
      reply: null,
      verified: true,
    },
    {
      id: 2,
      eventName: "Healthcare Innovation Summit",
      organizer: {
        name: "Dr. Priya Sharma",
        company: "MedTech Solutions",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      date: "2025-01-10",
      title: "Great venue with minor issues",
      review:
        "Overall, we had a positive experience at the venue. The Executive Halls were well-suited for our summit, and the AV equipment worked perfectly. The catering service was excellent. However, we faced some parking issues during peak hours, and the WiFi was slow in some areas. The staff was responsive and tried to resolve issues quickly.",
      helpful: 8,
      categories: {
        facilities: 4,
        staff: 5,
        location: 3,
        value: 4,
        cleanliness: 4,
      },
      reply: {
        date: "2025-01-12",
        message:
          "Thank you for your feedback, Dr. Sharma. We're glad you had a positive experience overall. We've since upgraded our WiFi infrastructure and are working on expanding our parking facilities. We appreciate your patience and look forward to hosting you again.",
      },
      verified: true,
    },
    {
      id: 3,
      eventName: "Annual Sales Meeting",
      organizer: {
        name: "Amit Patel",
        company: "Corporate Solutions Ltd",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2025-01-05",
      title: "Perfect for corporate events",
      review:
        "Excellent venue for our annual sales meeting. The meeting rooms were perfectly sized for our 80 attendees, and the boardroom setup was exactly what we needed. The staff was professional and attentive to our requirements. The location is convenient with good transport connectivity. Will definitely book again for future events.",
      helpful: 6,
      categories: {
        facilities: 5,
        staff: 5,
        location: 5,
        value: 4,
        cleanliness: 5,
      },
      reply: {
        date: "2025-01-07",
        message:
          "Thank you so much, Amit! We're delighted that our venue met all your requirements for the sales meeting. Our team takes pride in providing professional service for corporate events. We look forward to hosting your future events.",
      },
      verified: true,
    },
    {
      id: 4,
      eventName: "Product Launch Event",
      organizer: {
        name: "Sneha Reddy",
        company: "Innovation Corp",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 3,
      date: "2024-12-28",
      title: "Good venue but room for improvement",
      review:
        "The venue has good facilities and the location is convenient. However, we experienced some issues with the sound system during our product launch, which caused delays. The staff was helpful in resolving the issue, but it affected our event timeline. The catering was average. Overall, it's a decent venue but there's room for improvement in technical support.",
      helpful: 4,
      categories: {
        facilities: 3,
        staff: 4,
        location: 4,
        value: 3,
        cleanliness: 4,
      },
      reply: null,
      verified: true,
    },
    {
      id: 5,
      eventName: "Startup Pitch Competition",
      organizer: {
        name: "Karan Singh",
        company: "Startup Hub",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      date: "2024-12-20",
      title: "Great atmosphere for startup events",
      review:
        "The Executive Hall A was perfect for our startup pitch competition. The acoustics were excellent, and the lighting created a great atmosphere for presentations. The registration area was well-organized, and the staff helped with smooth check-ins. The only minor issue was that the air conditioning was a bit too cold in the evening. Overall, a great experience!",
      helpful: 9,
      categories: {
        facilities: 4,
        staff: 4,
        location: 4,
        value: 4,
        cleanliness: 4,
      },
      reply: {
        date: "2024-12-22",
        message:
          "Thank you for the wonderful feedback, Karan! We're thrilled that the venue provided the perfect atmosphere for your startup pitch competition. We've noted your feedback about the air conditioning and will ensure better temperature control for evening events.",
      },
      verified: true,
    },
  ]

  const overallStats = {
    averageRating: 4.2,
    totalReviews: 89,
    ratingDistribution: {
      5: 45,
      4: 28,
      3: 12,
      2: 3,
      1: 1,
    },
    categoryAverages: {
      facilities: 4.3,
      staff: 4.6,
      location: 4.1,
      value: 3.9,
      cleanliness: 4.4,
    },
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating
    const matchesSearch =
      review.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.organizer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRating && matchesSearch
  })

  const handleReply = (reviewId: number) => {
    if (replyText.trim()) {
      // Handle reply submission logic
      console.log("Replying to review:", reviewId, replyText)
      setReplyText("")
      setSelectedReview(null)
    }
  }

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    }

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const ReviewCard = ({ review }: { review: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={review.organizer.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {review.organizer.name
                  .split(" ")
                  .map((n:any) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{review.organizer.name}</h4>
                {review.verified && (
                  <Badge variant="outline" className="text-green-600 bg-green-50">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{review.organizer.company}</p>
              <p className="text-sm text-blue-600 font-medium">{review.eventName}</p>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
            {review.rating}/5
          </Badge>
        </div>

        <div className="mb-4">
          <h5 className="font-medium mb-2">{review.title}</h5>
          <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
        </div>

        {/* Category Ratings */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          {Object.entries(review.categories).map(([category, rating]) => (
            <div key={category} className="text-center">
              <div className="text-xs text-gray-600 capitalize mb-1">{category}</div>
              <div className="flex items-center justify-center">{renderStars(rating as number, "sm")}</div>
            </div>
          ))}
        </div>

        {/* Existing Reply */}
        {review.reply && (
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Venue Response</span>
              <span className="text-xs text-blue-600">{review.reply.date}</span>
            </div>
            <p className="text-sm text-blue-700">{review.reply.message}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
              <ThumbsUp className="w-4 h-4" />
              Helpful ({review.helpful})
            </button>
          </div>
          <div className="flex items-center gap-2">
            {!review.reply && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReview(selectedReview === review.id ? null : review.id)}
              >
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </Button>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {selectedReview === review.id && !review.reply && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response to this review..."
              rows={3}
              className="mb-3"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedReview(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleReply(review.id)}>
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-yellow-600">
            {overallStats.averageRating}/5 Average
          </Badge>
          <Badge variant="outline">{overallStats.totalReviews} Reviews</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{overallStats.averageRating}</div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(overallStats.averageRating), "md")}
                </div>
                <div className="text-gray-600">Overall Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{overallStats.totalReviews}</div>
                <div className="text-gray-600">Total Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((overallStats.ratingDistribution[5] / overallStats.totalReviews) * 100)}%
                </div>
                <div className="text-gray-600">5-Star Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(
                    ((overallStats.ratingDistribution[4] + overallStats.ratingDistribution[5]) /
                      overallStats.totalReviews) *
                      100,
                  )}
                  %
                </div>
                <div className="text-gray-600">Positive Reviews</div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
              </CardHeader>
              
             <CardContent className="space-y-3">
  {[5, 4, 3, 2, 1].map((rating) => {
    const key = rating as RatingKey; // ✅ tell TS the exact key type
    return (
      <div key={key} className="flex items-center gap-3">
        <div className="flex items-center gap-1 w-12">
          <span className="text-sm">{key}</span>
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{
              width: `${
                (overallStats.ratingDistribution[key] / overallStats.totalReviews) * 100
              }%`,
            }}
          />
        </div>
        <span className="text-sm text-gray-600 w-8">
          {overallStats.ratingDistribution[key]}
        </span>
      </div>
    );
  })}
</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Averages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(overallStats.categoryAverages).map(([category, rating]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(rating), "sm")}
                      <span className="text-sm text-gray-600 w-8">{rating}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{review.organizer.name}</h4>
                      <p className="text-sm text-gray-600">{review.eventName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{review.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search reviews by event, organizer, or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Review Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <Badge variant="outline" className="text-green-600">
                      +12 reviews
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Rating Trend</span>
                    <Badge variant="outline" className="text-green-600">
                      ↑ 0.2
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Rate</span>
                    <Badge variant="outline" className="text-blue-600">
                      85%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Parking</span>
                    <Badge variant="outline" className="text-yellow-600">
                      3.2/5
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WiFi Speed</span>
                    <Badge variant="outline" className="text-yellow-600">
                      3.5/5
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Value for Money</span>
                    <Badge variant="outline" className="text-yellow-600">
                      3.9/5
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
