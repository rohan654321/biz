"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  Mail,
  Send,
  Users,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Target,
  Clock,
  TrendingUp,
  MessageSquare,
  Calendar,
  Filter,
  Download,
  LayoutTemplateIcon as Template,
  Sparkles,
  Copy,
} from "lucide-react"

interface Promotion {
  id: string
  type: "push" | "email"
  title: string
  content: string
  targetCategories: string[]
  status: "draft" | "scheduled" | "sent" | "sending"
  priority: "low" | "medium" | "high"
  createdAt: string
  scheduledAt?: string
  sentAt?: string
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced?: number
    unsubscribed?: number
  }
  engagement: {
    openRate: number
    clickRate: number
    deliveryRate: number
  }
}

interface CampaignTemplate {
  id: string
  name: string
  type: "push" | "email"
  category: string
  title: string
  content: string
  suggestedCategories: string[]
  priority: "low" | "medium" | "high"
  description: string
  icon: string
}

const campaignTemplates: CampaignTemplate[] = [
  // Push Notification Templates
  {
    id: "push-event-reminder",
    name: "Event Reminder",
    type: "push",
    category: "Event Management",
    title: "🎯 Don't Miss Out - Event Starting Soon!",
    content: "Your registered event starts in 2 hours. Get ready for an amazing experience! Tap to view details.",
    suggestedCategories: ["attendees"],
    priority: "high",
    description: "Remind users about upcoming events they've registered for",
    icon: "⏰",
  },
  {
    id: "push-new-event",
    name: "New Event Alert",
    type: "push",
    category: "Event Promotion",
    title: "🚀 Exciting New Event Just Added!",
    content: "A new event in your favorite category is now available. Early bird tickets are 30% off!",
    suggestedCategories: ["technology", "business"],
    priority: "medium",
    description: "Notify users about new events in their preferred categories",
    icon: "🎉",
  },
  {
    id: "push-last-chance",
    name: "Last Chance Tickets",
    type: "push",
    category: "Urgency",
    title: "⚡ Last Few Tickets Available!",
    content: "Only 10 tickets left for this popular event. Secure your spot before it's too late!",
    suggestedCategories: ["all"],
    priority: "high",
    description: "Create urgency for events with limited availability",
    icon: "🔥",
  },
  {
    id: "push-early-bird",
    name: "Early Bird Discount",
    type: "push",
    category: "Promotions",
    title: "🐦 Early Bird Special - 40% Off!",
    content: "Limited time offer! Get 40% off early bird tickets. Offer expires in 24 hours.",
    suggestedCategories: ["attendees", "technology", "business"],
    priority: "high",
    description: "Promote early bird discounts and special offers",
    icon: "💰",
  },
  {
    id: "push-weekend-events",
    name: "Weekend Events",
    type: "push",
    category: "Weekly Promotion",
    title: "🌟 Amazing Weekend Events Await!",
    content: "Discover exciting events happening this weekend in your city. Something for everyone!",
    suggestedCategories: ["all"],
    priority: "medium",
    description: "Weekly promotion of weekend events",
    icon: "🎪",
  },
  {
    id: "push-category-spotlight",
    name: "Category Spotlight",
    type: "push",
    category: "Category Focus",
    title: "🎨 Arts & Culture Events This Month",
    content: "Explore amazing arts and culture events happening this month. From galleries to concerts!",
    suggestedCategories: ["arts"],
    priority: "medium",
    description: "Highlight events from specific categories",
    icon: "🎭",
  },

  // Email Campaign Templates
  {
    id: "email-weekly-digest",
    name: "Weekly Event Digest",
    type: "email",
    category: "Newsletter",
    title: "📅 Your Weekly Event Digest - Don't Miss These!",
    content: `Hi there!

Here are the most exciting events happening this week that we think you'll love:

🚀 FEATURED EVENTS:
• Tech Innovation Summit - January 25th
• Business Networking Mixer - January 27th  
• Healthcare Conference 2024 - January 28th

🎯 PERSONALIZED FOR YOU:
Based on your interests, we've found 5 more events you might enjoy.

💰 SPECIAL OFFERS:
Get 25% off any event ticket this week with code WEEKLY25

Ready to discover something amazing?

Best regards,
The Events Team`,
    suggestedCategories: ["all"],
    priority: "medium",
    description: "Weekly newsletter with curated events and offers",
    icon: "📰",
  },
  {
    id: "email-event-announcement",
    name: "New Event Announcement",
    type: "email",
    category: "Event Launch",
    title: "🎉 Exciting New Event: Technology Innovation Summit 2024",
    content: `We're thrilled to announce our biggest event of the year!

🚀 TECHNOLOGY INNOVATION SUMMIT 2024
📅 Date: March 15-16, 2024
📍 Location: Convention Center, Downtown
👥 Expected Attendees: 2,000+ professionals

WHAT TO EXPECT:
✨ 50+ industry speakers
✨ Hands-on workshops
✨ Networking opportunities
✨ Latest tech innovations
✨ Startup showcase

EARLY BIRD SPECIAL:
Register before February 1st and save 40%!
Regular Price: $299 → Early Bird: $179

This event sells out every year, so secure your spot today.

[REGISTER NOW - 40% OFF]

Questions? Reply to this email or call us at (555) 123-4567.

See you there!
The Events Team`,
    suggestedCategories: ["technology", "business"],
    priority: "high",
    description: "Comprehensive announcement for major new events",
    icon: "📢",
  },
  {
    id: "email-abandoned-cart",
    name: "Abandoned Registration",
    type: "email",
    category: "Recovery",
    title: "🎫 Complete Your Event Registration - 15% Off Inside!",
    content: `Hi there!

We noticed you started registering for an amazing event but didn't complete your booking. 

THE EVENT YOU WERE INTERESTED IN:
🎯 Business Leadership Conference
📅 February 10, 2024
📍 Grand Hotel, City Center
💰 Original Price: $199

SPECIAL OFFER JUST FOR YOU:
Complete your registration in the next 24 hours and get 15% off!
Your Price: $169 (Save $30)

WHY ATTEND:
• Learn from industry leaders
• Network with 500+ professionals  
• Get actionable business strategies
• Includes lunch and materials

This offer expires in 24 hours, and seats are filling up fast.

[COMPLETE REGISTRATION - 15% OFF]

Need help? Just reply to this email.

Best regards,
The Events Team`,
    suggestedCategories: ["attendees"],
    priority: "high",
    description: "Re-engage users who abandoned event registration",
    icon: "🛒",
  },
  {
    id: "email-post-event",
    name: "Post-Event Follow-up",
    type: "email",
    category: "Follow-up",
    title: "🙏 Thank You for Attending - Resources & Next Steps",
    content: `Thank you for making our event amazing!

We hope you had a fantastic experience at the Technology Innovation Summit. Your participation made it truly special.

📊 EVENT HIGHLIGHTS:
• 1,200+ attendees
• 25 inspiring speakers
• 15 hands-on workshops
• 500+ new connections made

🎁 YOUR EVENT RESOURCES:
• Presentation slides from all speakers
• Workshop materials and templates
• Attendee contact directory
• Event photos and videos

[DOWNLOAD ALL RESOURCES]

🔮 WHAT'S NEXT:
• Join our LinkedIn community for ongoing discussions
• Mark your calendar: Next summit is June 15, 2024
• Early bird tickets available at 50% off for returning attendees

📝 HELP US IMPROVE:
Your feedback matters! Please take 2 minutes to share your experience:
[QUICK FEEDBACK SURVEY]

Thank you again for being part of our community!

The Events Team`,
    suggestedCategories: ["attendees"],
    priority: "medium",
    description: "Thank attendees and provide post-event resources",
    icon: "🎊",
  },
  {
    id: "email-organizer-welcome",
    name: "Organizer Welcome",
    type: "email",
    category: "Onboarding",
    title: "🎉 Welcome to Our Platform - Let's Create Amazing Events!",
    content: `Welcome to the Events Platform family!

We're excited to help you create and manage successful events. You're now part of a community of 8,900+ event organizers worldwide.

🚀 GET STARTED:
1. Complete your organizer profile
2. Create your first event listing
3. Set up payment processing
4. Launch your event to our 95,000+ users

💡 SUCCESS TIPS:
• Use high-quality event images
• Write compelling event descriptions
• Set competitive pricing
• Engage with attendees regularly

🎯 PLATFORM BENEFITS:
• Reach 95,000+ potential attendees
• Advanced analytics and insights
• Secure payment processing
• 24/7 customer support
• Marketing tools and promotion options

📚 HELPFUL RESOURCES:
• Organizer handbook and best practices
• Video tutorials and webinars
• Success stories from top organizers
• Community forum and support

[ACCESS ORGANIZER DASHBOARD]

Need help getting started? Our team is here to support you every step of the way.

Welcome aboard!
The Events Team`,
    suggestedCategories: ["organizers"],
    priority: "high",
    description: "Welcome new organizers and guide them through setup",
    icon: "👋",
  },
  {
    id: "email-seasonal-promotion",
    name: "Seasonal Event Promotion",
    type: "email",
    category: "Seasonal",
    title: "🌸 Spring Into Action - Amazing Events This Season!",
    content: `Spring is here, and so are incredible events!

🌸 SPRING EVENT HIGHLIGHTS:
• Outdoor festivals and concerts
• Business conferences and seminars  
• Health and wellness workshops
• Art exhibitions and cultural events
• Food and wine tastings

🎯 EVENTS NEAR YOU:
We've curated the best spring events in your area:

📅 THIS WEEKEND:
• Spring Food Festival - Saturday
• Outdoor Yoga Workshop - Sunday
• Art Gallery Opening - Sunday

📅 COMING UP:
• Business Innovation Summit - March 20
• Health & Wellness Expo - March 25
• Spring Concert Series - March 30

💰 SPRING SPECIAL:
Use code SPRING2024 for 20% off any event ticket!
Valid until March 31st.

[BROWSE ALL SPRING EVENTS]

Don't let this beautiful season pass by without experiencing something new!

Happy Spring!
The Events Team`,
    suggestedCategories: ["all"],
    priority: "medium",
    description: "Seasonal promotion highlighting relevant events",
    icon: "🌺",
  },
]

const userCategories = [
  { id: "all", name: "All Users", count: 95000, icon: Users, color: "bg-blue-100 text-blue-800" },
  { id: "attendees", name: "Event Attendees", count: 67000, icon: Users, color: "bg-green-100 text-green-800" },
  { id: "organizers", name: "Event Organizers", count: 8900, icon: Users, color: "bg-purple-100 text-purple-800" },
  { id: "technology", name: "Technology", count: 12500, icon: Users, color: "bg-indigo-100 text-indigo-800" },
  { id: "business", name: "Business", count: 8900, icon: Users, color: "bg-orange-100 text-orange-800" },
  { id: "healthcare", name: "Healthcare", count: 6700, icon: Users, color: "bg-red-100 text-red-800" },
  { id: "education", name: "Education", count: 5400, icon: Users, color: "bg-yellow-100 text-yellow-800" },
  { id: "arts", name: "Arts & Culture", count: 4200, icon: Users, color: "bg-pink-100 text-pink-800" },
  { id: "sports", name: "Sports & Fitness", count: 3800, icon: Users, color: "bg-emerald-100 text-emerald-800" },
  { id: "food", name: "Food & Beverage", count: 3200, icon: Users, color: "bg-amber-100 text-amber-800" },
  { id: "travel", name: "Travel & Tourism", count: 2900, icon: Users, color: "bg-cyan-100 text-cyan-800" },
  { id: "automotive", name: "Automotive", count: 2100, icon: Users, color: "bg-slate-100 text-slate-800" },
  { id: "realestate", name: "Real Estate", count: 1800, icon: Users, color: "bg-teal-100 text-teal-800" },
  { id: "entertainment", name: "Entertainment", count: 1500, icon: Users, color: "bg-violet-100 text-violet-800" },
  { id: "retail", name: "Retail & Fashion", count: 1200, icon: Users, color: "bg-rose-100 text-rose-800" },
]

const mockPromotions: Promotion[] = [
  {
    id: "1",
    type: "push",
    title: "🚀 New Tech Conference Alert!",
    content: "Join the biggest technology conference of the year. Early bird tickets available now with 30% discount!",
    targetCategories: ["technology", "business"],
    status: "sent",
    priority: "high",
    createdAt: "2024-01-15T10:30:00",
    sentAt: "2024-01-15T14:00:00",
    stats: { sent: 21400, delivered: 20980, opened: 15980, clicked: 3196, bounced: 420 },
    engagement: { openRate: 76.2, clickRate: 20.0, deliveryRate: 98.0 },
  },
  {
    id: "2",
    type: "email",
    title: "📅 Weekly Event Newsletter - January Edition",
    content:
      "Discover amazing events happening this week in your area. From tech meetups to cultural festivals, we've got you covered!",
    targetCategories: ["all"],
    status: "sent",
    priority: "medium",
    createdAt: "2024-01-14T09:00:00",
    sentAt: "2024-01-14T18:00:00",
    stats: { sent: 95000, delivered: 93100, opened: 38000, clicked: 7600, bounced: 1900, unsubscribed: 45 },
    engagement: { openRate: 40.8, clickRate: 20.0, deliveryRate: 98.0 },
  },
  {
    id: "3",
    type: "push",
    title: "🏥 Healthcare Summit 2024 - Register Now",
    content: "Leading healthcare professionals gathering for innovation discussions. Limited seats available!",
    targetCategories: ["healthcare"],
    status: "scheduled",
    priority: "high",
    createdAt: "2024-01-13T16:45:00",
    scheduledAt: "2024-01-20T09:00:00",
    stats: { sent: 0, delivered: 0, opened: 0, clicked: 0 },
    engagement: { openRate: 0, clickRate: 0, deliveryRate: 0 },
  },
  {
    id: "4",
    type: "email",
    title: "🍽️ Food Festival Weekend - Taste the World",
    content: "Experience cuisines from around the globe this weekend! Special discounts for early registrations.",
    targetCategories: ["food", "entertainment"],
    status: "sending",
    priority: "medium",
    createdAt: "2024-01-12T11:20:00",
    stats: { sent: 2800, delivered: 2750, opened: 890, clicked: 156, bounced: 50 },
    engagement: { openRate: 32.4, clickRate: 17.5, deliveryRate: 98.2 },
  },
  {
    id: "5",
    type: "push",
    title: "🎨 Art Exhibition Opening Tonight",
    content:
      "Don't miss the grand opening of the contemporary art exhibition featuring local and international artists.",
    targetCategories: ["arts"],
    status: "draft",
    priority: "low",
    createdAt: "2024-01-11T14:15:00",
    stats: { sent: 0, delivered: 0, opened: 0, clicked: 0 },
    engagement: { openRate: 0, clickRate: 0, deliveryRate: 0 },
  },
]

export default function PromotionsManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [selectedPromotionType, setSelectedPromotionType] = useState<"push" | "email">("push")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null)
  const [newPromotion, setNewPromotion] = useState({
    title: "",
    content: "",
    scheduledAt: "",
    priority: "medium" as "low" | "medium" | "high",
    sendImmediately: true,
  })

  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategories(["all"])
    } else {
      setSelectedCategories((prev) => {
        const filtered = prev.filter((id) => id !== "all")
        return prev.includes(categoryId) ? filtered.filter((id) => id !== categoryId) : [...filtered, categoryId]
      })
    }
  }

  const calculateTargetAudience = () => {
    if (selectedCategories.includes("all")) {
      return userCategories.find((cat) => cat.id === "all")?.count || 0
    }
    return selectedCategories.reduce((total, catId) => {
      const category = userCategories.find((cat) => cat.id === catId)
      return total + (category?.count || 0)
    }, 0)
  }

  const handleUseTemplate = (template: CampaignTemplate) => {
    setSelectedPromotionType(template.type)
    setNewPromotion({
      title: template.title,
      content: template.content,
      scheduledAt: "",
      priority: template.priority,
      sendImmediately: true,
    })
    setSelectedCategories(template.suggestedCategories)
    setIsTemplateDialogOpen(false)
    setIsCreateDialogOpen(true)
  }

  const handleCreatePromotion = () => {
    const newPromo: Promotion = {
      id: Date.now().toString(),
      type: selectedPromotionType,
      title: newPromotion.title,
      content: newPromotion.content,
      targetCategories: selectedCategories,
      status: newPromotion.sendImmediately ? "sending" : "scheduled",
      priority: newPromotion.priority,
      createdAt: new Date().toISOString(),
      scheduledAt: newPromotion.sendImmediately ? undefined : newPromotion.scheduledAt,
      stats: { sent: 0, delivered: 0, opened: 0, clicked: 0 },
      engagement: { openRate: 0, clickRate: 0, deliveryRate: 0 },
    }

    setPromotions((prev) => [newPromo, ...prev])
    setIsCreateDialogOpen(false)
    setNewPromotion({
      title: "",
      content: "",
      scheduledAt: "",
      priority: "medium",
      sendImmediately: true,
    })
    setSelectedCategories([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 border-green-200"
      case "sending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "push":
        return <Bell className="w-5 h-5 text-blue-600" />
      case "email":
        return <Mail className="w-5 h-5 text-green-600" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const filteredPromotions = promotions.filter((promo) => {
    const statusMatch = filterStatus === "all" || promo.status === filterStatus
    const typeMatch = filterType === "all" || promo.type === filterType
    return statusMatch && typeMatch
  })

  const totalStats = promotions.reduce(
    (acc, promo) => ({
      sent: acc.sent + promo.stats.sent,
      delivered: acc.delivered + promo.stats.delivered,
      opened: acc.opened + promo.stats.opened,
      clicked: acc.clicked + promo.stats.clicked,
    }),
    { sent: 0, delivered: 0, opened: 0, clicked: 0 },
  )

  const avgEngagement = {
    openRate:
      promotions.length > 0 ? promotions.reduce((acc, p) => acc + p.engagement.openRate, 0) / promotions.length : 0,
    clickRate:
      promotions.length > 0 ? promotions.reduce((acc, p) => acc + p.engagement.clickRate, 0) / promotions.length : 0,
    deliveryRate:
      promotions.length > 0 ? promotions.reduce((acc, p) => acc + p.engagement.deliveryRate, 0) / promotions.length : 0,
  }

  const pushTemplates = campaignTemplates.filter((t) => t.type === "push")
  const emailTemplates = campaignTemplates.filter((t) => t.type === "email")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions Management</h1>
          <p className="text-gray-600 mt-1">
            Manage push notifications and email campaigns with targeted user engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Data
          </Button> */}
          {/* <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-transparent border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Template className="w-4 h-4" />
                Use Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Campaign Templates
                </DialogTitle>
                <DialogDescription>
                  Choose from our professionally crafted templates to create effective campaigns quickly
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="push" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="push" className="gap-2">
                    <Bell className="w-4 h-4" />
                    Push Templates ({pushTemplates.length})
                  </TabsTrigger>
                  <TabsTrigger value="email" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Email Templates ({emailTemplates.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="push" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pushTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{template.icon}</div>
                              <div>
                                <h3 className="font-semibold text-lg">{template.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {template.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={getPriorityColor(template.priority)}>{template.priority}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                          <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <p className="font-medium text-sm mb-1">Title:</p>
                            <p className="text-sm text-gray-700 mb-2">{template.title}</p>
                            <p className="font-medium text-sm mb-1">Content:</p>
                            <p className="text-sm text-gray-700">{template.content}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Targets: {template.suggestedCategories.join(", ")}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleUseTemplate(template)}
                              className="gap-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <Copy className="w-3 h-3" />
                              Use Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 gap-4">
                    {emailTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-green-500"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{template.icon}</div>
                              <div>
                                <h3 className="font-semibold text-lg">{template.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {template.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={getPriorityColor(template.priority)}>{template.priority}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="font-medium text-sm mb-2">Subject Line:</p>
                            <p className="text-sm text-gray-700 mb-3">{template.title}</p>
                            <p className="font-medium text-sm mb-2">Email Content Preview:</p>
                            <div className="text-sm text-gray-700 max-h-32 overflow-y-auto whitespace-pre-line">
                              {template.content.substring(0, 300)}...
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Targets: {template.suggestedCategories.join(", ")}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleUseTemplate(template)}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              <Copy className="w-3 h-3" />
                              Use Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog> */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              {/* <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                Create Campaign
              </Button> */}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* <DialogHeader>
                <DialogTitle className="text-2xl">Create New Campaign</DialogTitle>
                <DialogDescription>
                  Create targeted promotions for specific user categories with advanced options
                </DialogDescription>
              </DialogHeader> */}

              <div className="space-y-6">
                {/* Campaign Type Selection */}
                {/* <div className="space-y-4">
                  <Label className="text-base font-semibold">Campaign Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedPromotionType === "push"
                          ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPromotionType("push")}
                    >
                      <CardContent className="p-6 text-center">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                        <h3 className="font-semibold text-lg mb-2">Push Notification</h3>
                        <p className="text-sm text-gray-600">Instant mobile alerts with high visibility</p>
                        <div className="mt-3 text-xs text-gray-500">
                          • Immediate delivery • High open rates • Mobile-first experience
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedPromotionType === "email"
                          ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPromotionType("email")}
                    >
                      <CardContent className="p-6 text-center">
                        <Mail className="w-12 h-12 mx-auto mb-3 text-green-600" />
                        <h3 className="font-semibold text-lg mb-2">Email Campaign</h3>
                        <p className="text-sm text-gray-600">Rich content emails with detailed analytics</p>
                        <div className="mt-3 text-xs text-gray-500">
                          • Rich HTML content • Detailed analytics • Professional templates
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div> */}

                {/* Campaign Details */}
                {/* <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="title" className="text-base font-semibold">
                      Campaign Title
                    </Label>
                    <Input
                      id="title"
                      value={newPromotion.title}
                      onChange={(e) => setNewPromotion((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder={
                        selectedPromotionType === "push"
                          ? "🚀 Your exciting push notification title"
                          : "📧 Your compelling email subject line"
                      }
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="content" className="text-base font-semibold">
                      Campaign Content
                    </Label>
                    <Textarea
                      id="content"
                      value={newPromotion.content}
                      onChange={(e) => setNewPromotion((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder={
                        selectedPromotionType === "push"
                          ? "Write a compelling message that will grab attention on mobile devices..."
                          : "Create engaging email content with rich formatting and clear call-to-action..."
                      }
                      rows={6}
                      className="resize-none"
                    />
                    <div className="text-sm text-gray-500">
                      {selectedPromotionType === "push"
                        ? "Keep it concise - push notifications work best with 50-100 characters"
                        : "Email content can be longer and more detailed with formatting options"}
                    </div>
                  </div>
                </div> */}

                {/* Priority and Scheduling */}
                {/* <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Campaign Priority</Label>
                    <Select
                      value={newPromotion.priority}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setNewPromotion((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Low Priority</SelectItem>
                        <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                        <SelectItem value="high">🔴 High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Delivery Options</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newPromotion.sendImmediately}
                        onCheckedChange={(checked) =>
                          setNewPromotion((prev) => ({ ...prev, sendImmediately: checked }))
                        }
                      />
                      <Label>Send immediately after creation</Label>
                    </div>
                    {!newPromotion.sendImmediately && (
                      <Input
                        type="datetime-local"
                        value={newPromotion.scheduledAt}
                        onChange={(e) => setNewPromotion((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div> */}

                {/* Target Categories */}
                {/* <div className="space-y-4">
                  <Label className="text-base font-semibold">Target Audience</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-4 border rounded-lg bg-gray-50">
                    {userCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                        />
                        <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{category.name}</span>
                            <Badge variant="secondary" className={`text-xs ${category.color}`}>
                              {category.count.toLocaleString()}
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedCategories.length > 0 && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-semibold text-blue-800">
                              Target Audience: {calculateTargetAudience().toLocaleString()} users
                            </div>
                            <div className="text-sm text-blue-600">
                              Selected categories: {selectedCategories.join(", ")}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div> */}
              </div>

              {/* <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePromotion}
                  disabled={!newPromotion.title || !newPromotion.content || selectedCategories.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {newPromotion.sendImmediately ? "Create & Send" : "Create & Schedule"}
                </Button>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-3xl font-bold text-gray-900">{promotions.length}</p>
                <p className="text-xs text-gray-500 mt-1">Active campaigns</p>
              </div>
              <MessageSquare className="w-8 h-8 " />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.sent.toLocaleString()}</p>
                <p className="text-xs mt-1">↗ {avgEngagement.deliveryRate.toFixed(1)}% delivery rate</p>
              </div>
              <Send className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Opens</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.opened.toLocaleString()}</p>
                <p className="text-xs mt-1">↗ {avgEngagement.openRate.toFixed(1)}% open rate</p>
              </div>
              <Eye className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.clicked.toLocaleString()}</p>
                <p className="text-xs mt-1">↗ {avgEngagement.clickRate.toFixed(1)}% click rate</p>
              </div>
              <TrendingUp className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Label className="text-sm font-medium">Filters:</Label>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="push">Push Notifications</SelectItem>
                <SelectItem value="email">Email Campaigns</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Campaigns List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            All Campaigns ({filteredPromotions.length})
          </TabsTrigger>
          <TabsTrigger value="push" className="gap-2">
            <Bell className="w-4 h-4" />
            Push Notifications ({filteredPromotions.filter((p) => p.type === "push").length})
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            Email Campaigns ({filteredPromotions.filter((p) => p.type === "email").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-6">
            {filteredPromotions.map((promotion) => (
              <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getTypeIcon(promotion.type)}
                        <h3 className="text-xl font-semibold text-gray-900">{promotion.title}</h3>
                        <Badge className={`${getStatusColor(promotion.status)} border`}>{promotion.status}</Badge>
                        <Badge className={`${getPriorityColor(promotion.priority)} border`}>
                          {promotion.priority} priority
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{promotion.content}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {new Date(promotion.createdAt).toLocaleDateString()}</span>
                        </div>
                        {promotion.scheduledAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Scheduled: {new Date(promotion.scheduledAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>Categories: {promotion.targetCategories.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {promotion.stats.sent > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{promotion.stats.sent.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {promotion.stats.delivered.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Delivered</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{promotion.stats.opened.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Opened</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{promotion.stats.clicked.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Clicked</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {promotion.engagement.openRate.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-600">Open Rate</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="push" className="space-y-4 mt-6">
          <div className="grid gap-6">
            {filteredPromotions
              .filter((p) => p.type === "push")
              .map((promotion) => (
                <Card key={promotion.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Bell className="w-6 h-6 text-blue-600" />
                          <h3 className="text-xl font-semibold text-gray-900">{promotion.title}</h3>
                          <Badge className={`${getStatusColor(promotion.status)} border`}>{promotion.status}</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{promotion.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📱 Push Notification</span>
                          <span>Created: {new Date(promotion.createdAt).toLocaleDateString()}</span>
                          <span>Categories: {promotion.targetCategories.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    {promotion.stats.sent > 0 && (
                      <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-600">{promotion.stats.sent.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-600">
                            {promotion.stats.delivered.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">Delivered</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-purple-600">{promotion.stats.opened.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Opened</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-600">
                            {promotion.engagement.openRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-600">Open Rate</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 mt-6">
          <div className="grid gap-6">
            {filteredPromotions
              .filter((p) => p.type === "email")
              .map((promotion) => (
                <Card key={promotion.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Mail className="w-6 h-6 text-green-600" />
                          <h3 className="text-xl font-semibold text-gray-900">{promotion.title}</h3>
                          <Badge className={`${getStatusColor(promotion.status)} border`}>{promotion.status}</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{promotion.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📧 Email Campaign</span>
                          <span>Created: {new Date(promotion.createdAt).toLocaleDateString()}</span>
                          <span>Categories: {promotion.targetCategories.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    {promotion.stats.sent > 0 && (
                      <div className="grid grid-cols-5 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-600">{promotion.stats.sent.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-600">
                            {promotion.stats.delivered.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">Delivered</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-purple-600">{promotion.stats.opened.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Opened</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-600">
                            {promotion.stats.clicked.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">Clicked</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-indigo-600">
                            {promotion.engagement.clickRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-600">Click Rate</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
