"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Send,
  Paperclip,
  Bell,
  CheckCircle,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Megaphone,
} from "lucide-react"

export default function CommunicationCenter() {
  const [selectedConversation, setSelectedConversation] = useState("1")
  const [newMessage, setNewMessage] = useState("")
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [selectedOrganizers, setSelectedOrganizers] = useState<string[]>([])
  const [broadcastType, setBroadcastType] = useState("email")

  const conversations = [
    {
      id: "1",
      eventName: "Global Tech Conference 2025",
      organizer: {
        name: "Rajesh Kumar",
        company: "TechEvents India",
        role: "Event Manager",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: "Hi! We need to discuss the stage setup for the keynote. Can we schedule a call?",
      lastMessageTime: "2025-01-22 2:30 PM",
      unreadCount: 2,
      priority: "high",
      status: "active",
    },
    {
      id: "2",
      eventName: "Healthcare Innovation Summit",
      organizer: {
        name: "Dr. Priya Sharma",
        company: "MedTech Solutions",
        role: "Conference Director",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: "Thank you for the venue tour. The facilities look perfect for our summit.",
      lastMessageTime: "2025-01-21 4:15 PM",
      unreadCount: 0,
      priority: "normal",
      status: "active",
    },
    {
      id: "3",
      eventName: "Annual Sales Meeting",
      organizer: {
        name: "Amit Patel",
        company: "Corporate Solutions Ltd",
        role: "Operations Manager",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: "We might need to extend the booking by 2 hours. Is that possible?",
      lastMessageTime: "2025-01-20 11:45 AM",
      unreadCount: 1,
      priority: "medium",
      status: "pending",
    },
  ]

  const messages = [
    {
      id: 1,
      conversationId: "1",
      sender: "organizer",
      senderName: "Rajesh Kumar",
      message: "Hi! Thank you for confirming our booking for the Global Tech Conference.",
      timestamp: "2025-01-20 10:00 AM",
      attachments: [],
    },
    {
      id: 2,
      conversationId: "1",
      sender: "venue",
      senderName: "Venue Manager",
      message:
        "You're welcome! We're excited to host your conference. Is there anything specific you need for the setup?",
      timestamp: "2025-01-20 10:15 AM",
      attachments: [],
    },
    {
      id: 3,
      conversationId: "1",
      sender: "organizer",
      senderName: "Rajesh Kumar",
      message:
        "Yes, we'll need a special stage setup for our keynote speaker. I'm attaching the technical requirements.",
      timestamp: "2025-01-20 10:30 AM",
      attachments: [
        { name: "Stage_Requirements.pdf", size: "2.1 MB" },
        { name: "AV_Setup_Diagram.jpg", size: "1.8 MB" },
      ],
    },
    {
      id: 4,
      conversationId: "1",
      sender: "venue",
      senderName: "Venue Manager",
      message:
        "Perfect! I've reviewed the requirements. Our technical team can handle this setup. Let me get you a quote.",
      timestamp: "2025-01-21 9:00 AM",
      attachments: [],
    },
    {
      id: 5,
      conversationId: "1",
      sender: "organizer",
      senderName: "Rajesh Kumar",
      message: "Hi! We need to discuss the stage setup for the keynote. Can we schedule a call?",
      timestamp: "2025-01-22 2:30 PM",
      attachments: [],
    },
  ]

  const notifications = [
    {
      id: 1,
      type: "booking",
      title: "New Booking Request",
      message: "Digital Marketing Summit 2025 has requested Grand Ballroom for May 15-16",
      timestamp: "2025-01-22 3:00 PM",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      message: "Healthcare Innovation Summit has completed their advance payment",
      timestamp: "2025-01-22 1:30 PM",
      read: false,
      priority: "normal",
    },
    {
      id: 3,
      type: "reminder",
      title: "Setup Reminder",
      message: "Global Tech Conference setup starts tomorrow at 6:00 PM",
      timestamp: "2025-01-22 9:00 AM",
      read: true,
      priority: "medium",
    },
    {
      id: 4,
      type: "inquiry",
      title: "General Inquiry",
      message: "New inquiry about venue availability for corporate events",
      timestamp: "2025-01-21 5:45 PM",
      read: true,
      priority: "low",
    },
  ]

  const organizers = [
    { id: "1", name: "Rajesh Kumar", company: "TechEvents India", event: "Global Tech Conference 2025" },
    { id: "2", name: "Dr. Priya Sharma", company: "MedTech Solutions", event: "Healthcare Innovation Summit" },
    { id: "3", name: "Amit Patel", company: "Corporate Solutions Ltd", event: "Annual Sales Meeting" },
    { id: "4", name: "Sneha Reddy", company: "Marketing Pro Events", event: "Digital Marketing Summit 2025" },
  ]

  const currentConversation = conversations.find((c) => c.id === selectedConversation)
  const conversationMessages = messages.filter((m) => m.conversationId === selectedConversation)

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Handle message sending logic
      setNewMessage("")
    }
  }

  const sendBroadcast = () => {
    if (broadcastMessage.trim() && selectedOrganizers.length > 0) {
      // Handle broadcast sending logic
      setBroadcastMessage("")
      setSelectedOrganizers([])
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "payment":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "reminder":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "inquiry":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const handleOrganizerSelection = (organizerId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrganizers([...selectedOrganizers, organizerId])
    } else {
      setSelectedOrganizers(selectedOrganizers.filter((id) => id !== organizerId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Communication Center</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-red-600">
            {notifications.filter((n) => !n.read).length} Unread
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`w-full text-left p-4 hover:bg-gray-50 border-b transition-colors ${
                          selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.organizer.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {conversation.organizer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {conversation.organizer.name}
                              </h4>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{conversation.organizer.company}</p>
                            <p className="text-xs text-blue-600 font-medium truncate">{conversation.eventName}</p>
                            <p className="text-xs text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-400">{conversation.lastMessageTime}</span>
                              {conversation.priority !== "normal" && (
                                <Badge className={getPriorityColor(conversation.priority)} variant="outline">
                                  {conversation.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messages */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  {currentConversation && (
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{currentConversation.organizer.name}</CardTitle>
                        <p className="text-sm text-gray-600">{currentConversation.organizer.company}</p>
                        <p className="text-sm text-blue-600 font-medium">{currentConversation.eventName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "venue" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "venue" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className={`flex items-center space-x-2 p-2 rounded ${
                                  message.sender === "venue" ? "bg-blue-700" : "bg-gray-200"
                                }`}
                              >
                                <Paperclip className="h-3 w-3" />
                                <span className="text-xs">{attachment.name}</span>
                                <span className="text-xs opacity-75">({attachment.size})</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${message.sender === "venue" ? "text-blue-200" : "text-gray-500"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button size="sm" variant="outline">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Logs</span>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <Badge variant="destructive">{notifications.filter((n) => !n.read).length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                        <Badge className={getPriorityColor(notification.priority)} variant="outline">
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Megaphone className="h-5 w-5" />
                <span>Broadcast to Organizers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Recipients</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      <div className="flex items-center space-x-2 pb-2 border-b">
                        <Checkbox
                          id="select-all"
                          checked={selectedOrganizers.length === organizers.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrganizers(organizers.map((o) => o.id))
                            } else {
                              setSelectedOrganizers([])
                            }
                          }}
                        />
                        <label htmlFor="select-all" className="text-sm font-medium">
                          Select All Organizers
                        </label>
                      </div>
                      {organizers.map((organizer) => (
                        <div key={organizer.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={organizer.id}
                            checked={selectedOrganizers.includes(organizer.id)}
                            onCheckedChange={(checked) => handleOrganizerSelection(organizer.id, checked as boolean)}
                          />
                          <label htmlFor={organizer.id} className="text-sm flex-1">
                            <div className="font-medium">{organizer.name}</div>
                            <div className="text-gray-600">{organizer.company}</div>
                            <div className="text-blue-600 text-xs">{organizer.event}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Broadcast Method</label>
                    <Select value={broadcastType} onValueChange={setBroadcastType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="all">All Methods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="Type your broadcast message here..."
                      rows={8}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">{selectedOrganizers.length} recipient(s) selected</div>
                    <Button
                      onClick={sendBroadcast}
                      disabled={!broadcastMessage.trim() || selectedOrganizers.length === 0}
                      className="flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send Broadcast</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Message Templates */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Quick Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="text-left h-auto p-3 bg-transparent"
                    onClick={() =>
                      setBroadcastMessage(
                        "Reminder: Please confirm your event setup requirements by [date]. Contact us if you need any assistance.",
                      )
                    }
                  >
                    <div>
                      <div className="font-medium text-sm">Setup Reminder</div>
                      <div className="text-xs text-gray-600">Remind about setup requirements</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left h-auto p-3 bg-transparent"
                    onClick={() =>
                      setBroadcastMessage(
                        "Important: Due to maintenance work, parking will be limited on [date]. Please inform your attendees about alternative parking options.",
                      )
                    }
                  >
                    <div>
                      <div className="font-medium text-sm">Facility Update</div>
                      <div className="text-xs text-gray-600">Notify about facility changes</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left h-auto p-3 bg-transparent"
                    onClick={() =>
                      setBroadcastMessage(
                        "Payment reminder: Your event payment is due on [date]. Please complete the payment to confirm your booking.",
                      )
                    }
                  >
                    <div>
                      <div className="font-medium text-sm">Payment Reminder</div>
                      <div className="text-xs text-gray-600">Send payment reminders</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left h-auto p-3 bg-transparent"
                    onClick={() =>
                      setBroadcastMessage(
                        "Thank you for choosing our venue for your event. We look forward to making your event a great success!",
                      )
                    }
                  >
                    <div>
                      <div className="font-medium text-sm">Welcome Message</div>
                      <div className="text-xs text-gray-600">Welcome new organizers</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
