import { GraduationCap, Cross, TrendingUp, DollarSign, MoreHorizontal } from "lucide-react"

const categories = [
  {
    id: "education",
    title: "Education Training",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "medical",
    title: "Medical & Pharma",
    icon: Cross,
    color: "bg-red-50 text-red-700 border-red-200",
  },
  {
    id: "technology",
    title: "IT & Technology",
    icon: TrendingUp,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    id: "finance",
    title: "Banking & Finance",
    icon: DollarSign,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    id: "all",
    title: "View All",
    icon: MoreHorizontal,
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
]

export default function CategoryBrowser() {
  return (
    <div className="w-full">
      <div className=" rounded-lg overflow-hidden">
        {/* Header */}
        <div className=" px-20 pt-20 pb-10 ">
          <h2 className="text-4xl font-bold text-gray-900 mb-1 text-center">Browse by Category</h2>
        </div>

        {/* Categories */}
        <div className=" px-6 py-8">
          <div className="w-full max-w-6xl mx-auto  grid grid-cols-2 md:grid-cols-5 gap-4 ">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105 group"
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
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
