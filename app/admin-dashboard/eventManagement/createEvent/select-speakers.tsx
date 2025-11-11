// components/select-speakers.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, X, User, Mic } from "lucide-react"

interface Speaker {
  id: string
  firstName: string
  lastName: string
  email: string
  company?: string
  speakingExperience?: string
  bio?: string
}

interface SpeakerSession {
  speakerId: string
  title: string
  description: string
  sessionType: string
  duration: number
  startTime: string
  endTime: string
  room?: string
}

interface SelectSpeakersProps {
  speakerSessions: SpeakerSession[]
  onSpeakerSessionsChange: (sessions: SpeakerSession[]) => void
}

export function SelectSpeakers({ speakerSessions, onSpeakerSessionsChange }: SelectSpeakersProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSpeaker, setNewSpeaker] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    speakingExperience: "",
    bio: ""
  })
  const [newSession, setNewSession] = useState<SpeakerSession>({
    speakerId: "",
    title: "",
    description: "",
    sessionType: "PRESENTATION",
    duration: 60,
    startTime: "",
    endTime: "",
    room: ""
  })

  useEffect(() => {
    fetchSpeakers()
  }, [])

  const fetchSpeakers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users?role=SPEAKER')
      if (response.ok) {
        const data = await response.json()
        setSpeakers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching speakers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSpeakers = speakers.filter(speaker =>
    speaker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateSpeaker = async () => {
    if (!newSpeaker.firstName || !newSpeaker.lastName || !newSpeaker.email) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSpeaker,
          role: 'SPEAKER'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewSession(prev => ({ ...prev, speakerId: data.user.id }))
        setShowCreateForm(false)
        setNewSpeaker({ firstName: "", lastName: "", email: "", company: "", speakingExperience: "", bio: "" })
        fetchSpeakers() // Refresh the list
      } else {
        alert("Error creating speaker")
      }
    } catch (error) {
      console.error("Error creating speaker:", error)
      alert("Error creating speaker")
    }
  }

  const handleAddSession = () => {
    if (!newSession.speakerId || !newSession.title || !newSession.startTime || !newSession.endTime) {
      alert("Please fill in all required session fields")
      return
    }

    onSpeakerSessionsChange([...speakerSessions, newSession])
    setNewSession({
      speakerId: "",
      title: "",
      description: "",
      sessionType: "PRESENTATION",
      duration: 60,
      startTime: "",
      endTime: "",
      room: ""
    })
  }

  const handleRemoveSession = (index: number) => {
    onSpeakerSessionsChange(speakerSessions.filter((_, i) => i !== index))
  }

  const getSpeakerName = (speakerId: string) => {
    const speaker = speakers.find(s => s.id === speakerId)
    return speaker ? `${speaker.firstName} ${speaker.lastName}` : "Unknown Speaker"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Speaker Sessions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add speakers and their sessions to your event
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Session */}
        <div className="p-4 border rounded-lg space-y-4">
          <h4 className="font-medium">Add Speaker Session</h4>
          
          {/* Speaker Selection */}
          <div className="space-y-3">
            <Label>Select Speaker *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search speakers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Speaker
              </Button>
            </div>

            {!showCreateForm && (
              <Select 
                value={newSession.speakerId} 
                onValueChange={(value) => setNewSession(prev => ({ ...prev, speakerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a speaker" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : filteredSpeakers.length === 0 ? (
                    <SelectItem value="no-results" disabled>No speakers found</SelectItem>
                  ) : (
                    filteredSpeakers.map((speaker) => (
                      <SelectItem key={speaker.id} value={speaker.id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">
                              {speaker.firstName} {speaker.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {speaker.company} • {speaker.email}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}

            {/* Create New Speaker Form */}
            {showCreateForm && (
              <div className="p-4 border rounded-lg space-y-4">
                <h5 className="font-medium">Create New Speaker</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="speakerFirstName">First Name *</Label>
                    <Input
                      id="speakerFirstName"
                      value={newSpeaker.firstName}
                      onChange={(e) => setNewSpeaker(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="speakerLastName">Last Name *</Label>
                    <Input
                      id="speakerLastName"
                      value={newSpeaker.lastName}
                      onChange={(e) => setNewSpeaker(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Doe"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="speakerEmail">Email *</Label>
                    <Input
                      id="speakerEmail"
                      type="email"
                      value={newSpeaker.email}
                      onChange={(e) => setNewSpeaker(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="speakerCompany">Company</Label>
                    <Input
                      id="speakerCompany"
                      value={newSpeaker.company}
                      onChange={(e) => setNewSpeaker(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Tech Corp"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="speakerExperience">Speaking Experience</Label>
                    <Input
                      id="speakerExperience"
                      value={newSpeaker.speakingExperience}
                      onChange={(e) => setNewSpeaker(prev => ({ ...prev, speakingExperience: e.target.value }))}
                      placeholder="5+ years in industry conferences"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="speakerBio">Bio</Label>
                    <Textarea
                      id="speakerBio"
                      value={newSpeaker.bio}
                      onChange={(e) => setNewSpeaker(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Brief biography of the speaker..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateSpeaker}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Speaker
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Session Details */}
          {newSession.speakerId && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="sessionTitle">Session Title *</Label>
                <Input
                  id="sessionTitle"
                  value={newSession.title}
                  onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Introduction to AI and Machine Learning"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="sessionDescription">Description</Label>
                <Textarea
                  id="sessionDescription"
                  value={newSession.description}
                  onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Session description..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="sessionType">Session Type</Label>
                <Select 
                  value={newSession.sessionType} 
                  onValueChange={(value) => setNewSession(prev => ({ ...prev, sessionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KEYNOTE">Keynote</SelectItem>
                    <SelectItem value="PRESENTATION">Presentation</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="PANEL">Panel Discussion</SelectItem>
                    <SelectItem value="ROUNDTABLE">Roundtable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sessionDuration">Duration (minutes)</Label>
                <Input
                  id="sessionDuration"
                  type="number"
                  value={newSession.duration}
                  onChange={(e) => setNewSession(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  placeholder="60"
                />
              </div>
              <div>
                <Label htmlFor="sessionStart">Start Time *</Label>
                <Input
                  id="sessionStart"
                  type="datetime-local"
                  value={newSession.startTime}
                  onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="sessionEnd">End Time *</Label>
                <Input
                  id="sessionEnd"
                  type="datetime-local"
                  value={newSession.endTime}
                  onChange={(e) => setNewSession(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="sessionRoom">Room/Location</Label>
                <Input
                  id="sessionRoom"
                  value={newSession.room}
                  onChange={(e) => setNewSession(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="Main Hall, Room A, etc."
                />
              </div>
            </div>
          )}

          <Button onClick={handleAddSession} disabled={!newSession.speakerId}>
            <Plus className="w-4 h-4 mr-2" />
            Add Session
          </Button>
        </div>

        {/* Current Sessions */}
        {speakerSessions.length > 0 && (
          <div className="space-y-3">
            <Label>Current Sessions ({speakerSessions.length})</Label>
            {speakerSessions.map((session, index) => (
              <div key={index} className="p-3 border rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{session.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {getSpeakerName(session.speakerId)} • {session.sessionType} • {session.duration}min
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}
                    {session.room && ` • ${session.room}`}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveSession(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}