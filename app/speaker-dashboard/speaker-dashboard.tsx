"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MyProfile } from "./my-profile"
import { MySessions } from "./my-sessions"
import { PresentationMaterials } from "./presentation-materials"
// import { SessionPromotion } from "./speaker-dashboard/session-promotion"
// import { AudienceInteraction } from "./speaker-dashboard/audience-interaction"
// import { NetworkingLeads } from "./speaker-dashboard/networking-leads"
// import { OrganizerCommunication } from "./speaker-dashboard/organizer-communication"
// import { FeedbackRatings } from "./speaker-dashboard/feedback-ratings"
// import { SpeakerSettings } from "./speaker-dashboard/speaker-settings"
import { User, Calendar, Upload, Share2, Users, Network, MessageSquare, Star, Bell, Settings, LogOut, Menu, X } from 'lucide-react'

export function SpeakerDashboard() {
  const [activeSection, setActiveSection] = useState("profile")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "sessions", label: "My Sessions", icon: Calendar, badge: "3" },
    { id: "materials", label: "Presentation Materials", icon: Upload },
    // { id: "promotion", label: "Session Promotion", icon: Share2 },
    // { id: "interaction", label: "Audience Interaction", icon: Users },
    // { id: "networking", label: "Networking & Leads", icon: Network, badge: "89" },
    // { id: "communication", label: "Messages", icon: MessageSquare, badge: "5" },
    // { id: "feedback", label: "Feedback & Ratings", icon: Star },
    // { id: "settings", label: "Settings", icon: Settings },
  ]

  const stats = [
    { title: "Confirmed Sessions", value: "3", icon: Calendar, color: "text-blue-600" },
    { title: "Total Attendees", value: "1,247", icon: Users, color: "text-green-600" },
    { title: "Average Rating", value: "4.8", icon: Star, color: "text-yellow-600" },
    { title: "Networking Leads", value: "89", icon: Network, color: "text-purple-600" },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <MyProfile />
      case "sessions":
        return <MySessions />
      case "materials":
        return <PresentationMaterials />
    //   case "promotion":
    //     return <SessionPromotion />
    //   case "interaction":
    //     return <AudienceInteraction />
    //   case "networking":
    //     return <NetworkingLeads />
    //   case "communication":
    //     return <OrganizerCommunication />
    //   case "feedback":
    //     return <FeedbackRatings />
    //   case "settings":
    //     return <SpeakerSettings />
      default:
        return <MyProfile />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">JS</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">John Smith</h2>
                <p className="text-sm text-gray-500">Speaker</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors
                  ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Speaker Dashboard</h1>
                <p className="text-gray-600">Manage your speaking engagements and sessions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="p-6 bg-white border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
