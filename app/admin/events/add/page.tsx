// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Plus, Minus, Upload, Save, ArrowLeft } from "lucide-react"
// // import { createEvent } from "@/lib/actions/events"
// import { toast } from "sonner"

// // Validation schema
// const eventSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   slug: z.string().min(1, "Slug is required"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   highlights: z.array(z.string().min(1, "Highlight cannot be empty")).min(1, "At least one highlight is required"),

//   // Location
//   location: z.object({
//     city: z.string().min(1, "City is required"),
//     venue: z.string().min(1, "Venue is required"),
//     address: z.string().min(1, "Address is required"),
//     coordinates: z.object({
//       lat: z.number(),
//       lng: z.number(),
//     }),
//   }),

//   // Timings
//   timings: z.object({
//     startDate: z.string().min(1, "Start date is required"),
//     endDate: z.string().min(1, "End date is required"),
//     dailyStart: z.string().min(1, "Daily start time is required"),
//     dailyEnd: z.string().min(1, "Daily end time is required"),
//     timezone: z.string().min(1, "Timezone is required"),
//   }),

//   // Pricing
//   pricing: z.object({
//     general: z.number().min(0, "General price must be positive"),
//     student: z.number().optional(),
//     vip: z.number().optional(),
//     currency: z.string().min(1, "Currency is required"),
//   }),

//   // Stats
//   stats: z.object({
//     expectedVisitors: z.string().min(1, "Expected visitors is required"),
//     exhibitors: z.string().min(1, "Number of exhibitors is required"),
//     duration: z.string().min(1, "Duration is required"),
//   }),

//   categories: z.array(z.string()).min(1, "At least one category is required"),
//   tags: z.array(z.string()).min(1, "At least one tag is required"),
//   ageLimit: z.string().min(1, "Age limit is required"),
//   dressCode: z.string().min(1, "Dress code is required"),
//   status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]),
//   organizerId: z.string().min(1, "Organizer is required"),
// })

// type EventFormData = z.infer<typeof eventSchema>

// export default function AddEventPage() {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [currentTab, setCurrentTab] = useState("basic")
//   const [highlights, setHighlights] = useState<string[]>([""])

//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<EventFormData>({
//     resolver: zodResolver(eventSchema),
//     defaultValues: {
//       highlights: [""],
//       categories: [],
//       tags: [],
//       location: {
//         coordinates: { lat: 0, lng: 0 },
//       },
//       pricing: {
//         currency: "₹",
//       },
//       status: "UPCOMING",
//       timings: {
//         timezone: "IST",
//       },
//     },
//   })

//   // Manual highlight management to avoid TypeScript issues
//   const addHighlight = () => {
//     const newHighlights = [...highlights, ""]
//     setHighlights(newHighlights)
//     setValue("highlights", newHighlights)
//   }

//   const removeHighlight = (index: number) => {
//     if (highlights.length > 1) {
//       const newHighlights = highlights.filter((_, i) => i !== index)
//       setHighlights(newHighlights)
//       setValue("highlights", newHighlights)
//     }
//   }

//   const updateHighlight = (index: number, value: string) => {
//     const newHighlights = [...highlights]
//     newHighlights[index] = value
//     setHighlights(newHighlights)
//     setValue("highlights", newHighlights)
//   }

//   const onSubmit = async (data: EventFormData) => {
//     console.log("Form submitted with data:", data)
//     setIsSubmitting(true)

//     try {
//       // Validate that all required fields are filled
//       const formData = watch()
//       console.log("Current form data:", formData)

//       // Check if highlights are properly set
//       if (!data.highlights || data.highlights.length === 0 || data.highlights.some((h) => !h.trim())) {
//         toast.error("Please add at least one valid highlight")
//         setIsSubmitting(false)
//         return
//       }

//       // Check if categories and tags are set
//       if (!data.categories || data.categories.length === 0) {
//         toast.error("Please add at least one category")
//         setIsSubmitting(false)
//         return
//       }

//       if (!data.tags || data.tags.length === 0) {
//         toast.error("Please add at least one tag")
//         setIsSubmitting(false)
//         return
//       }

//       const result = await createEvent(data)
//       console.log("Server response:", result)

//       if (result.success && result.event) {
//         toast.success("Event created successfully!")
//         router.push(`/event/${result.event.slug}`)
//       }
//     } catch (error) {
//       console.error("Client error:", error)
//       toast.error("An unexpected error occurred")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const addCategory = (category: string) => {
//     const currentCategories = watch("categories") || []
//     if (!currentCategories.includes(category)) {
//       setValue("categories", [...currentCategories, category])
//     }
//   }

//   const removeCategory = (category: string) => {
//     const currentCategories = watch("categories") || []
//     setValue(
//       "categories",
//       currentCategories.filter((c) => c !== category),
//     )
//   }

//   const addTag = (tag: string) => {
//     const currentTags = watch("tags") || []
//     if (!currentTags.includes(tag)) {
//       setValue("tags", [...currentTags, tag])
//     }
//   }

//   const removeTag = (tag: string) => {
//     const currentTags = watch("tags") || []
//     setValue(
//       "tags",
//       currentTags.filter((t) => t !== tag),
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="flex items-center gap-4 mb-6">
//           <Button variant="outline" size="icon" onClick={() => router.back()}>
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//           <h1 className="text-3xl font-bold">Add New Event</h1>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
//             <TabsList className="grid w-full grid-cols-5">
//               <TabsTrigger value="basic">Basic Info</TabsTrigger>
//               <TabsTrigger value="location">Location</TabsTrigger>
//               <TabsTrigger value="timing">Timing & Pricing</TabsTrigger>
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="media">Media & Features</TabsTrigger>
//             </TabsList>

//             {/* Basic Information */}
//             <TabsContent value="basic">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Basic Event Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="title">Event Title *</Label>
//                       <Input id="title" {...register("title")} placeholder="Enter event title" />
//                       {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="slug">URL Slug *</Label>
//                       <Input id="slug" {...register("slug")} placeholder="event-url-slug" />
//                       {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description">Event Description *</Label>
//                     <Textarea
//                       id="description"
//                       {...register("description")}
//                       placeholder="Describe your event in detail..."
//                       rows={4}
//                     />
//                     {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Event Highlights *</Label>
//                     {highlights.map((highlight, index) => (
//                       <div key={index} className="flex gap-2">
//                         <Input
//                           value={highlight}
//                           onChange={(e) => updateHighlight(index, e.target.value)}
//                           placeholder="Enter highlight"
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="icon"
//                           onClick={() => removeHighlight(index)}
//                           disabled={highlights.length === 1}
//                         >
//                           <Minus className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     ))}
//                     <Button type="button" variant="outline" onClick={addHighlight} className="w-full">
//                       <Plus className="w-4 h-4 mr-2" />
//                       Add Highlight
//                     </Button>
//                     {errors.highlights && <p className="text-sm text-red-600">{errors.highlights.message}</p>}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="organizerId">Organizer *</Label>
//                     <Select onValueChange={(value) => setValue("organizerId", value)}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select organizer" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="67890abcdef123456789012">EventCorp India</SelectItem>
//                         <SelectItem value="67890abcdef123456789013">Mumbai Events Ltd</SelectItem>
//                         <SelectItem value="67890abcdef123456789014">Professional Expo Co</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     {errors.organizerId && <p className="text-sm text-red-600">{errors.organizerId.message}</p>}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Location */}
//             <TabsContent value="location">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Event Location</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="city">City *</Label>
//                       <Input id="city" {...register("location.city")} placeholder="Mumbai" />
//                       {errors.location?.city && <p className="text-sm text-red-600">{errors.location.city.message}</p>}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="venue">Venue *</Label>
//                       <Input id="venue" {...register("location.venue")} placeholder="Convention Center" />
//                       {errors.location?.venue && (
//                         <p className="text-sm text-red-600">{errors.location.venue.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="address">Full Address *</Label>
//                     <Textarea
//                       id="address"
//                       {...register("location.address")}
//                       placeholder="Complete venue address"
//                       rows={3}
//                     />
//                     {errors.location?.address && (
//                       <p className="text-sm text-red-600">{errors.location.address.message}</p>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="lat">Latitude</Label>
//                       <Input
//                         id="lat"
//                         type="number"
//                         step="any"
//                         {...register("location.coordinates.lat", { valueAsNumber: true })}
//                         placeholder="19.1595"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="lng">Longitude</Label>
//                       <Input
//                         id="lng"
//                         type="number"
//                         step="any"
//                         {...register("location.coordinates.lng", { valueAsNumber: true })}
//                         placeholder="72.8656"
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Timing & Pricing */}
//             <TabsContent value="timing">
//               <div className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Event Timing</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="startDate">Start Date *</Label>
//                         <Input id="startDate" type="date" {...register("timings.startDate")} />
//                         {errors.timings?.startDate && (
//                           <p className="text-sm text-red-600">{errors.timings.startDate.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="endDate">End Date *</Label>
//                         <Input id="endDate" type="date" {...register("timings.endDate")} />
//                         {errors.timings?.endDate && (
//                           <p className="text-sm text-red-600">{errors.timings.endDate.message}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="dailyStart">Daily Start Time *</Label>
//                         <Input id="dailyStart" type="time" {...register("timings.dailyStart")} />
//                         {errors.timings?.dailyStart && (
//                           <p className="text-sm text-red-600">{errors.timings.dailyStart.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="dailyEnd">Daily End Time *</Label>
//                         <Input id="dailyEnd" type="time" {...register("timings.dailyEnd")} />
//                         {errors.timings?.dailyEnd && (
//                           <p className="text-sm text-red-600">{errors.timings.dailyEnd.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="timezone">Timezone *</Label>
//                         <Select onValueChange={(value) => setValue("timings.timezone", value)} defaultValue="IST">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select timezone" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="IST">IST (Indian Standard Time)</SelectItem>
//                             <SelectItem value="UTC">UTC</SelectItem>
//                             <SelectItem value="EST">EST</SelectItem>
//                             <SelectItem value="PST">PST</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Pricing</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="currency">Currency *</Label>
//                         <Select onValueChange={(value) => setValue("pricing.currency", value)} defaultValue="₹">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Currency" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="₹">₹ (INR)</SelectItem>
//                             <SelectItem value="$">$ (USD)</SelectItem>
//                             <SelectItem value="€">€ (EUR)</SelectItem>
//                             <SelectItem value="£">£ (GBP)</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="general">General Price *</Label>
//                         <Input
//                           id="general"
//                           type="number"
//                           {...register("pricing.general", { valueAsNumber: true })}
//                           placeholder="2500"
//                         />
//                         {errors.pricing?.general && (
//                           <p className="text-sm text-red-600">{errors.pricing.general.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="student">Student Price</Label>
//                         <Input
//                           id="student"
//                           type="number"
//                           {...register("pricing.student", { valueAsNumber: true })}
//                           placeholder="1500"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="vip">VIP Price</Label>
//                         <Input
//                           id="vip"
//                           type="number"
//                           {...register("pricing.vip", { valueAsNumber: true })}
//                           placeholder="5000"
//                         />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Event Statistics</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="expectedVisitors">Expected Visitors *</Label>
//                         <Input id="expectedVisitors" {...register("stats.expectedVisitors")} placeholder="10,000+" />
//                         {errors.stats?.expectedVisitors && (
//                           <p className="text-sm text-red-600">{errors.stats.expectedVisitors.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="exhibitors">Number of Exhibitors *</Label>
//                         <Input id="exhibitors" {...register("stats.exhibitors")} placeholder="200+" />
//                         {errors.stats?.exhibitors && (
//                           <p className="text-sm text-red-600">{errors.stats.exhibitors.message}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="duration">Duration *</Label>
//                         <Input id="duration" {...register("stats.duration")} placeholder="3 Days" />
//                         {errors.stats?.duration && (
//                           <p className="text-sm text-red-600">{errors.stats.duration.message}</p>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Details */}
//             <TabsContent value="details">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Event Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="ageLimit">Age Limit *</Label>
//                       <Input id="ageLimit" {...register("ageLimit")} placeholder="18+ years" />
//                       {errors.ageLimit && <p className="text-sm text-red-600">{errors.ageLimit.message}</p>}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="dressCode">Dress Code *</Label>
//                       <Input id="dressCode" {...register("dressCode")} placeholder="Business Casual" />
//                       {errors.dressCode && <p className="text-sm text-red-600">{errors.dressCode.message}</p>}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="status">Event Status *</Label>
//                     <Select
//                       onValueChange={(value: "UPCOMING" | "ONGOING" | "COMPLETED") => setValue("status", value)}
//                       defaultValue="UPCOMING"
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="UPCOMING">Upcoming</SelectItem>
//                         <SelectItem value="ONGOING">Ongoing</SelectItem>
//                         <SelectItem value="COMPLETED">Completed</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <Label>Categories *</Label>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {watch("categories")?.map((category) => (
//                           <Badge
//                             key={category}
//                             variant="secondary"
//                             className="cursor-pointer"
//                             onClick={() => removeCategory(category)}
//                           >
//                             {category} ×
//                           </Badge>
//                         ))}
//                       </div>
//                       <div className="flex gap-2 mt-2">
//                         <Input
//                           placeholder="Add category"
//                           onKeyPress={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault()
//                               const target = e.target as HTMLInputElement
//                               if (target.value.trim()) {
//                                 addCategory(target.value.trim())
//                                 target.value = ""
//                               }
//                             }
//                           }}
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => {
//                             const input = document.querySelector(
//                               'input[placeholder="Add category"]',
//                             ) as HTMLInputElement
//                             if (input?.value.trim()) {
//                               addCategory(input.value.trim())
//                               input.value = ""
//                             }
//                           }}
//                         >
//                           Add
//                         </Button>
//                       </div>
//                     </div>

//                     <div>
//                       <Label>Tags *</Label>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {watch("tags")?.map((tag) => (
//                           <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
//                             {tag} ×
//                           </Badge>
//                         ))}
//                       </div>
//                       <div className="flex gap-2 mt-2">
//                         <Input
//                           placeholder="Add tag"
//                           onKeyPress={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault()
//                               const target = e.target as HTMLInputElement
//                               if (target.value.trim()) {
//                                 addTag(target.value.trim())
//                                 target.value = ""
//                               }
//                             }
//                           }}
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => {
//                             const input = document.querySelector('input[placeholder="Add tag"]') as HTMLInputElement
//                             if (input?.value.trim()) {
//                               addTag(input.value.trim())
//                               input.value = ""
//                             }
//                           }}
//                         >
//                           Add
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Media & Features */}
//             <TabsContent value="media">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Media & Features</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-4">
//                     <Label>Event Images</Label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                       <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//                       <p className="text-gray-600">Upload event images</p>
//                       <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
//                       <Button variant="outline" className="mt-4">
//                         Choose Files
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="text-center">
//                     <p className="text-sm text-gray-600 mb-4">
//                       Additional features like featured items, exhibitors, and tourist attractions can be added after
//                       creating the event.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>

//           {/* Form Actions */}
//           <div className="flex justify-between items-center mt-8 pt-6 border-t">
//             <Button type="button" variant="outline" onClick={() => router.back()}>
//               Cancel
//             </Button>
//             <div className="flex gap-2">
//               {currentTab !== "basic" && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     const tabs = ["basic", "location", "timing", "details", "media"]
//                     const currentIndex = tabs.indexOf(currentTab)
//                     if (currentIndex > 0) {
//                       setCurrentTab(tabs[currentIndex - 1])
//                     }
//                   }}
//                 >
//                   Previous
//                 </Button>
//               )}
//               {currentTab !== "media" ? (
//                 <Button
//                   type="button"
//                   onClick={() => {
//                     const tabs = ["basic", "location", "timing", "details", "media"]
//                     const currentIndex = tabs.indexOf(currentTab)
//                     if (currentIndex < tabs.length - 1) {
//                       setCurrentTab(tabs[currentIndex + 1])
//                     }
//                   }}
//                 >
//                   Next
//                 </Button>
//               ) : (
//                 <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700">
//                   {isSubmitting ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4 mr-2" />
//                       Create Event
//                     </>
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
