"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Building,
  IndianRupee,
} from "lucide-react"

export default function BookingSystem() {
  const [activeTab, setActiveTab] = useState("requests")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  // Mock booking requests data
  const bookingRequests = [
    {
      id: 1,
      eventName: "Digital Marketing Summit 2025",
      organizer: {
        name: "Marketing Pro Events",
        contact: "Rahul Gupta",
        email: "rahul@marketingpro.com",
        phone: "+91 98765 43210",
        company: "Marketing Pro Events Pvt Ltd",
      },
      requestedDate: "May 15-16, 2025",
      requestedHalls: ["Grand Ballroom", "Executive Hall A"],
      expectedAttendees: 1200,
      eventType: "Conference",
      duration: "2 days",
      setupRequirements: "Stage setup, AV equipment, registration desk",
      cateringRequired: true,
      estimatedBudget: "₹8,50,000",
      status: "Pending Review",
      submittedDate: "2025-01-20",
      priority: "High",
      notes: "Premium corporate event with international speakers",
    },
    {
      id: 2,
      eventName: "Annual Shareholders Meeting",
      organizer: {
        name: "Corporate Solutions Ltd",
        contact: "Priya Sharma",
        email: "priya@corpsol.com",
        phone: "+91 87654 32109",
        company: "Corporate Solutions Ltd",
      },
      requestedDate: "April 10, 2025",
      requestedHalls: ["Executive Hall B"],
      expectedAttendees: 300,
      eventType: "Corporate Meeting",
      duration: "1 day",
      setupRequirements: "Boardroom style seating, projector, microphones",
      cateringRequired: true,
      estimatedBudget: "₹2,50,000",
      status: "Under Negotiation",
      submittedDate: "2025-01-18",
      priority: "Medium",
      notes: "Annual meeting with board members and key stakeholders",
    },
    {
      id: 3,
      eventName: "Tech Startup Showcase",
      organizer: {
        name: "Startup Hub India",
        contact: "Amit Patel",
        email: "amit@startuphub.com",
        phone: "+91 76543 21098",
        company: "Startup Hub India",
      },
      requestedDate: "June 5-6, 2025",
      requestedHalls: ["Exhibition Hall", "Meeting Room 1", "Meeting Room 2"],
      expectedAttendees: 800,
      eventType: "Exhibition",
      duration: "2 days",
      setupRequirements: "Exhibition booths, networking area, demo stations",
      cateringRequired: true,
      estimatedBudget: "₹6,00,000",
      status: "Pending Review",
      submittedDate: "2025-01-22",
      priority: "Medium",
      notes: "Startup exhibition with investor meetings and product demos",
    },
  ]

  const confirmedBookings = [
    {
      id: 4,
      eventName: "Global Tech Conference 2025",
      organizer: {
        name: "TechEvents India",
        contact: "Rajesh Kumar",
        email: "rajesh@techevents.com",
        phone: "+91 98765 43210",
      },
      confirmedDate: "March 15-17, 2025",
      halls: ["Grand Ballroom"],
      attendees: 1500,
      status: "Confirmed",
      paymentStatus: "Paid",
      contractSigned: true,
      totalAmount: "₹12,00,000",
    },
    {
      id: 5,
      eventName: "Healthcare Innovation Summit",
      organizer: {
        name: "MedTech Solutions",
        contact: "Dr. Priya Sharma",
        email: "priya@medtech.com",
        phone: "+91 87654 32109",
      },
      confirmedDate: "April 22-24, 2025",
      halls: ["Executive Hall A", "Executive Hall B"],
      attendees: 800,
      status: "Confirmed",
      paymentStatus: "Advance Paid",
      contractSigned: true,
      totalAmount: "₹9,50,000",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review":
        return "bg-yellow-500"
      case "Under Negotiation":
        return "bg-blue-500"
      case "Confirmed":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const handleApproveBooking = (bookingId: number) => {
    // Handle booking approval logic
    console.log("Approving booking:", bookingId)
  }

  const handleRejectBooking = (bookingId: number) => {
    // Handle booking rejection logic
    console.log("Rejecting booking:", bookingId)
  }

  const BookingRequestCard = ({ booking }: { booking: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{booking.eventName}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {booking.organizer.company}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Contact: {booking.organizer.contact}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {booking.organizer.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {booking.organizer.phone}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            <Badge variant="outline" className={getPriorityColor(booking.priority)}>
              {booking.priority}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Requested Date</span>
            </div>
            <p className="text-gray-600">{booking.requestedDate}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Halls</span>
            </div>
            <p className="text-gray-600">{booking.requestedHalls.join(", ")}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Attendees</span>
            </div>
            <p className="text-gray-600">{booking.expectedAttendees} people</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-green-500" />
              <span className="font-medium">Budget</span>
            </div>
            <p className="text-gray-600">{booking.estimatedBudget}</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Setup Requirements:</h4>
          <p className="text-sm text-gray-700">{booking.setupRequirements}</p>
          {booking.cateringRequired && <p className="text-sm text-blue-600 mt-1">• Catering services required</p>}
        </div>

        {booking.notes && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm text-blue-800 mb-1">Notes:</h4>
            <p className="text-sm text-blue-700">{booking.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Submitted: {booking.submittedDate}</div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Booking Request Details</DialogTitle>
                </DialogHeader>
                {selectedBooking && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Event Name</label>
                        <p className="text-gray-600">{selectedBooking.eventName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Event Type</label>
                        <p className="text-gray-600">{selectedBooking.eventType}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Response Message</label>
                      <Textarea placeholder="Add your response or questions..." className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select defaultValue={selectedBooking.status}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                            <SelectItem value="Under Negotiation">Under Negotiation</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select defaultValue={selectedBooking.priority}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          {/* <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent> */}
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Send Message</Button>
                      <Button>Update Status</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>

            {booking.status === "Pending Review" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApproveBooking(booking.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleRejectBooking(booking.id)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ConfirmedBookingCard = ({ booking }: { booking: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{booking.eventName}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {booking.organizer.name}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Contact: {booking.organizer.contact}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {booking.confirmedDate}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {booking.halls.join(", ")}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            <Badge variant="outline" className="text-green-600 bg-green-50">
              {booking.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-600">{booking.attendees}</div>
            <div className="text-sm text-gray-600">Attendees</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-600">{booking.totalAmount}</div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="font-semibold text-purple-600">{booking.contractSigned ? "Signed" : "Pending"}</div>
            <div className="text-sm text-gray-600">Contract</div>
          </div>
        </div> */}

            {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Contract
            </Button>
            <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact
            </Button>
            </div> */}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hall & Space Booking System</h1>
        <Button className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Availability Calendar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{bookingRequests.length}</div>
            <div className="text-gray-600">Pending Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{confirmedBookings.length}</div>
            <div className="text-gray-600">Confirmed Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {bookingRequests.filter((b) => b.priority === "High").length}
            </div>
            <div className="text-gray-600">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">85%</div>
            <div className="text-gray-600">Occupancy Rate</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Booking Requests</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed Bookings</TabsTrigger>
          <TabsTrigger value="calendar">Availability Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {bookingRequests.map((booking) => (
            <BookingRequestCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedBookings.map((booking) => (
            <ConfirmedBookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hall Availability Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">March 2025</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">March 15-17</div>
                        <div className="text-sm text-gray-600">Grand Ballroom</div>
                      </div>
                      <Badge className="bg-red-500">Booked</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">March 20</div>
                        <div className="text-sm text-gray-600">Executive Hall A</div>
                      </div>
                      <Badge className="bg-green-500">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">March 25</div>
                        <div className="text-sm text-gray-600">Meeting Rooms</div>
                      </div>
                      <Badge className="bg-green-500">Available</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">April 2025</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">April 10</div>
                        <div className="text-sm text-gray-600">Executive Hall B</div>
                      </div>
                      <Badge className="bg-yellow-500">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">April 22-24</div>
                        <div className="text-sm text-gray-600">Executive Hall A + B</div>
                      </div>
                      <Badge className="bg-red-500">Booked</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">April 28</div>
                        <div className="text-sm text-gray-600">Grand Ballroom</div>
                      </div>
                      <Badge className="bg-green-500">Available</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
