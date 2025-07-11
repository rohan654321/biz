"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Megaphone,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  Users,
  MousePointer,
  DollarSign,
  Facebook,
  Instagram,
  Linkedin,
  Plus,
  Share2,
  ImageIcon,
  FileText,
  Palette,
  Mail,
} from "lucide-react"

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

interface EventPromotionProps {
  events: Event[]
}

export default function EventPromotion({ events }: EventPromotionProps) {
  const [selectedTab, setSelectedTab] = useState("campaigns")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: "Global Precision Expo - Early Bird",
      event: "Global Precision Expo 2025",
      type: "Social Media",
      status: "Active",
      budget: 50000,
      spent: 32000,
      impressions: 125000,
      clicks: 2800,
      conversions: 180,
      ctr: 2.24,
      platforms: ["Facebook", "Instagram", "LinkedIn"],
      startDate: "2024-12-01",
      endDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Tech Summit - Speaker Announcement",
      event: "Tech Innovation Summit",
      type: "Email Marketing",
      status: "Active",
      budget: 25000,
      spent: 18000,
      impressions: 45000,
      clicks: 1200,
      conversions: 95,
      ctr: 2.67,
      platforms: ["Email", "LinkedIn"],
      startDate: "2024-12-10",
      endDate: "2024-12-31",
    },
    {
      id: 3,
      name: "Healthcare Expo - Pre-launch",
      event: "Healthcare Expo 2025",
      type: "Display Ads",
      status: "Draft",
      budget: 75000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      platforms: ["Google Ads", "Facebook"],
      startDate: "2025-01-01",
      endDate: "2025-02-28",
    },
  ]

  const promotionTools = [
    {
      name: "Social Media Kit",
      description: "Ready-to-use social media posts and graphics",
      icon: Share2,
      color: "bg-blue-500",
    },
    {
      name: "Email Templates",
      description: "Professional email marketing designs",
      icon: Mail,
      color: "bg-green-500",
    },
    {
      name: "Ad Creator",
      description: "Design display advertisements",
      icon: ImageIcon,
      color: "bg-purple-500",
    },
    {
      name: "Content Generator",
      description: "AI-powered marketing content",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      name: "Brand Kit",
      description: "Logos, colors, and brand assets",
      icon: Palette,
      color: "bg-pink-500",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Paused":
        return "bg-yellow-100 text-yellow-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return <Facebook className="w-4 h-4" />
      case "Instagram":
        return <Instagram className="w-4 h-4" />
      case "Twitter":
        return <div className="w-4 h-4">Twitter</div> // Placeholder for Twitter icon
      case "LinkedIn":
        return <Linkedin className="w-4 h-4" />
      case "Email":
        return <Mail className="w-4 h-4" />
      default:
        return <Megaphone className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Promotion</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Set up a new marketing campaign for your event</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input id="campaign-name" placeholder="Enter campaign name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-select">Select Event</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id.toString()}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-type">Campaign Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="display">Display Ads</SelectItem>
                    <SelectItem value="search">Search Ads</SelectItem>
                    <SelectItem value="influencer">Influencer Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea id="description" placeholder="Describe your campaign goals and strategy" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input id="budget" type="number" placeholder="50000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input id="duration" type="number" placeholder="30" />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Platforms</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["Facebook", "Instagram", "Twitter", "LinkedIn", "Email", "Google Ads"].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Switch id={platform.toLowerCase()} />
                      <Label htmlFor={platform.toLowerCase()} className="flex items-center gap-2">
                        {getPlatformIcon(platform)}
                        {platform}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Target Audience</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age-range">Age Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="26-35">26-35</SelectItem>
                        <SelectItem value="36-45">36-45</SelectItem>
                        <SelectItem value="46-55">46-55</SelectItem>
                        <SelectItem value="55+">55+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Target cities/regions" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Campaign</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="create">Quick Promote</TabsTrigger>
          <TabsTrigger value="tools">Promotion Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaign Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                    <p className="text-2xl font-bold">170K</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                    <p className="text-2xl font-bold">4.0K</p>
                  </div>
                  <MousePointer className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+22% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold">275</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-xs text-green-600 mt-2">+18% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold">₹50K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-red-600 mt-2">67% of budget used</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Campaigns</h2>
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.event}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          {campaign.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-semibold">₹{(campaign.budget / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="font-semibold">₹{(campaign.spent / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Impressions</p>
                      <p className="font-semibold">{(campaign.impressions / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clicks</p>
                      <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversions</p>
                      <p className="font-semibold">{campaign.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CTR</p>
                      <p className="font-semibold">{campaign.ctr}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Platforms:</span>
                      <div className="flex gap-1">
                        {campaign.platforms.map((platform) => (
                          <div key={platform} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                            {getPlatformIcon(platform)}
                            {platform}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {campaign.startDate} - {campaign.endDate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Promote Event</CardTitle>
              <p className="text-sm text-gray-600">Instantly share your event across multiple platforms</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quick-event">Select Event to Promote</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title} - {event.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Share on Platforms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <Facebook className="w-6 h-6 text-blue-600" />
                    <span>Facebook</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <Instagram className="w-6 h-6 text-pink-600" />
                    <span>Instagram</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <div className="w-6 h-6 text-blue-400">Twitter</div> {/* Placeholder for Twitter icon */}
                    <span>Twitter</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <Linkedin className="w-6 h-6 text-blue-700" />
                    <span>LinkedIn</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <Mail className="w-6 h-6 text-green-600" />
                    <span>Email</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <Share2 className="w-6 h-6 text-gray-600" />
                    <span>All Platforms</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promotion-message">Custom Message (Optional)</Label>
                <Textarea id="promotion-message" placeholder="Add a custom message to your promotion..." rows={3} />
              </div>

              <Button className="w-full">
                <Megaphone className="w-4 h-4 mr-2" />
                Start Promotion
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${tool.color}`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Promotion Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2.4M</div>
                  <div className="text-sm text-gray-600">Total Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">12.5K</div>
                  <div className="text-sm text-gray-600">Engagements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">3.2%</div>
                  <div className="text-sm text-gray-600">Avg. CTR</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
