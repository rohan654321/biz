"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Mail, Loader2 } from "lucide-react"
import { VisitorBadge } from "./visitor-badge"
import { useToast } from "@/hooks/use-toast"

interface BadgeGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  attendee: {
    id: string
    firstName: string
    lastName: string
    email: string
    jobTitle?: string
    company?: string
  }
  event: {
    id: string
    title: string
    images?: string[]
  }
  organizer: {
    avatar?: string
    organizationName?: string
  }
}

export function BadgeGeneratorDialog({ open, onOpenChange, attendee, event, organizer }: BadgeGeneratorDialogProps) {
  const [badgeDataUrl, setBadgeDataUrl] = useState<string>("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const handleDownload = () => {
    if (!badgeDataUrl) return

    const link = document.createElement("a")
    link.download = `visitor-badge-${attendee.firstName}-${attendee.lastName}.png`
    link.href = badgeDataUrl
    link.click()

    toast({
      title: "Badge Downloaded",
      description: "The visitor badge has been downloaded successfully.",
    })
  }

  const handleSendEmail = async () => {
    try {
      setSending(true)

      // In a real implementation, you would send the badge via email
      // For now, we'll simulate the API call
      const response = await fetch(`/api/events/${event.id}/attendees/${attendee.id}/badge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          badgeDataUrl,
          email: attendee.email,
        }),
      })

      if (!response.ok) throw new Error("Failed to send badge")

      toast({
        title: "Badge Sent",
        description: `The visitor badge has been sent to ${attendee.email}`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error sending badge:", error)
      toast({
        title: "Error",
        description: "Failed to send the badge. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visitor Badge</DialogTitle>
            <DialogDescription>
              Preview and send the visitor badge for {attendee.firstName} {attendee.lastName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Badge Preview */}
            <div className="flex justify-center bg-gray-100 p-6 rounded-lg">
              {badgeDataUrl ? (
                <img
                  src={badgeDataUrl || "/placeholder.svg"}
                  alt="Visitor Badge"
                  className="max-w-full h-auto shadow-lg"
                  style={{ maxHeight: "500px" }}
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleDownload} disabled={!badgeDataUrl}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleSendEmail} disabled={!badgeDataUrl || sending}>
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send via Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden badge generator */}
      <VisitorBadge attendee={attendee} event={event} organizer={organizer} onGenerated={setBadgeDataUrl} />
    </>
  )
}
