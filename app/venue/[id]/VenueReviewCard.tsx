"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

interface VenueReviewCardProps {
  review: Review
}

export function VenueReviewCard({ review }: VenueReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const fullName = `${review.user.firstName} ${review.user.lastName}`
  const initials = `${review.user.firstName[0]}${review.user.lastName[0]}`

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900">{fullName}</h4>
            <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          {review.title && <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>}
          <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}
