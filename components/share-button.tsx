"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  id: string
  title: string
  type: 'venue' | 'event' | 'speaker'
  className?: string
}

export function ShareButton({ id, title, type, className = "" }: ShareButtonProps) {
  const { toast } = useToast()

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = `${window.location.origin}/${type}/${id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this ${type}!`,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied!",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} link copied to clipboard`,
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
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={`hover:bg-gray-100 ${className}`}
    >
      <Share2 className="w-4 h-4" />
    </Button>
  )
}