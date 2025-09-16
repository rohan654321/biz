"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AddReviewCardProps {
  eventId: string
  userId?: string
}

export default function AddReviewCard({ eventId, userId }: AddReviewCardProps) {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/events/${eventId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, userId }),
      })

      if (res.ok) {
        alert("✅ Review added successfully!")
        setFeedback("")
      } else {
        alert("❌ Failed to add review")
      }
    } catch (err) {
      console.error(err)
      alert("⚠️ Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Add Your Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            placeholder="Write your review..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            required
          />
       <Button
  type="submit"
  disabled={isSubmitting}
  className="w-48 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
>
  {isSubmitting ? "Submitting..." : "Add Review"}
</Button>

        </form>
      </CardContent>
    </Card>
  )
}
