"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Users,
  Store,
  Network,
  MessageSquare,
  Settings,
  LogOut,
  Star,
  Map,
  Heart,
  List
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { User, Calendar, Users, MessageSquare, Settings, Bell, Loader2 } from "lucide-react"
import { ProfileSection } from "./profile-section"
import { EventsSection } from "./events-section"
import { ConnectionsSection } from "./connections-section"
import MessagesSection from "@/app/organizer-dashboard/messages-center"
import { SettingsSection } from "./settings-section"
import { useToast } from "@/hooks/use-toast"

interface UserDashboardProps {
  userId: string
}

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: string
  bio?: string
  website?: string
  linkedin?: string
  twitter?: string
  company?: string
  jobTitle?: string
  location?: {
    address: string
    city: string
    state: string
    country: string
  }
  isVerified: boolean
  createdAt: string
  lastLogin?: string
  _count?: {
    eventsAttended: number
    eventsOrganized: number
    connections: number
  }
}

export function UserDashboard({ userId }: UserDashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  

  const [activeSection, setActiveSection] = useState("profile")
  const [openMenus, setOpenMenus] = useState<string[]>(["dashboard"])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    fetchUserData()
  }, [status])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/users/${userId}`)
      if (!res.ok) throw new Error("Failed to load user")
      const data = await res.json()
      setUserData(data.user)
    } catch (err) {
      setError("Error loading user data")
    } finally {
      setLoading(false)
    }
  }

  const updateUserData = async (updatedData: Partial<UserData>) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update user data")
      }

      const data = await response.json()
      setUserData((prev) => (prev ? { ...prev, ...data.user } : data.user))

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (err) {
      console.error("Error updating user data:", err)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sidebarItems = [
    {
      title: "Profile",
      icon: User,
      id: "profile",
    },
    {
      title: "Events",
      icon: Calendar,
      id: "events",
    },
    {
      title: "Connections",
      icon: Users,
      id: "connections",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      id: "messages",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ]

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="h-64 w-full" />
    }
    if (error) {
      return <p className="text-red-600">{error}</p>
    }
    switch (activeSection) {
      case "profile":
        return <ProfileSection userData={userData!} onUpdate={() => {}} />
      case "events":
        return <EventsSection userId={userId} />
      case "exhibitors":
        return <ExhibitorsSection userId={userId} />
      case "networking":
        return <NetworkingSection userId={userId} />
      case "connections":
        return <ConnectionsSection userId={userId} />
      case "messages":
        return <MessagesSection organizerId={userId} />
      case "settings":
        return <SettingsSection userData={userData!} onUpdate={() => {}} />
      default:
        return <p>Select a section</p>
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={userData?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {userData?.firstName?.[0] || "U"}
                  {userData?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {/* {userData?.firstName && userData?.lastName ? `${userData.firstName} ${userData.lastName}` : "User"} */}
                  {userData?.firstName}
                </div>
                <div className="text-sm text-gray-600">{userData?.jobTitle || userData?.role || "User"}</div>
              </div>
            </div>

            {/* Exhibitors */}
            {/* <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("exhibitors")}
              >
                <span className="flex items-center gap-2">
                  <Store size={16} /> Exhibitors
                </span>
                {openMenus.includes("exhibitors") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {openMenus.includes("exhibitors") && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    All Exhibitors
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    <Heart size={14} className="inline mr-1" /> Favourites
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    <Star size={14} className="inline mr-1" /> Recommendation
                  </li>
                </ul>
              )}
            </div> */}

            {/* Networking */}
            <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("networking")}
              >
                <span className="flex items-center gap-2">
                  <Network size={16} /> Networking
                </span>
                {openMenus.includes("networking") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {openMenus.includes("networking") && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  {/* <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Exhibitor Connect
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Suggested Exhibitor
                  </li> */}
                  <li
                    onClick={() => setActiveSection("connections")}
                    className={`cursor-pointer pl-3 py-1 border-l-4 ${
                      activeSection === "connections"
                        ? "border-blue-500 text-blue-600 font-medium"
                        : "border-transparent hover:text-blue-600"
                    }`}
                  >
                    My Connections
                  </li>
                </ul>
              )}
            </div>

            {/* Messages */}
            <div>
              <button
                onClick={() => setActiveSection("messages")}
                className={`flex items-center gap-2 w-full py-2 font-medium ${
                  activeSection === "messages"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                <MessageSquare size={16} /> Messages
              </button>
            </div>

            {/* Event Planning Tools */}
            {/* <div>
              <button
                className="flex items-center justify-between w-full py-2 font-medium"
                onClick={() => toggleMenu("tools")}
              >
                <span className="flex items-center gap-2">
                  <List size={16} /> Event Planning Tools
                </span>
                {openMenus.includes("tools") ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {openMenus.includes("tools") && (
                <ul className="ml-2 mt-2 space-y-2 border-l">
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    My Schedule
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    <Map size={14} className="inline mr-1" /> Venue Map / Floor Plan
                  </li>
                  <li className="cursor-pointer pl-3 py-1 border-l-4 border-transparent hover:text-blue-600">
                    Travel & Accommodation
                  </li>
                </ul>
              )}
            </div> */}

            {/* Settings */}
            <div>
              <button
                onClick={() => setActiveSection("settings")}
                className={`flex items-center gap-2 w-full py-2 font-medium ${
                  activeSection === "settings"
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                <Settings size={16} /> Settings
              </button>
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  )
}

// Exhibitors Section Component
function ExhibitorsSection({ userId }: { userId: string }) {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [filteredExhibitors, setFilteredExhibitors] = useState<Exhibitor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Mock data - replace with API call
    const mockExhibitors: Exhibitor[] = [
      {
        id: "1",
        name: "Tech Innovations Inc.",
        logo: "/placeholder.svg",
        category: "Technology",
        country: "USA",
        products: ["AI Software", "IoT Devices", "Cloud Solutions"],
        description: "Leading provider of innovative technology solutions",
        isFavorite: true,
        isRecommended: true
      },
      {
        id: "2",
        name: "Green Energy Solutions",
        logo: "/placeholder.svg",
        category: "Energy",
        country: "Germany",
        products: ["Solar Panels", "Wind Turbines", "Energy Storage"],
        description: "Sustainable energy solutions for a greener future",
        isFavorite: false,
        isRecommended: true
      },
      {
        id: "3",
        name: "HealthTech Medical",
        logo: "/placeholder.svg",
        category: "Healthcare",
        country: "Japan",
        products: ["Medical Devices", "Health Monitoring", "Telemedicine"],
        description: "Advancing healthcare through technology",
        isFavorite: true,
        isRecommended: false
      },
      {
        id: "4",
        name: "Global Logistics",
        logo: "/placeholder.svg",
        category: "Logistics",
        country: "Singapore",
        products: ["Supply Chain", "Freight", "Warehousing"],
        description: "Worldwide logistics and supply chain solutions",
        isFavorite: false,
        isRecommended: false
      }
    ]
    
    setExhibitors(mockExhibitors)
    setFilteredExhibitors(mockExhibitors)
  }, [])

  useEffect(() => {
    let result = exhibitors
    
    // Apply tab filter
    if (activeTab === "favorites") {
      result = result.filter(exhibitor => exhibitor.isFavorite)
    } else if (activeTab === "recommended") {
      result = result.filter(exhibitor => exhibitor.isRecommended)
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(exhibitor => 
        exhibitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibitor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibitor.products.some(product => 
          product.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(exhibitor => exhibitor.category === categoryFilter)
    }
    
    // Apply country filter
    if (countryFilter !== "all") {
      result = result.filter(exhibitor => exhibitor.country === countryFilter)
    }
    
    setFilteredExhibitors(result)
  }, [exhibitors, searchTerm, categoryFilter, countryFilter, activeTab])

  const toggleFavorite = (id: string) => {
    setExhibitors(prev => prev.map(exhibitor => 
      exhibitor.id === id 
        ? { ...exhibitor, isFavorite: !exhibitor.isFavorite } 
        : exhibitor
    ))
  }

  const categories = Array.from(new Set(exhibitors.map(e => e.category)))
  const countries = Array.from(new Set(exhibitors.map(e => e.country)))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Exhibitors & Products</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Exhibitors</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search exhibitors or products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option value="all">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitors.map(exhibitor => (
          <Card key={exhibitor.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">{exhibitor.name}</CardTitle>
                <CardDescription>{exhibitor.description}</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleFavorite(exhibitor.id)}
              >
                <Star 
                  className={`h-5 w-5 ${exhibitor.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} 
                />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex space-x-2 mb-4">
                <Badge variant="secondary">{exhibitor.category}</Badge>
                <Badge variant="outline">{exhibitor.country}</Badge>
                {exhibitor.isRecommended && <Badge variant="default">Recommended</Badge>}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Products:</h4>
                <div className="flex flex-wrap gap-2">
                  {exhibitor.products.map((product, index) => (
                    <Badge key={index} variant="outline">{product}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button>Request Meeting</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredExhibitors.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No exhibitors found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => {
            setSearchTerm("")
            setCategoryFilter("all")
            setCountryFilter("all")
            setActiveTab("all")
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

// Networking Section Component
function NetworkingSection({ userId }: { userId: string }) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [activeTab, setActiveTab] = useState("suggested")

  useEffect(() => {
    // Mock data - replace with API call
    const mockConnections: Connection[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        company: "Tech Innovations Inc.",
        position: "CEO",
        status: 'suggested'
      },
      {
        id: "2",
        name: "Michael Chen",
        avatar: "/placeholder.svg",
        company: "Green Energy Solutions",
        position: "Sales Director",
        status: 'suggested'
      },
      {
        id: "3",
        name: "Emma Wright",
        avatar: "/placeholder.svg",
        company: "HealthTech Medical",
        position: "Product Manager",
        status: 'pending'
      },
      {
        id: "4",
        name: "David Miller",
        avatar: "/placeholder.svg",
        company: "Global Logistics",
        position: "Operations Director",
        status: 'connected'
      },
      {
        id: "5",
        name: "Lisa Rodriguez",
        avatar: "/placeholder.svg",
        company: "Future Tech",
        position: "CTO",
        status: 'suggested'
      }
    ]
    
    setConnections(mockConnections)
  }, [])

  const sendConnectionRequest = (id: string) => {
    setConnections(prev => prev.map(connection => 
      connection.id === id 
        ? { ...connection, status: 'pending' as const } 
        : connection
    ))
    // API call to send connection request would go here
  }

  const acceptConnectionRequest = (id: string) => {
    setConnections(prev => prev.map(connection => 
      connection.id === id 
        ? { ...connection, status: 'connected' as const } 
        : connection
    ))
    // API call to accept connection request would go here
  }

  const filteredConnections = connections.filter(connection => {
    if (activeTab === "suggested") return connection.status === 'suggested'
    if (activeTab === "requests") return connection.status === 'pending'
    if (activeTab === "connections") return connection.status === 'connected'
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Networking & Business Matching</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggested">Suggested Connections</TabsTrigger>
          <TabsTrigger value="requests">Connection Requests</TabsTrigger>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Exhibitor Connect</h2>
        <Card>
          <CardHeader>
            <CardTitle>Meeting Requests</CardTitle>
            <CardDescription>
              Schedule meetings with exhibitors and other attendees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p>You have 3 pending meeting requests</p>
              <Button>View All Meetings</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredConnections.map(connection => (
          <Card key={connection.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={connection.avatar} />
                  <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-grow">
                  <h3 className="font-semibold">{connection.name}</h3>
                  <p className="text-sm text-muted-foreground">{connection.position} at {connection.company}</p>
                </div>
                
                <div className="flex gap-2">
                  {connection.status === 'suggested' && (
                    <Button size="sm" onClick={() => sendConnectionRequest(connection.id)}>
                      <UserPlus className="h-4 w-4 mr-1" /> Connect
                    </Button>
                  )}
                  
                  {connection.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline">Ignore</Button>
                      <Button size="sm" onClick={() => acceptConnectionRequest(connection.id)}>Accept</Button>
                    </>
                  )}
                  
                  {connection.status === 'connected' && (
                    <Button size="sm" variant="outline">Message</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConnections.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No {activeTab} found</h3>
          <p className="text-muted-foreground">
            {activeTab === 'suggested' 
              ? "Check back later for new connection suggestions" 
              : activeTab === 'requests'
              ? "You don't have any pending connection requests"
              : "You haven't made any connections yet"
            }
          </p>
        </div>
      )}
    </div>
  )
}