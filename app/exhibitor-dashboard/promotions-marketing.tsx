"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Megaphone,
  Users,
  Target,
  CreditCard,
  CheckCircle,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Music,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Plane,
  Dumbbell,
  Palette,
  Code,
  Stethoscope,
  Star,
} from "lucide-react"

interface PromotionsMarketingProps {
  exhibitorId: string
}

interface Event {
  id: number
  title: string
  date: string
  location: string
  status: string
  attendees: number
  revenue: number
  registrations: number
  type: string
}

interface PromotionPackage {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  userCount: number
  categories: string[]
  duration: string
  recommended?: boolean
}

interface CategoryFilter {
  id: string
  name: string
  icon: any
  userCount: number
  avgEngagement: number
  color: string
}

export default function PromotionsMarketing({ exhibitorId }: PromotionsMarketingProps) {
  const [selectedTab, setSelectedTab] = useState("platform-promotion")
  const [selectedEvent, setSelectedEvent] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPackage, setSelectedPackage] = useState("")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  // Mock events data for exhibitors
  const exhibitorEvents: Event[] = [
    {
      id: 1,
      title: "Global Tech Expo 2025",
      date: "2025-03-15",
      location: "Mumbai, India",
      status: "Confirmed",
      attendees: 5000,
      revenue: 150000,
      registrations: 4500,
      type: "Technology",
    },
    {
      id: 2,
      title: "Healthcare Innovation Summit",
      date: "2025-04-20",
      location: "Delhi, India",
      status: "Pending",
      attendees: 3000,
      revenue: 90000,
      registrations: 2800,
      type: "Healthcare",
    },
    {
      id: 3,
      title: "Manufacturing Excellence Fair",
      date: "2025-05-10",
      location: "Bangalore, India",
      status: "Confirmed",
      attendees: 4200,
      revenue: 120000,
      registrations: 3900,
      type: "Manufacturing",
    },
  ]

  // Platform promotion packages
  const promotionPackages: PromotionPackage[] = [
    {
      id: "basic",
      name: "Basic Promotion",
      description: "Reach targeted users in your event category",
      price: 2999,
      features: [
        "Email notification to 5,000+ users",
        "In-app notification banner",
        "Category-based targeting",
        "Basic analytics report",
        "7-day promotion duration",
      ],
      userCount: 5000,
      categories: ["selected"],
      duration: "7 days",
    },
    {
      id: "premium",
      name: "Premium Promotion",
      description: "Enhanced visibility with multi-category reach",
      price: 7999,
      features: [
        "Email notification to 15,000+ users",
        "Featured exhibitor placement",
        "Multi-category targeting",
        "Push notifications",
        "Detailed analytics dashboard",
        "14-day promotion duration",
        "Social media cross-promotion",
      ],
      userCount: 15000,
      categories: ["multiple"],
      duration: "14 days",
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Promotion",
      description: "Maximum reach across all relevant categories",
      price: 15999,
      features: [
        "Email notification to 50,000+ users",
        "Homepage banner placement",
        "All relevant category targeting",
        "SMS notifications (premium users)",
        "Advanced analytics & insights",
        "30-day promotion duration",
        "Dedicated account manager",
        "Custom promotional content",
      ],
      userCount: 50000,
      categories: ["all"],
      duration: "30 days",
    },
  ]

  // User categories with engagement data
  const userCategories: CategoryFilter[] = [
    {
      id: "technology",
      name: "Technology & IT",
      icon: Code,
      userCount: 12500,
      avgEngagement: 78,
      color: "bg-blue-500",
    },
    {
      id: "business",
      name: "Business & Finance",
      icon: Briefcase,
      userCount: 8900,
      avgEngagement: 82,
      color: "bg-green-500",
    },
    {
      id: "healthcare",
      name: "Healthcare & Medical",
      icon: Stethoscope,
      userCount: 6700,
      avgEngagement: 85,
      color: "bg-red-500",
    },
    {
      id: "education",
      name: "Education & Training",
      icon: GraduationCap,
      userCount: 9200,
      avgEngagement: 76,
      color: "bg-purple-500",
    },
    {
      id: "arts",
      name: "Arts & Culture",
      icon: Palette,
      userCount: 4300,
      avgEngagement: 88,
      color: "bg-pink-500",
    },
    {
      id: "sports",
      name: "Sports & Fitness",
      icon: Dumbbell,
      userCount: 7800,
      avgEngagement: 79,
      color: "bg-orange-500",
    },
    {
      id: "food",
      name: "Food & Beverage",
      icon: Utensils,
      userCount: 5600,
      avgEngagement: 83,
      color: "bg-yellow-500",
    },
    {
      id: "travel",
      name: "Travel & Tourism",
      icon: Plane,
      userCount: 6100,
      avgEngagement: 81,
      color: "bg-indigo-500",
    },
    {
      id: "automotive",
      name: "Automotive",
      icon: Car,
      userCount: 3900,
      avgEngagement: 74,
      color: "bg-gray-500",
    },
    {
      id: "real-estate",
      name: "Real Estate",
      icon: Home,
      userCount: 4700,
      avgEngagement: 77,
      color: "bg-teal-500",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: Music,
      userCount: 8200,
      avgEngagement: 86,
      color: "bg-violet-500",
    },
    {
      id: "retail",
      name: "Retail & Shopping",
      icon: ShoppingBag,
      userCount: 7300,
      avgEngagement: 80,
      color: "bg-emerald-500",
    },
  ]

  const calculateEstimatedReach = () => {
    if (selectedCategories.length === 0) return 0
    return selectedCategories.reduce((total, categoryId) => {
      const category = userCategories.find((c) => c.id === categoryId)
      return total + (category?.userCount || 0)
    }, 0)
  }

  const calculateEstimatedEngagement = () => {
    if (selectedCategories.length === 0) return 0
    const totalEngagement = selectedCategories.reduce((total, categoryId) => {
      const category = userCategories.find((c) => c.id === categoryId)
      return total + (category?.avgEngagement || 0)
    }, 0)
    return Math.round(totalEngagement / selectedCategories.length)
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
    setIsPaymentDialogOpen(true)
  }

  const selectedPackageData = promotionPackages.find((p) => p.id === selectedPackage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Exhibitor Promotion</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Users className="w-4 h-4 mr-1" />
            {userCategories.reduce((total, cat) => total + cat.userCount, 0).toLocaleString()} Platform Users
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="platform-promotion">Platform Promotion</TabsTrigger>
          <TabsTrigger value="external-campaigns">External Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="platform-promotion" className="space-y-6">
          {/* Event Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Select Event to Promote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an event to promote" />
                </SelectTrigger>
                <SelectContent>
                  {exhibitorEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{event.title}</span>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedEvent && (
            <>
              {/* Category Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Target User Categories
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Select categories that match your target audience. Each category shows user count and engagement
                    rate.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userCategories.map((category) => (
                      <div
                        key={category.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedCategories.includes(category.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <category.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{category.name}</h3>
                          </div>
                          <Checkbox
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryToggle(category.id)}
                          />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Users:</span>
                            <span className="font-medium">{category.userCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Engagement:</span>
                            <span className="font-medium">{category.avgEngagement}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedCategories.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Estimated Reach</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Users:</span>
                          <div className="text-2xl font-bold text-blue-600">
                            {calculateEstimatedReach().toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg. Engagement:</span>
                          <div className="text-2xl font-bold text-green-600">{calculateEstimatedEngagement()}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Expected Leads:</span>
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(calculateEstimatedReach() * (calculateEstimatedEngagement() / 100) * 0.12)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Promotion Packages */}
              {selectedCategories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5" />
                      Choose Promotion Package
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Select a package that fits your budget and reach requirements
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {promotionPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`relative p-6 border-2 rounded-lg ${
                            pkg.recommended ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          }`}
                        >
                          {pkg.recommended && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-blue-500 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Recommended
                              </Badge>
                            </div>
                          )}

                          <div className="text-center mb-4">
                            <h3 className="text-xl font-bold">{pkg.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                            <div className="mt-3">
                              <span className="text-3xl font-bold text-blue-600">₹{pkg.price.toLocaleString()}</span>
                              <span className="text-sm text-gray-500">/{pkg.duration}</span>
                            </div>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Reach:</span>
                              <span className="font-medium">{pkg.userCount.toLocaleString()}+ users</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">{pkg.duration}</span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-6">
                            {pkg.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Button
                            className="w-full"
                            variant={pkg.recommended ? "default" : "outline"}
                            onClick={() => handlePackageSelect(pkg.id)}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Select Package
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="external-campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>External Marketing Campaigns</CardTitle>
              <p className="text-sm text-gray-600">
                Create campaigns for social media, email marketing, and other external platforms
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">External Campaigns</h3>
                <p className="text-gray-500 mb-4">
                  This feature allows you to create and manage campaigns for external platforms
                </p>
                <Button variant="outline">Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Your Promotion Purchase</DialogTitle>
            <DialogDescription>
              Review your selection and complete the payment to start promoting your exhibition
            </DialogDescription>
          </DialogHeader>

          {selectedPackageData && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span className="font-medium">{selectedPackageData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Event:</span>
                    <span className="font-medium">
                      {exhibitorEvents.find((e) => e.id.toString() === selectedEvent)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Categories:</span>
                    <span className="font-medium">{selectedCategories.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Reach:</span>
                    <span className="font-medium">{calculateEstimatedReach().toLocaleString()} users</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedPackageData.duration}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">₹{selectedPackageData.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <h3 className="font-semibold">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input id="card-name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Promotion Policy
                  </a>
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{selectedPackageData.price.toLocaleString()}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
