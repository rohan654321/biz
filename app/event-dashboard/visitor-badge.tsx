"use client"

import { useRef, useEffect } from "react"
import QRCode from "qrcode"

interface VisitorBadgeProps {
  attendee: {
    id: string
    firstName: string
    lastName: string
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
  onGenerated?: (dataUrl: string) => void
}

export function VisitorBadge({ attendee, event, organizer, onGenerated }: VisitorBadgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    generateBadge()
  }, [attendee, event, organizer])

  const generateBadge = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size (standard badge size: 4" x 6" at 300 DPI = 1200 x 1800 pixels)
    canvas.width = 600
    canvas.height = 900

    // Background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Top red section
    ctx.fillStyle = "#dc2626"
    ctx.fillRect(0, 0, canvas.width, 120)

    // Event logo (top left)
    if (event.images && event.images[0]) {
      try {
        const eventLogo = new Image()
        eventLogo.crossOrigin = "anonymous"
        eventLogo.src = event.images[0]
        await new Promise((resolve) => {
          eventLogo.onload = resolve
        })
        ctx.drawImage(eventLogo, 20, 20, 80, 80)
      } catch (error) {
        console.error("Error loading event logo:", error)
      }
    }

    // Organizer logo (top right)
    if (organizer.avatar) {
      try {
        const organizerLogo = new Image()
        organizerLogo.crossOrigin = "anonymous"
        organizerLogo.src = organizer.avatar
        await new Promise((resolve) => {
          organizerLogo.onload = resolve
        })
        ctx.drawImage(organizerLogo, canvas.width - 100, 20, 80, 80)
      } catch (error) {
        console.error("Error loading organizer logo:", error)
      }
    }

    // Event title on red background
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    const eventTitle = event.title.toUpperCase()
    ctx.fillText(eventTitle.substring(0, 30), canvas.width / 2, 60)

    // Visitor name (large, centered)
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 48px Arial"
    ctx.textAlign = "center"
    const fullName = `${attendee.firstName} ${attendee.lastName}`.toUpperCase()
    ctx.fillText(fullName, canvas.width / 2, 250)

    // Job title
    if (attendee.jobTitle) {
      ctx.fillStyle = "#4b5563"
      ctx.font = "24px Arial"
      ctx.fillText(attendee.jobTitle, canvas.width / 2, 300)
    }

    // Company
    if (attendee.company) {
      ctx.fillStyle = "#6b7280"
      ctx.font = "20px Arial"
      ctx.fillText(attendee.company, canvas.width / 2, 340)
    }

    // Generate QR code
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(`${window.location.origin}/attendee/${attendee.id}`, {
        width: 250,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })

      const qrImage = new Image()
      qrImage.src = qrCodeDataUrl
      await new Promise((resolve) => {
        qrImage.onload = resolve
      })

      // Draw QR code centered
      const qrSize = 250
      const qrX = (canvas.width - qrSize) / 2
      const qrY = 400
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }

    // Bottom red section with "VISITOR" text
    ctx.fillStyle = "#dc2626"
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 36px Arial"
    ctx.textAlign = "center"
    ctx.fillText("VISITOR", canvas.width / 2, canvas.height - 35)

    // Call onGenerated callback with the canvas data URL
    if (onGenerated) {
      onGenerated(canvas.toDataURL("image/png"))
    }
  }

  return (
    <div className="hidden">
      <canvas ref={canvasRef} />
    </div>
  )
}
