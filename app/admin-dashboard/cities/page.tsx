"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical,
  MapPin
} from "lucide-react"
import CloudinaryUpload from "@/components/cloudinary-upload"

interface City {
  id: string
  name: string
  countryId: string
  latitude?: number
  longitude?: number
  timezone?: string
  image?: string
  imagePublicId?: string
  isActive: boolean
  eventCount: number
  createdAt: string
  updatedAt: string
  country?: {
    id: string
    name: string
    code: string
  }
}

export default function CitiesManagement() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    timezone: "UTC",
    image: "",
    isActive: true
  })

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/cities?includeCounts=true")
      if (response.ok) {
        const data = await response.json()
        setCities(data)
      } else {
        console.error("Failed to fetch cities")
      }
    } catch (error) {
      console.error("Error fetching cities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCity 
        ? `/api/admin/cities/${editingCity.id}`
        : "/api/admin/cities"
      
      const method = editingCity ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
        }),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingCity(null)
        setFormData({
          name: "",
          latitude: "",
          longitude: "",
          timezone: "UTC",
          image: "",
          isActive: true
        })
        fetchCities()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save city")
      }
    } catch (error) {
      console.error("Error saving city:", error)
      alert("Failed to save city")
    }
  }

  const handleDelete = async (cityId: string) => {
    if (!confirm("Are you sure you want to delete this city?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/cities/${cityId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCities()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete city")
      }
    } catch (error) {
      console.error("Error deleting city:", error)
      alert("Failed to delete city")
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }))
  }

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cities Management</h1>
          <p className="text-gray-600">Manage cities for events</p>
        </div>
        <button
          onClick={() => {
            setEditingCity(null)
            setFormData({
              name: "",
              latitude: "",
              longitude: "",
              timezone: "UTC",
              image: "",
              isActive: true
            })
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add City
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <div
            key={city.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {city.image ? (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden">
                    <img 
                      src={city.image} 
                      alt={`${city.name} image`}
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100 text-green-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{city.name}</h3>
                  <p className="text-sm text-gray-600">{city.country?.name}</p>
                </div>
              </div>
              <div className="relative">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-gray-900">{city.eventCount}</p>
              <p className="text-xs text-gray-600">Events</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {city.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${city.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {city.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCity(city)
                    setFormData({
                      name: city.name,
                      latitude: city.latitude?.toString() || "",
                      longitude: city.longitude?.toString() || "",
                      timezone: city.timezone || "UTC",
                      image: city.image || "",
                      isActive: city.isActive
                    })
                    setShowForm(true)
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(city.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏙️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cities found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first city"}
          </p>
        </div>
      )}

      {/* City Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingCity ? 'Edit City' : 'Add New City'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City Image
                  </label>
                  <CloudinaryUpload
                    onUploadComplete={handleImageUpload}
                    currentImage={formData.image}
                    folder="cities"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image for this city
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 40.7128"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., -74.0060"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., America/New_York"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active City
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingCity ? 'Update City' : 'Create City'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCity(null)
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}