"use client"

import { useEffect, useState } from "react"
import { Loader2, Building, Mail, Calendar, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ExhibitorBooth {
  id: string
  boothNumber: string
  company: string
  name: string
  email: string
  phone?: string
  description?: string
  totalCost?: number
  status?: string
  event: {
    id: string
    title: string
    startDate: string
    endDate: string
    organizerId: string
  }
}

interface ExhibitorsForEventProps {
  eventId: string
}

export default function ExhibitorsForEvent({ eventId }: ExhibitorsForEventProps) {
  const { toast } = useToast()
  const [booths, setBooths] = useState<ExhibitorBooth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/events/exhibitors?eventId=${eventId}`)
        if (!res.ok) throw new Error("Failed to fetch exhibitors")
        const data = await res.json()
        setBooths(data.booths || [])
      } catch (err) {
        console.error("Error fetching exhibitors:", err)
        setError("Failed to load exhibitors")
        toast({
          title: "Error",
          description: "Failed to load exhibitors",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (eventId) fetchExhibitors()
  }, [eventId, toast])

  const handleStatusUpdate = async (boothId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/events/exhibitors/${boothId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      // Update local state
      setBooths(prevBooths =>
        prevBooths.map(booth =>
          booth.id === boothId ? { ...booth, status: newStatus } : booth
        )
      )

      toast({
        title: "Success",
        description: "Status updated successfully",
      })
    } catch (err) {
      console.error("Error updating status:", err)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = (booth: ExhibitorBooth) => {
    // Implement send email functionality
    console.log("Send email to:", booth.email)
    toast({
      title: "Send Email",
      description: `Email would be sent to ${booth.email}`,
    })
  }

  const handleSendBadge = (booth: ExhibitorBooth) => {
    // Implement send badge functionality
    console.log("Send badge to:", booth.name)
    toast({
      title: "Send Badge",
      description: `Badge would be sent to ${booth.name}`,
    })
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "WAITLIST":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading exhibitors...</span>
      </div>
    )
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-600">{error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exhibitors for Event</CardTitle>
      </CardHeader>
      <CardContent>
        {booths.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No exhibitors found for this event</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exhibitor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Booth</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booths?.map((booth) => (
                <TableRow key={booth.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    {booth.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {booth.email}
                    </div>
                    {booth.phone && (
                      <div className="text-sm text-gray-500 mt-1">{booth.phone}</div>
                    )}
                  </TableCell>
                  <TableCell>{booth.company}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {booth.event?.title}
                  </TableCell>
                  <TableCell>{booth.boothNumber}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Send Email */}
                        <DropdownMenuItem onClick={() => handleSendEmail(booth)}>
                          Send Email
                        </DropdownMenuItem>

                        {/* Send Badge */}
                        <DropdownMenuItem onClick={() => handleSendBadge(booth)}>
                          Send Badge
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}