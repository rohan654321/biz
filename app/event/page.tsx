"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, ChevronDown, Share2, Star, MapPin, Calendar, Heart, Bookmark, User } from "lucide-react"
import Image from "next/image"

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("HR, Jobs & Career")
  const [selectedFormat, setSelectedFormat] = useState("Trade Shows, Conferences,...")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(2)
  const [viewMode, setViewMode] = useState("Trending")

  const tabs = ["HR, Jobs & Career", "Jobs Fair", "Pedagogy", "Top Events"]

  const categories = [
    { name: "Education & Training", count: "33.8k", checked: true },
    { name: "Medical & Pharma", count: "33.8k", checked: false },
    { name: "Medical & Pharma", count: "33.8k", checked: false },
    { name: "Medical & Pharma", count: "33.8k", checked: false },
    { name: "Medical & Pharma", count: "33.8k", checked: false },
    { name: "Medical & Pharma", count: "33.8k", checked: false },
    { name: "Medical & Pharma", count: "33.8k", checked: false },
    { name: "Medical & Pharma", count: "33.8k", checked: false },
  ]

  const relatedTopics = [
    { name: "Education & Training", count: "33.8k" },
    { name: "Medical & Pharma", count: "33.8k" },
  ]

  const events = [
    {
      id: 1,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      description:
        "Asian University is a unique two-day celebration with Brain-loving hands from around the world. Packed with thought-provoking presentations on the intellectual foundations of a free society.",
      category: "Education",
      image: "/images/gpex.jpg",
      interested: 858,
      rating: 4.5,
    },
    {
      id: 2,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      description:
        "Asian University is a unique two-day celebration with Brain-loving hands from around the world. Packed with thought-provoking presentations on the intellectual foundations of a free society.",
      category: "Education",
      image: "/images/gpex.jpg",
      interested: 858,
      rating: 4.5,
    },
    {
      id: 3,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      description:
        "Asian University is a unique two-day celebration with Brain-loving hands from around the world. Packed with thought-provoking presentations on the intellectual foundations of a free society.",
      category: "Education",
      image: "/images/gpex.jpg",
      interested: 858,
      rating: 4.5,
    },
  ]

  const featuredEvents = [
    {
      id: 1,
      title: "Fitness Fest 2025",
      image: "/images/gpex.jpg",
    },
    {
      id: 2,
      title: "Fitness Fest 2025",
      image: "/images/gpex.jpg",
    },
    {
      id: 3,
      title: "Fitness Fest 2025",
      image: "/images/gpex.jpg",
    },
  ]

  const sidebarEvents = [
    {
      id: 1,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      members: "765 Members",
      image: "/images/gpex.jpg",
    },
    {
      id: 2,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      members: "765 Members",
      image: "/images/gpex.jpg",
    },
    {
      id: 3,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      members: "765 Members",
      image: "/images/gpex.jpg",
    },
  ]



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Education & Training Events</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="w-6 h-6 border-2 border-white">
                    <AvatarFallback className="bg-purple-500 text-white text-xs">U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-gray-600">3032 Followers</span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Follow</Button>
            <Button variant="outline" className="px-4 py-2">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          {/* {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))} */}
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-80 space-y-6">
            {/* Calendar Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div> 
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calendar</label>
                    <div className="relative">
                      <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option>Select Date</option>
                      </select>
                      {/* <ChevronDown className="" /> */}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <div className="relative">
                      <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option>{selectedFormat}</option>
                      </select>
                      {/* <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option>Select Location</option>
                      </select>
                      {/* <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Category</h3>
                  <Input type="text" placeholder="Search for Topics" className="w-full" />
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={category.checked}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className={`text-sm ${category.checked ? "text-red-600" : "text-gray-700"}`}>
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full text-sm">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Topics */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Related Topic</h3>
                  <div className="space-y-3">
                    {relatedTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                          <span className="text-sm text-gray-700">{topic.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{topic.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Designtion</h3>
                  <Input type="text" placeholder="Search for Topics" className="w-full" />
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={category.checked}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className={`text-sm ${category.checked ? "text-red-600" : "text-gray-700"}`}>
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full text-sm">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
           <div className="w-full max-w-xs border rounded-md shadow-sm">
      {/* Dropdown Filters */}
      <div className="border-b px-4 py-3 cursor-pointer flex justify-between items-center">
        <span className="font-medium">Entry Fee</span>
        <span>▼</span>
      </div>
      <div className="border-b px-4 py-3 cursor-pointer flex justify-between items-center">
        <span className="font-medium">Rating</span>
        <span>▼</span>
      </div>
      <div className="border-b px-4 py-3 cursor-pointer flex justify-between items-center">
        <span className="font-medium">Members</span>
        <span>▼</span>
      </div>

      {/* Event Categories */}
      {[
        'Top 100 Events',
        'Social Events',
        'Search by Company',
        'Explore Speaker',
        'Filter',
      ].map((title) => (
        <div
          key={title}
          className="border-b px-4 py-3 cursor-pointer hover:bg-gray-50"
        >
          <p className="text-red-500 font-semibold">{title}</p>
          <p className="text-sm text-gray-500">Discover and track top events</p>
        </div>
      ))}

      {/* All Events */}
      <div className="px-4 py-4">
        <p className="text-blue-800 font-semibold cursor-pointer hover:underline">
          All Events
        </p>
      </div>
    </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* View Toggle and Pagination */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("Trending")}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === "Trending" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Trending 🔥
                  </button>
                  <button
                    onClick={() => setViewMode("Date")}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === "Date" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Date
                  </button>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5, 6].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-sm ${
                      currentPage === page ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Listings */}
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-44 h-28 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              {/* <Heart className="w-4 h-4" /> */}
                            </Button>
                            <Button variant="ghost" size="sm">
                              {/* <Share2 className="w-4 h-4" /> */}
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary">{event.category}</Badge>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              Interested ({event.interested})
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">4.5</span>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Events */}
           <section className="px-4 py-10 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold text-black underline mb-6">
        Featured Events
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event, idx) => (
          <div key={idx} className="relative bg-white rounded-xl shadow-md overflow-hidden">
            {/* Event Image */}
            <div className="relative h-24 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />

              {/* Heart Icon */}
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                <Heart className="w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* Logo Overlap */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-md">
              <Image
                src={event.image || "/images/gpex.jpg"}
                alt="Event Logo"
                width={50}
                height={70}
                className="max-h-20 max-w-10 rounded-full object-cover"
              />
            </div>

            {/* Event Info */}
            <div className="pt-5 pb-4 px-4 text-center">
              <h3 className="font-semibold text-base text-gray-800">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.location}</p>
              <p className="text-sm text-blue-600 font-medium mt-2">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Event Listings */}
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-44 h-28 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              {/* <Heart className="w-4 h-4" /> */}
                            </Button>
                            <Button variant="ghost" size="sm">
                              {/* <Share2 className="w-4 h-4" /> */}
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary">{event.category}</Badge>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              Interested ({event.interested})
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">4.5</span>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
  
          </div>
          {/* Right Sidebar */}
          <div className="w-80 space-y-6">
            {/* Large Featured Event */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src="/images/gpex.jpg"
                  alt="Fitness Fest 2025"
                  className="w-full h-60 object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Fitness Fest 2025</h3>
                  <p className="text-sm">Thu 04 - Sat 06 June 2025</p>
                  <p className="text-sm">Bangalore, India</p>
                </div>
              </div>
            </Card>

            {/* Event List */}
            <div className="space-y-4">
              {sidebarEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 mb-1">{event.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">{event.date}</p>
                        <p className="text-xs text-gray-600 mb-2">{event.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{event.members}</span>
                          <div className="flex space-x-1">
                            <Button size="sm" className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700">
                              Fitness
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                              Health
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
