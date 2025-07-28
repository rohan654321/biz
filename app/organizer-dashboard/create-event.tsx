"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateEvent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input id="event-title" placeholder="Enter event title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your event" rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" placeholder="Event venue" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="general-price">General Ticket Price</Label>
              <Input id="general-price" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vip-price">VIP Ticket Price</Label>
              <Input id="vip-price" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-price">Student Ticket Price</Label>
              <Input id="student-price" type="number" placeholder="0" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="bg-transparent">
              Save as Draft
            </Button>
            <Button>Publish Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
