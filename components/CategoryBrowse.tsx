"use client"

import { GraduationCap, Cross, TrendingUp, DollarSign, MoreHorizontal ,Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

const categories = [
  {
    id: "education",
    title: "Education Training",
    icon: GraduationCap,
    event:"22",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Education", // Maps to actual category in events data
  },
  {
    id: "medical",
    title: "Medical & Pharma",
    icon: Cross,
    event:"22",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Medical", // Maps to actual category in events data
  },
  {
    id: "technology",
    title: "IT & Technology",
    icon: TrendingUp,
    event:"22",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Technology", // Maps to actual category in events data
  },
  {
    id: "finance",
    title: "Banking & Finance",
    icon: DollarSign,
    event:"22",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Finance", // Maps to actual category in events data
  },
   {
    id: "business",
    title: "Business services",
    icon: Briefcase,
    event:"22",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    filterValue: "Finance", // Maps to actual category in events data
  },
  {
    id: "all",
    title: "View All",
    icon: MoreHorizontal,
    color: "bg-gray-50 text-gray-700 border-gray-200",
    filterValue: "", // Empty string means show all events
  },
]

export default function CategoryBrowser() {
  const router = useRouter()

  const handleCategoryClick = (category: (typeof categories)[0]) => {
    if (category.id === "all" || !category.filterValue) {
      // Navigate to all events
      router.push("/event")
    } else {
      // Navigate to events filtered by category
      router.push(`/event?category=${encodeURIComponent(category.filterValue)}`)
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-20 pt-20 pb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-1 text-center">Browse by Category</h2>
          <p className="text-gray-600 text-center mt-2">Find events that match your interests</p>
        </div>

        {/* Categories */}
        <div className="px-6 py-8">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Browse ${category.title} events`}
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
                    <p>{category.id !== "all" && `${category.event} event`}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Optional: Add category stats */}
        {/* <div className="px-6 pb-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                Discover events across multiple categories • Updated daily • Trusted by thousands
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
