"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  eventId: string
  eventTitle: string
  className?: string
}

export function ShareButton({ eventId, eventTitle, className = "" }: ShareButtonProps) {
  const { toast } = useToast()

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent default behavior
    e.stopPropagation() // Stop event from bubbling up to parent

    const shareUrl = `${window.location.origin}/event/${eventId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: "Check out this event!",
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled the share or error occurred
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied!",
          description: "Event link copied to clipboard",
        })
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={`hover:bg-gray-100 ${className}`}
    >
      <Share2 className="w-4 h-4" />
    </Button>
  )
}