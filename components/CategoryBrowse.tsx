"use client"

import {
  GraduationCap,
  Cross,
  TrendingUp,
  DollarSign,
  MoreHorizontal,
  Briefcase,
  ChevronUp,
  Factory,
  Building2,
  Zap,
  Clapperboard,
  HeartPulse,
  FlaskConical,
  Leaf,
  Trees,
  Utensils,
  Truck,
  Cpu,
  Palette,
  Car,
  Home,
  Shield,
  Sparkles,
  Plane,
  Phone,
  Shirt,
  Dog,
  Baby,
  Hotel,
  Package,
  Puzzle,
} from "lucide-react"

import { useRouter } from "next/navigation"
import { useState } from "react"

const primaryCategories = [
  {
    id: "education",
    title: "Education Training",
    icon: GraduationCap,
    event: "247.2k Events",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Education",
  },
  {
    id: "medical",
    title: "Medical & Pharma",
    icon: Cross,
    event: "113.0k Events",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Medical",
  },
  {
    id: "technology",
    title: "IT & Technology",
    icon: TrendingUp,
    event: "114.2k Events",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Technology",
  },
  {
    id: "finance",
    title: "Banking & Finance",
    icon: DollarSign,
    event: "66.0k Events",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Finance",
  },
  {
    id: "business",
    title: "Business Services",
    icon: Briefcase,
    event: "105.4k Events",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Business",
  },

  
]

const extraCategories = [
  { title: "Industrial Engineering", event: "35.5k Events", icon: Factory },
  { title: "Building & Construction", event: "30.3k Events", icon: Building2 },
  { title: "Power & Energy", event: "25.8k Events", icon: Zap },
  { title: "Entertainment & Media", event: "26.7k Events", icon: Clapperboard },
  { title: "Wellness, Health & Fitness", event: "36.5k Events", icon: HeartPulse },
  { title: "Science & Research", event: "51.9k Events", icon: FlaskConical },
  { title: "Environment & Waste", event: "25.4k Events", icon: Leaf },
  { title: "Agriculture & Forestry", event: "18.2k Events", icon: Trees },
  { title: "Food & Beverages", event: "17.3k Events", icon: Utensils },
  { title: "Logistics & Transportation", event: "16.5k Events", icon: Truck },
  { title: "Electric & Electronics", event: "15.0k Events", icon: Cpu },
  { title: "Arts & Crafts", event: "12.6k Events", icon: Palette },
  { title: "Auto & Automotive", event: "10.7k Events", icon: Car },
  { title: "Home & Office", event: "7603 Events", icon: Home },
  { title: "Security & Defense", event: "12.4k Events", icon: Shield },
  { title: "Fashion & Beauty", event: "7568 Events", icon: Sparkles },
  { title: "Travel & Tourism", event: "9405 Events", icon: Plane },
  { title: "Telecommunication", event: "9535 Events", icon: Phone },
  { title: "Apparel & Clothing", event: "6415 Events", icon: Shirt },
  { title: "Animals & Pets", event: "6400 Events", icon: Dog },
  { title: "Baby, Kids & Maternity", event: "8670 Events", icon: Baby },
  { title: "Hospitality", event: "4249 Events", icon: Hotel },
  { title: "Packing & Packaging", event: "3790 Events", icon: Package },
  { title: "Miscellaneous", event: "23.4k Events", icon: Puzzle },
]

export default function CategoryBrowser() {
  const router = useRouter()
  const [showAll, setShowAll] = useState(false)

  const handleCategoryClick = (filterValue: string) => {
    if (filterValue) {
      router.push(`/event?category=${encodeURIComponent(filterValue)}`)
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden">
       
{/* Header */}
<div className="px-6 py-6 border-b border-gray-200 max-w-6xl mx-auto">
  <h2 className="text-2xl font-semibold text-gray-900 mb-1">
    Browse by Category
  </h2>
  <p className="text-gray-600">Find events that match your interests</p>
</div>





        {/* Categories */}
        <div className="px-6 py-8">
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {primaryCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.filterValue)}
                  className="bg-white rounded-sm p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`p-3 rounded-full ${category.color} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center leading-tight">
                      {category.title}
                    </span>
                    <p className="text-xs text-gray-600">{category.event}</p>
                  </div>
                </button>
              )
            })}

            {/* Toggle button */}
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="cursor-pointer bg-gray-50 rounded-sm p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 rounded-full bg-gray-100 group-hover:scale-110 transition-transform duration-200">
                  {showAll ? <ChevronUp className="w-6 h-6" /> : <MoreHorizontal className="w-6 h-6" />}
                </div>
                <span className="text-sm font-medium text-gray-900 text-center leading-tight">
                  {showAll ? "View Less" : "View All"}
                </span>
              </div>
            </button>
          </div>

          {/* Extra categories (expand on View All) */}
          {showAll && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {extraCategories.map((cat, idx) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={idx}
                    onClick={() => handleCategoryClick(cat.title)}
                    className="cursor-pointer bg-white rounded-sm p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-blue-50 text-blue-700 border border-blue-200 group-hover:scale-110 transition-transform duration-200">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center">{cat.title}</span>
                      <p className="text-xs text-gray-600">{cat.event}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
