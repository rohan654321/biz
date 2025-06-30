"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, ChevronDown, Heart, User } from "lucide-react"

export default function SpeakersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Select Category")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const toggleFavorite = (speakerId: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(speakerId)) {
      newFavorites.delete(speakerId)
    } else {
      newFavorites.add(speakerId)
    }
    setFavorites(newFavorites)
  }

  // Mock speaker data
  const speakers = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    name: "Ramesh S",
    title: "CEO & Co-Founder",
    events: 49,
    image: "/images/gpex.jpg", // Replace with actual image paths
    followers: 1200 + index * 10,
    popularity: Math.floor(Math.random() * 100) + 1, // Random popularity for demo
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-500 pb-4">
          <h1 className="text-3xl font-bold text-blue-900">Top Speakers</h1>

          {/* Category Selector */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Select Category</option>
              <option>Technology</option>
              <option>Business</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Finance</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="bg-white rounded-lg border border-gray-200 p-2 hover:shadow-md transition-shadow duration-200 relative"
            >
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(speaker.id)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.has(speaker.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>

              {/* Speaker Content */}
              <div className="flex items-start space-x-4">
                {/* Speaker Image */}
                <div className="flex-shrink-0">
                  <img
                    src={speaker.image || "/placeholder.svg"}
                    alt={speaker.name}
                    className="w-30 h-30 rounded-lg object-cover"
                  />
                  <div className="absolute top-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                    {speaker.popularity}%   
                    </div>
                </div>

                {/* Speaker Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-blue-600 mb-1">{speaker.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{speaker.title}</p>
                    <div className="flex gap-4 items-center  mt-10">
                  <p className="text-sm text-gray-500">{speaker.events} Events</p>
                  <p className="text-sm text-gray-500 ">Followers: {speaker.followers}</p>
                 </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {/* <div className="flex justify-center mt-12">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">Load More Speakers</Button>
        </div> */}
      </div>
    </div>
  )
}
