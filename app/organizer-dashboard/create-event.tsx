"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Upload, Save, ArrowLeft } from "lucide-react"

export default function AddEventPage() {
  const [currentTab, setCurrentTab] = useState("basic")
  const [highlights, setHighlights] = useState<string[]>([""])
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  const addHighlight = () => {
    setHighlights([...highlights, ""])
  }

  const removeHighlight = (index: number) => {
    if (highlights.length > 1) {
      setHighlights(highlights.filter((_, i) => i !== index))
    }
  }

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights]
    newHighlights[index] = value
    setHighlights(newHighlights)
  }

  const addCategory = (category: string) => {
    if (!categories.includes(category) && category.trim()) {
      setCategories([...categories, category])
    }
  }

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category))
  }

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tag.trim()) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Add New Event</h1>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="timing">Timing & Pricing</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media & Features</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input id="title" placeholder="Enter event title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input id="slug" placeholder="event-url-slug" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Event Description *</Label>
                  <Textarea id="description" placeholder="Describe your event in detail..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Event Highlights *</Label>
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        placeholder="Enter highlight"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeHighlight(index)}
                        disabled={highlights.length === 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addHighlight} className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>
                
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Event Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue *</Label>
                    <Input id="venue" placeholder="Convention Center" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea id="address" placeholder="Complete venue address" rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input id="lat" type="number" step="any" placeholder="19.1595" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input id="lng" type="number" step="any" placeholder="72.8656" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timing & Pricing */}
          <TabsContent value="timing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Timing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dailyStart">Daily Start Time *</Label>
                      <Input id="dailyStart" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dailyEnd">Daily End Time *</Label>
                      <Input id="dailyEnd" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone *</Label>
                      <Select defaultValue="IST">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IST">IST (Indian Standard Time)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">EST</SelectItem>
                          <SelectItem value="PST">PST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select defaultValue="₹">
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="₹">₹ (INR)</SelectItem>
                          <SelectItem value="$">$ (USD)</SelectItem>
                          <SelectItem value="€">€ (EUR)</SelectItem>
                          <SelectItem value="£">£ (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="general">General Price *</Label>
                      <Input id="general" type="number" placeholder="2500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student">Student Price</Label>
                      <Input id="student" type="number" placeholder="1500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vip">VIP Price</Label>
                      <Input id="vip" type="number" placeholder="5000" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Event Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedVisitors">Expected Visitors *</Label>
                      <Input id="expectedVisitors" placeholder="10,000+" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exhibitors">Number of Exhibitors *</Label>
                      <Input id="exhibitors" placeholder="200+" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Input id="duration" placeholder="3 Days" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ageLimit">Age Limit *</Label>
                    <Input id="ageLimit" placeholder="18+ years" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dressCode">Dress Code *</Label>
                    <Input id="dressCode" placeholder="Business Casual" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Event Status *</Label>
                  <Select defaultValue="UPCOMING">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Categories *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeCategory(category)}
                        >
                          {category} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add category"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const target = e.target as HTMLInputElement
                            if (target.value.trim()) {
                              addCategory(target.value.trim())
                              target.value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add category"]') as HTMLInputElement
                          if (input?.value.trim()) {
                            addCategory(input.value.trim())
                            input.value = ""
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Tags *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add tag"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const target = e.target as HTMLInputElement
                            if (target.value.trim()) {
                              addTag(target.value.trim())
                              target.value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add tag"]') as HTMLInputElement
                          if (input?.value.trim()) {
                            addTag(input.value.trim())
                            input.value = ""
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media & Features */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Event Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Upload event images</p>
                    <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
                    <Button variant="outline" className="mt-4 bg-transparent">
                      Choose Files
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Additional features like featured items, exhibitors, and tourist attractions can be added after
                    creating the event.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <div className="flex gap-2">
            {currentTab !== "basic" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const tabs = ["basic", "location", "timing", "details", "media"]
                  const currentIndex = tabs.indexOf(currentTab)
                  if (currentIndex > 0) {
                    setCurrentTab(tabs[currentIndex - 1])
                  }
                }}
              >
                Previous
              </Button>
            )}
            {currentTab !== "media" ? (
              <Button
                type="button"
                onClick={() => {
                  const tabs = ["basic", "location", "timing", "details", "media"]
                  const currentIndex = tabs.indexOf(currentTab)
                  if (currentIndex < tabs.length - 1) {
                    setCurrentTab(tabs[currentIndex + 1])
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="button" className="bg-orange-600 hover:bg-orange-700">
                <Save className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
