"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap, Cross, TrendingUp, DollarSign, Briefcase,
  MoreHorizontal, ChevronUp, Factory, Building2, Zap,
  Clapperboard, HeartPulse, FlaskConical, Leaf, Trees,
  Utensils, Truck, Cpu, Palette, Car, Home, Shield,
  Sparkles, Plane, Phone, Shirt, Dog, Baby, Hotel,
  Package, Puzzle,
} from "lucide-react"

// Updated categories to match actual category names in database
const primaryCategories = [
  { id: "education", title: "Education & Training", icon: GraduationCap, filterValue: "Education & Training" },
  { id: "medical", title: "Medical & Pharma", icon: Cross, filterValue: "Medical & Pharma" },
  { id: "technology", title: "IT & Technology", icon: TrendingUp, filterValue: "IT & Technology" },
  { id: "finance", title: "Banking & Finance", icon: DollarSign, filterValue: "Banking & Finance" },
  { id: "business", title: "Business Services", icon: Briefcase, filterValue: "Business Services" },
]

const extraCategories = [
  { title: "Industrial Engineering", icon: Factory, filterValue: "Industrial Engineering" },
  { title: "Building & Construction", icon: Building2, filterValue: "Building & Construction" },
  { title: "Power & Energy", icon: Zap, filterValue: "Power & Energy" },
  { title: "Entertainment & Media", icon: Clapperboard, filterValue: "Entertainment & Media" },
  { title: "Wellness, Health & Fitness", icon: HeartPulse, filterValue: "Wellness, Health & Fitness" },
  { title: "Science & Research", icon: FlaskConical, filterValue: "Science & Research" },
  { title: "Environment & Waste", icon: Leaf, filterValue: "Environment & Waste" },
  { title: "Agriculture & Forestry", icon: Trees, filterValue: "Agriculture & Forestry" },
  { title: "Food & Beverages", icon: Utensils, filterValue: "Food & Beverages" },
  { title: "Logistics & Transportation", icon: Truck, filterValue: "Logistics & Transportation" },
  { title: "Electric & Electronics", icon: Cpu, filterValue: "Electric & Electronics" },
  { title: "Arts & Crafts", icon: Palette, filterValue: "Arts & Crafts" },
  { title: "Auto & Automotive", icon: Car, filterValue: "Auto & Automotive" },
  { title: "Home & Office", icon: Home, filterValue: "Home & Office" },
  { title: "Security & Defense", icon: Shield, filterValue: "Security & Defense" },
  { title: "Fashion & Beauty", icon: Sparkles, filterValue: "Fashion & Beauty" },
  { title: "Travel & Tourism", icon: Plane, filterValue: "Travel & Tourism" },
  { title: "Telecommunication", icon: Phone, filterValue: "Telecommunication" },
  { title: "Apparel & Clothing", icon: Shirt, filterValue: "Apparel & Clothing" },
  { title: "Animals & Pets", icon: Dog, filterValue: "Animals & Pets" },
  { title: "Baby, Kids & Maternity", icon: Baby, filterValue: "Baby, Kids & Maternity" },
  { title: "Hospitality", icon: Hotel, filterValue: "Hospitality" },
  { title: "Packing & Packaging", icon: Package, filterValue: "Packing & Packaging" },
  { title: "Miscellaneous", icon: Puzzle, filterValue: "Miscellaneous" },
]

interface CategoryCount {
  category: string
  count: number
}

export default function CategoryBrowser() {
  const router = useRouter()
  const [showAll, setShowAll] = useState(false)
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const res = await fetch("/api/events?stats=true")
        const data = await res.json()
        
        if (data.categories && Array.isArray(data.categories)) {
          const map: Record<string, number> = {}
          data.categories.forEach((cat: CategoryCount) => {
            map[cat.category] = cat.count
          })
          setCounts(map)
        }
      } catch (error) {
        console.error("Failed to fetch category stats:", error)
      }
    }

    fetchCategoryCounts()
  }, [])

  const handleCategoryClick = (filterValue: string) => {
    if (filterValue) {
      router.push(`/event?category=${encodeURIComponent(filterValue)}`)
    }
  }

  // Helper function to get count for a category
  const getCategoryCount = (categoryName: string): number => {
    return counts[categoryName] || 0
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
        <div className="px-6 py-8 max-w-6xl mx-auto">
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {primaryCategories.map((category) => {
              const IconComponent = category.icon
              const eventCount = getCategoryCount(category.filterValue)
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.filterValue)}
                  className="bg-white rounded-sm p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-700 border border-blue-200 group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center leading-tight">
                      {category.title}
                    </span>
                    <p className="text-xs text-gray-600">{eventCount} Events</p>
                  </div>
                </button>
              )
            })}

            {/* Toggle */}
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="cursor-pointer bg-gray-50 rounded-sm p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
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

          {/* Extra categories */}
          {showAll && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {extraCategories.map((cat, idx) => {
                const IconComponent = cat.icon
                const eventCount = getCategoryCount(cat.filterValue)
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleCategoryClick(cat.filterValue)}
                    className="cursor-pointer bg-white rounded-sm p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-blue-50 text-blue-700 border border-blue-200 group-hover:scale-110 transition-transform duration-200">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center">{cat.title}</span>
                      <p className="text-xs text-gray-600">{eventCount} Events</p>
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