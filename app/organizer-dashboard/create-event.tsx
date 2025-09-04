"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Clock, IndianRupee, X, Plus, Eye, Save, Send, Loader2 } from "lucide-react"
import { nanoid } from "nanoid";

interface FieldStatus {
  name: string;
  done: boolean;
}
interface CreateEventProps {
 
  organizerId: string
}

interface EventFormData {
  title: string
  description: string
  eventType: string
  categories: string[]
  startDate: string
  endDate: string
  dailyStart: string
  dailyEnd: string
  timezone: string
  venue: string
  city: string
  address: string
  currency: string
  generalPrice: number
  studentPrice: number
  vipPrice: number
  highlights: string[]
  tags: string[]
  dressCode: string
  ageLimit: string
  featured: boolean
  vip: boolean
  images: string[]
  brochure: string
  layoutPlan: string
}

export default function CreateEvent({ organizerId }: CreateEventProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    eventType: "",
    categories: [],
    startDate: "",
    endDate: "",
    dailyStart: "09:00",
    dailyEnd: "18:00",
    timezone: "Asia/Kolkata",
    venue: "",
    city: "",
    address: "",
    currency: "₹",
    generalPrice: 0,
    studentPrice: 0,
    vipPrice: 0,
    highlights: [],
    tags: [],
    dressCode: "Business Casual",
    ageLimit: "18+",
    featured: false,
    vip: false,
    images: [],
    brochure: "",
    layoutPlan: "",
  })


const getFieldStatus = (): FieldStatus[] => {
  const fieldsToCheck = [
    "title",
    "description",
    "eventType",
    "categories",
    "startDate",
    "endDate",
    "dailyStart",
    "dailyEnd",
    "timezone",
    "venue",
    "city",
    "address",
    "currency",
    "generalPrice",
    "studentPrice",
    "vipPrice",
    "highlights",
    "tags",
    "dressCode",
    "ageLimit",
    "featured",
    "vip",
    "images",
    "brochure",
    "layoutPlan",
  ];

  return fieldsToCheck.map((field) => {
    const value = (formData as any)[field];
    let done = false;

    if (Array.isArray(value)) {
      done = value.length > 0;
    } else if (typeof value === "string") {
      done = value.trim() !== "";
    } else if (typeof value === "number") {
      done = value > 0;
    } else if (typeof value === "boolean") {
      done = value; // true = done, false = pending
    }

    return { name: field, done };
  });
};
// Calculate form completion percentage
const calculateCompletion = (): number => {
  const statuses = getFieldStatus()
  const doneCount = statuses.filter((field) => field.done).length
  return Math.round((doneCount / statuses.length) * 100)
}




  const [newHighlight, setNewHighlight] = useState("")
  const [newTag, setNewTag] = useState("")

  const eventTypes = [
    "Conference",
    "Trade Show",
    "Exhibition",
    "Workshop",
    "Seminar",
    "Networking Event",
    "Product Launch",
    "Corporate Event",
  ]

  const eventCategories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Automotive",
    "Fashion",
    "Food & Beverage",
    "Real Estate",
    "Energy",
  ]

  const currencies = ["₹", "$", "€", "£", "¥"]

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }))
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSaveDraft = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/organizers/${organizerId}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "draft",
        }),
      })

      if (!response.ok) throw new Error("Failed to save draft")

      toast({
        title: "Success",
        description: "Event draft saved successfully",
      })
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
const validateForm = (): boolean => {
  const newErrors: { [key: string]: string } = {};

  // Basic Info validations
  if (!formData.title.trim()) newErrors.title = "Event title is required";
  if (!formData.description.trim()) newErrors.description = "Event description is required";
  if (!formData.eventType) newErrors.eventType = "Event type is required";
  if (formData.categories.length === 0) newErrors.categories = "Select at least one category";
  if (!formData.startDate) newErrors.startDate = "Start date is required";
  if (!formData.endDate) newErrors.endDate = "End date is required";
  if (!formData.venue.trim()) newErrors.venue = "Venue is required";
  if (!formData.city.trim()) newErrors.city = "City is required";
  if (!formData.address.trim()) newErrors.address = "Address is required";

  // Event Details validations
  // if (formData.highlights.length === 0) newErrors.highlights = "Add at least one highlight";
  if (formData.tags.length === 0) newErrors.tags = "Add at least one tag";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};





const handlePublishEvent = async () => {
  if (!validateForm()) return;

  try {
    setLoading(true);

    const slug =
      formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") + "-" + nanoid(5)

    const response = await fetch(`/api/organizers/${organizerId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, status: "published", slug }),
    });

    if (!response.ok) throw new Error("Failed to publish event");

    toast({
      title: "Success",
      description: "Event published successfully",
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      eventType: "",
      categories: [],
      startDate: "",
      endDate: "",
      dailyStart: "09:00",
      dailyEnd: "18:00",
      timezone: "Asia/Kolkata",
      venue: "",
      city: "",
      address: "",
      currency: "₹",
      generalPrice: 0,
      studentPrice: 0,
      vipPrice: 0,
      highlights: [],
      tags: [],
      dressCode: "Business Casual",
      ageLimit: "18+",
      featured: false,
      vip: false,
      images: [],
      brochure: "",
      layoutPlan: "",
    });
    setActiveTab("basic");
  } catch (error) {
    console.error("Error publishing event:", error);
    toast({
      title: "Error",
      description: "Failed to publish event",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <p className="text-gray-600">Fill in the details to create your event</p>
        </div>
        {/* <div className="mb-4">
  <h3 className="font-semibold text-gray-700 mb-2">Field Status</h3>
  <ul className="space-y-1 text-sm">
    {getFieldStatus().map((field) => (
      <li key={field.name} className="flex items-center gap-2">
        <span
          className={`w-3 h-3 rounded-full ${
            field.done ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        <span className={field.done ? "text-gray-700" : "text-gray-400 line-through"}>
          {field.name}
        </span>
      </li>
    ))}
  </ul>
</div> */}

        <div className="mb-4">
  <p className="text-sm text-gray-600 mb-1">Form Completion: {calculateCompletion()}%</p>
  <div className="w-full h-2 bg-gray-200 rounded-full">
    <div
      className="h-2 bg-blue-600 rounded-full transition-all"
      style={{ width: `${calculateCompletion()}%` }}
    ></div>
  </div>
</div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button onClick={handlePublishEvent} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Publish Event
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
  <Label htmlFor="title">Event Title *</Label>
  <Input
    id="title"
    value={formData.title}
    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
    placeholder="Enter event title"
  />
  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
</div>


                <div>
  <Label htmlFor="eventType">Event Type *</Label>
  <Select
    value={formData.eventType}
    onValueChange={(value) => setFormData((prev) => ({ ...prev, eventType: value }))}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select event type" />
    </SelectTrigger>
    <SelectContent>
      {eventTypes.map((type) => (
        <SelectItem key={type} value={type}>{type}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.eventType && <p className="text-red-600 text-sm mt-1">{errors.eventType}</p>}
</div>


 <div>
  <Label>Event Categories</Label>
  <div className="flex flex-wrap gap-2 mt-2">
    {eventCategories.map((category) => (
      <Badge
        key={category}
        variant={formData.categories.includes(category) ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => handleCategoryToggle(category)}
      >
        {category}
      </Badge>
    ))}
  </div>
  {errors.categories && <p className="text-red-600 text-sm mt-1">{errors.categories}</p>}
</div>


  <div className="md:col-span-2">
  <Label htmlFor="description">Event Description *</Label>
  <Textarea
    id="description"
    value={formData.description}
    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
    placeholder="Describe your event"
    rows={4}
  />
  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
</div>

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Event Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
  <Label htmlFor="startDate">Start Date *</Label>
  <Input
    id="startDate"
    type="date"
    value={formData.startDate}
    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
  />
  {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
</div>

               <div>
  <Label htmlFor="endDate">End Date *</Label>
  <Input
    id="endDate"
    type="date"
    value={formData.endDate}
    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
  />
  {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
</div>

                <div>
                  <Label htmlFor="dailyStart">Daily Start Time</Label>
                  <Input
                    id="dailyStart"
                    type="time"
                    value={formData.dailyStart}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dailyStart: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="dailyEnd">Daily End Time</Label>
                  <Input
                    id="dailyEnd"
                    type="time"
                    value={formData.dailyEnd}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dailyEnd: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
  <Label htmlFor="venue">Venue Name *</Label>
  <Input
    id="venue"
    value={formData.venue}
    onChange={(e) => setFormData((prev) => ({ ...prev, venue: e.target.value }))}
    placeholder="Enter venue name"
  />
  {errors.venue && <p className="text-red-600 text-sm mt-1">{errors.venue}</p>}
</div>


<div>
  <Label htmlFor="city">City *</Label>
  <Input
    id="city"
    value={formData.city}
    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
    placeholder="Enter city"
  />
  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
</div>


<div className="md:col-span-2">
  <Label htmlFor="address">Full Address *</Label>
  <Textarea
    id="address"
    value={formData.address}
    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
    placeholder="Enter complete address"
    rows={2}
  />
  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
</div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add event highlight"
                  onKeyPress={(e) => e.key === "Enter" && addHighlight()}
                />
                <Button onClick={addHighlight}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {highlight}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeHighlight(index)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Tags & Keywords</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
          <div className="flex gap-2">
  <Input
    value={newTag}
    onChange={(e) => setNewTag(e.target.value)}
    placeholder="Add event tag"
    onKeyPress={(e) => e.key === "Enter" && addTag()}
  />
  <Button onClick={addTag}>
    <Plus className="w-4 h-4" />
  </Button>
</div>
{errors.tags && <p className="text-red-600 text-sm mt-1">{errors.tags}</p>}

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    #{tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(index)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured Event</Label>
                  <p className="text-sm text-gray-600">Mark this event as featured</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>VIP Event</Label>
                  <p className="text-sm text-gray-600">Mark this as a VIP event</p>
                </div>
                <Switch
                  checked={formData.vip}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, vip: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Ticket Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="generalPrice">General Entry</Label>
                  <Input
                    id="generalPrice"
                    type="number"
                    value={formData.generalPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, generalPrice: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="studentPrice">Student Price</Label>
                  <Input
                    id="studentPrice"
                    type="number"
                    value={formData.studentPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, studentPrice: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="vipPrice">VIP Price</Label>
                  <Input
                    id="vipPrice"
                    type="number"
                    value={formData.vipPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vipPrice: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Event Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900">{formData.title || "Event Title"}</h3>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formData.startDate || "Start Date"} - {formData.endDate || "End Date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {formData.venue || "Venue"}, {formData.city || "City"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-gray-700">{formData.description || "Event description will appear here..."}</p>

                  {formData.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Event Highlights:</h4>
                      <div className="space-y-1">
                        {formData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">General Entry</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {formData.currency}
                        {formData.generalPrice || 0}
                      </p>
                    </div>

                    {formData.studentPrice > 0 && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Student Price</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {formData.currency}
                          {formData.studentPrice}
                        </p>
                      </div>
                    )}

                    {formData.vipPrice > 0 && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">VIP Price</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {formData.currency}
                          {formData.vipPrice}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

