"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Reply, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface ReviewReply {
  id: string
  content: string
  createdAt: string
  isOrganizerReply: boolean
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
}

interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  event?: {
    id: string
    title: string
  }
  replies: ReviewReply[]
}

interface ReviewCardProps {
  review: Review
  organizerId: string
  onReplyAdded?: (reviewId: string, newReply: ReviewReply) => void
  hideReplyButton?: boolean // Add this prop
}

export function ReviewCard({ review, organizerId, onReplyAdded, hideReplyButton = false }: ReviewCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const handleSubmitReply = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a reply.",
        variant: "destructive",
      })
      return
    }

    if (!replyContent.trim()) {
      toast({
        title: "Reply Required",
        description: "Please write a reply before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/organizers/${organizerId}/reviews/${review.id}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit reply")
      }

      const replyData = await response.json()

      // Call the callback to update the parent component
      if (onReplyAdded) {
        onReplyAdded(review.id, replyData)
      }

      // Reset form
      setReplyContent("")
      setShowReplyForm(false)

      toast({
        title: "Success",
        description: "Your reply has been submitted!",
      })
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit reply",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isOrganizer = session?.user?.id === organizerId

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* User Avatar */}
          <Avatar className="w-12 h-12">
            <AvatarImage src={review.user.avatar} alt={`${review.user.firstName} ${review.user.lastName}`} />
            <AvatarFallback>
              {review.user.firstName[0]}
              {review.user.lastName[0]}
            </AvatarFallback>
          </Avatar>

          {/* Review Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {review.user.firstName} {review.user.lastName}
                </h4>
                {review.event && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {review.event.title}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                {renderStars(review.rating)}
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </div>

            {/* Review Title */}
            {review.title && (
              <h5 className="font-medium text-gray-900">{review.title}</h5>
            )}

            {/* Review Comment */}
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>

            {/* Reply Button - Conditionally rendered */}
            {!hideReplyButton && (isOrganizer || session?.user) && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </Button>
              </div>
            )}

            {/* Reply Form */}
            {showReplyForm && (
              <div className="pt-4 border-t">
                <Textarea
                  placeholder={isOrganizer ? "Write your response as the organizer..." : "Write your reply..."}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  maxLength={500}
                  rows={3}
                  disabled={isSubmitting}
                  className="mb-2"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{replyContent.length}/500</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReplyForm(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmitReply}
                      disabled={isSubmitting || !replyContent.trim()}
                      className="flex items-center gap-1"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies List */}
            {review.replies && review.replies.length > 0 && (
              <div className="pt-4 border-t">
                <div className="space-y-4">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reply.user.avatar} alt={`${reply.user.firstName} ${reply.user.lastName}`} />
                        <AvatarFallback>
                          {reply.user.firstName[0]}
                          {reply.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {reply.user.firstName} {reply.user.lastName}
                          </span>
                          {reply.isOrganizerReply && (
                            <Badge variant="secondary" className="text-xs">
                              Organizer
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}