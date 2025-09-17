// components/exhibitors-tab.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface Exhibitor {
  id: string
  boothId: string
  company: string
  name: string
  email: string
  phone?: string
  logo: string
  description?: string
  boothNumber: string
  status: string
  totalCost: number
  spaceReference?: string
  isSample?: boolean // Add this to identify sample data
  userId?: string // The actual user ID for scheduling meetings
}

interface ExhibitorsTabProps {
  eventId: string
}

export default function ExhibitorsTab({ eventId }: ExhibitorsTabProps) {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState<string | null>(null)
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/events/exhibitors?eventId=${eventId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch exhibitors: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Fetched exhibitors:", data.booths)
        setExhibitors(data.booths || [])
      } catch (err) {
        console.error("Error fetching exhibitors:", err)
        setError(err instanceof Error ? err.message : "Failed to load exhibitors")
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchExhibitors()
    }
  }, [eventId])

  // Sample exhibitors with isSample flag
  const fallbackExhibitors: Exhibitor[] = [
    {
      id: "sample-1",
      boothId: "booth-1",
      company: "Tech Solutions Inc.",
      name: "John Doe",
      email: "info@techsolutions.com",
      phone: "1234567890",
      logo: "/placeholder.svg?height=96&width=96&text=Tech",
      description: "Leading provider of tech solutions.",
      boothNumber: "A1",
      status: "BOOKED",
      totalCost: 1000,
      spaceReference: "SR-1",
      isSample: true,
    },
    {
      id: "sample-2",
      boothId: "booth-2",
      company: "Innovation Labs",
      name: "Jane Smith",
      email: "contact@innovationlabs.com",
      phone: "9876543210",
      logo: "/placeholder.svg?height=96&width=96&text=Labs",
      description: "Innovation in every step.",
      boothNumber: "B2",
      status: "PENDING",
      totalCost: 800,
      spaceReference: "SR-2",
      isSample: true,
    },
    {
      id: "sample-3",
      boothId: "booth-3",
      company: "Digital Systems",
      name: "Mike Brown",
      email: "hello@digitalsystems.com",
      logo: "/placeholder.svg?height=96&width=96&text=Digital",
      boothNumber: "C3",
      status: "BOOKED",
      totalCost: 1200,
      isSample: true,
    },
    {
      id: "sample-4",
      boothId: "booth-4",
      company: "Smart Technologies",
      name: "Alice Johnson",
      email: "team@smarttech.com",
      logo: "/placeholder.svg?height=96&width=96&text=Smart",
      boothNumber: "D4",
      status: "BOOKED",
      totalCost: 950,
      isSample: true,
    },
    {
      id: "sample-5",
      boothId: "booth-5",
      company: "Future Tech",
      name: "Robert Lee",
      email: "future@futuretech.com",
      logo: "/placeholder.svg?height=96&width=96&text=Future",
      boothNumber: "E5",
      status: "CANCELLED",
      totalCost: 700,
      isSample: true,
    },
    {
      id: "sample-6",
      boothId: "booth-6",
      company: "Cloud Services",
      name: "Sophia White",
      email: "support@cloudservices.com",
      logo: "/placeholder.svg?height=96&width=96&text=Cloud",
      boothNumber: "F6",
      status: "BOOKED",
      totalCost: 1500,
      isSample: true,
    },
  ]

  const handleScheduleMeeting = async (exhibitor: Exhibitor) => {
    try {
      setCreating(exhibitor.id)

      // Check if this is a sample exhibitor
      if (exhibitor.isSample) {
        toast({
          title: "Demo Mode",
          description: "This is a sample exhibitor. Please add real exhibitors to schedule actual meetings.",
          variant: "destructive",
        })
        return
      }

      // Verify we have a valid session
      if (!session?.user?.id) {
        toast({
          title: "Authentication Required",
          description: "Please log in to schedule meetings.",
          variant: "destructive",
        })
        return
      }

      const exhibitorUserId = exhibitor.userId || exhibitor.id

      const body = {
        eventId,
        exhibitorId: exhibitorUserId, // Use the actual user ID, not booth ID
        requesterId: session.user.id,
        title: `Meeting with ${exhibitor.company}`,
        description: `Meeting request with ${exhibitor.name} from ${exhibitor.company}`,
        requestedDate: new Date().toISOString().split("T")[0],
        requestedTime: "09:00",
        duration: 30,
        purpose: "Networking",
      }

      console.log("Scheduling meeting with body:", body)

      const res = await fetch(`/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      console.log("API response:", data)

      if (!res.ok) {
        throw new Error(data.error || `Failed to create appointment: ${res.status}`)
      }

      toast({
        title: "Success",
        description: `Meeting request sent to ${exhibitor.company}!`,
      })
    } catch (err) {
      console.error("Error scheduling meeting:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to schedule meeting",
        variant: "destructive",
      })
    } finally {
      setCreating(null)
    }
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading exhibitors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const displayExhibitors = exhibitors.length > 0 ? exhibitors : fallbackExhibitors
  const hasRealExhibitors = exhibitors.length > 0

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Exhibitor List</h2>
        <p className="text-sm text-gray-500">
          {hasRealExhibitors
            ? `${exhibitors.length} Exhibitors of Current Edition`
            : "Sample exhibitors (No registrations yet)"}
        </p>
      </div>

      {!hasRealExhibitors && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Demo Mode:</strong> No exhibitors have registered for this event yet. Showing sample exhibitors for
            demonstration. The "Schedule Meeting" button will be disabled for sample data.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayExhibitors?.map((exhibitor) => (
          <Card key={exhibitor.id} className="border hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <Image
                    src={exhibitor.logo || "/placeholder.svg?height=96&width=96&text=Logo"}
                    alt={`${exhibitor.company} logo`}
                    width={64}
                    height={64}
                    className="object-contain shadow-sm rounded-md border border-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <button className="px-3 py-1 text-red-600 text-sm border-2 border-red-600 rounded-md hover:bg-red-50 transition">
                    +Follow
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-700">
                  {exhibitor.company}
                  {exhibitor.isSample && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Sample</span>
                  )}
                </h3>

                {/* Booth Number */}
                {exhibitor.boothNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Booth:</span>
                    <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded">{exhibitor.boothNumber}</span>
                  </div>
                )}

                {/* Contact Person */}
                {exhibitor.name && <p className="text-sm text-gray-600">{exhibitor.name}</p>}

                {/* Status */}
                {exhibitor.status && (
                  <div className="flex items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        exhibitor.status === "BOOKED"
                          ? "bg-green-100 text-green-800"
                          : exhibitor.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {exhibitor.status}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleScheduleMeeting(exhibitor)}
                disabled={creating === exhibitor.id}
                className={`w-full mt-4 border-2 text-sm py-2 rounded-full font-semibold transition flex items-center justify-center ${
                  exhibitor.isSample
                    ? "border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed"
                    : "border-red-600 text-white bg-red-600 hover:bg-red-700"
                }`}
              >
                {creating === exhibitor.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scheduling...
                  </>
                ) : (
                  <>{exhibitor.isSample ? "Sample Data" : "Schedule Meeting"}</>
                )}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {exhibitors.length > 6 && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="px-6 bg-transparent">
            Load More Exhibitors
          </Button>
        </div>
      )}
    </div>
  )
}
