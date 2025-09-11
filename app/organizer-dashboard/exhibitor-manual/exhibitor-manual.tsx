"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, FileText, Calendar, MapPin, Settings, AlertTriangle } from "lucide-react"
import { ContractorRegistrationForm } from "./forms/contractor-registration-form"
import { ContractorSecurityDepositForm } from "./forms/contractor-security-deposit-form"
import { NameOnFasciaForm } from "./forms/name-on-fascia-form"
import { MachinesDisplayForm } from "./forms/machines-display-form"
import { ExhibitorGuideDataForm } from "./forms/exhibitor-guide-data-form"
import { ExhibitorPassesForm } from "./forms/exhibitor-passes-form"
import { ElectricalRequirementForm } from "./forms/electrical-requirement-form"
import { AdditionalFurnitureForm } from "./forms/additional-furniture-form"
import { TemporaryStaffForm } from "./forms/temporary-staff-form"
import { CompressedAirWaterForm } from "./forms/compressed-air-water-form"
import { SecurityForm } from "./forms/security-form"
import { AudioVisualForm } from "./forms/audio-visual-form"
import { HousekeepingForm } from "./forms/housekeeping-form"
import { CustomFormBuilder } from "./custom-form-builder"

interface Event {
  id: string
  name: string
  venue: string
  startDate: string
  endDate: string
  description: string
}

interface ExhibitorManualProfessionalProps {
  organizerId: string
}

export function ExhibitorManualProfessional({ organizerId }: ExhibitorManualProfessionalProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchEvents()
  }, [organizerId])

 const fetchEvents = async () => {
  try {
    const response = await fetch(`/api/organizers/${organizerId}/events`)
    if (response.ok) {
      const data = await response.json()
      const eventsArray = Array.isArray(data) ? data : data.events ?? []  // 👈 normalize
      setEvents(eventsArray)
      if (eventsArray.length > 0) {
        setSelectedEventId(eventsArray[0].id)
      }
    }
  } catch (error) {
    console.error("Error fetching events:", error)
  } finally {
    setLoading(false)
  }
}


  const selectedEvent = events.find((event) => event.id === selectedEventId)

  const mandatoryForms = [
    { id: "form1", title: "Registration of Contractor", component: ContractorRegistrationForm, deadline: "07.11.2025" },
    {
      id: "form2",
      title: "Contractor Security Deposit",
      component: ContractorSecurityDepositForm,
      deadline: "07.11.2025",
    },
    { id: "form3", title: "Name on Fascia", component: NameOnFasciaForm, deadline: "07.11.2025" },
    {
      id: "form4",
      title: "Machines / Products to be Displayed",
      component: MachinesDisplayForm,
      deadline: "07.11.2025",
    },
    { id: "form5", title: "Data for Exhibitor Guide", component: ExhibitorGuideDataForm, deadline: "07.11.2025" },
    { id: "form6", title: "Exhibitor Passes", component: ExhibitorPassesForm, deadline: "07.11.2025" },
    { id: "form7", title: "Electrical Requirement", component: ElectricalRequirementForm, deadline: "07.11.2025" },
  ]

  const additionalForms = [
    { id: "form8", title: "Additional Furniture", component: AdditionalFurnitureForm, deadline: "07.11.2025" },
    { id: "form9", title: "Temporary Staff (Hostess)", component: TemporaryStaffForm, deadline: "07.11.2025" },
    { id: "form10", title: "Compressed Air & Water", component: CompressedAirWaterForm, deadline: "07.11.2025" },
    { id: "form11", title: "Security for your Stall", component: SecurityForm, deadline: "07.11.2025" },
    { id: "form12", title: "Audio Visual Equipment", component: AudioVisualForm, deadline: "07.11.2025" },
    { id: "form13", title: "Housekeeping", component: HousekeepingForm, deadline: "07.11.2025" },
  ]

  const generateManualPDF = async () => {
    if (!selectedEventId) return

    try {
      const response = await fetch(`/api/events/${selectedEventId}/exhibitor-manual/pdf`, {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${selectedEvent?.name || "Event"}-Exhibitor-Manual.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Exhibitor's Manual</h1>
            <p className="text-blue-100 text-lg">Professional Event Management System</p>
          </div>
          <div className="text-right">
            <FileText className="h-16 w-16 text-blue-200 mb-2" />
            <p className="text-sm text-blue-200">Organized by</p>
          </div>
        </div>
      </div>

      {/* Event Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{event.name}</span>
                      <span className="text-sm text-gray-500">
                        {event.venue} • {new Date(event.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedEventId && (
              <Button onClick={generateManualPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Manual PDF
              </Button>
            )}
          </div>

          {selectedEvent && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">{selectedEvent.name}</h3>
                  <p className="text-blue-700">{selectedEvent.venue}</p>
                  <p className="text-sm text-blue-600">
                    {new Date(selectedEvent.startDate).toLocaleDateString()} -{" "}
                    {new Date(selectedEvent.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedEventId && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mandatory">Mandatory Forms</TabsTrigger>
            <TabsTrigger value="additional">Additional Forms</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="custom">Custom Forms</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Mandatory Forms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">7 forms required for all exhibitors</p>
                  <Badge variant="destructive" className="mb-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Deadline: 07.11.2025
                  </Badge>
                  <p className="text-sm text-gray-500">Forms 1-7 must be completed and submitted by all exhibitors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Plus className="h-5 w-5 text-green-600" />
                    Additional Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">6 optional service forms</p>
                  <Badge variant="secondary" className="mb-2">
                    Optional Services
                  </Badge>
                  <p className="text-sm text-gray-500">Furniture, staff, security, and other additional requirements</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5 text-purple-600" />
                    Custom Forms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Create custom forms for specific needs</p>
                  <Badge variant="outline" className="mb-2">
                    Organizer Tool
                  </Badge>
                  <p className="text-sm text-gray-500">Build custom forms with dynamic fields and requirements</p>
                </CardContent>
              </Card>
            </div>

            {/* Welcome Message */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome Message</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  It is with great pleasure that we extend to you a very warm welcome to{" "}
                  <strong>{selectedEvent?.name}</strong>. We have taken special efforts to bring innovation and fresh
                  ideas into this edition, ensuring that we consistently stay ahead and deliver an exhibition experience
                  that not only meets but often exceeds your expectations.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  The Exhibitor Manual is designed to guide you in preparing effectively for the show. Please ensure
                  that all mandatory forms are duly filled and submitted to us on or before the specified deadline.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mandatory Forms Tab */}
          <TabsContent value="mandatory" className="space-y-6">
            <div className="grid gap-6">
              {mandatoryForms.map((form) => {
                const FormComponent = form.component
                return (
                  <Card key={form.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-red-600" />
                          {form.title}
                        </CardTitle>
                        <Badge variant="destructive">Deadline: {form.deadline}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <FormComponent eventId={selectedEventId} organizerId={organizerId} />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Additional Forms Tab */}
          <TabsContent value="additional" className="space-y-6">
            <div className="grid gap-6">
              {additionalForms.map((form) => {
                const FormComponent = form.component
                return (
                  <Card key={form.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Plus className="h-5 w-5 text-blue-600" />
                          {form.title}
                        </CardTitle>
                        <Badge variant="secondary">Optional - Deadline: {form.deadline}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <FormComponent eventId={selectedEventId} organizerId={organizerId} />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Guidelines Tab */}
          <TabsContent value="guidelines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exhibitor Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Construction Guidelines</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>All construction work must be finished by the specified deadline</li>
                      <li>Maximum allowable height for fabricated booths is 4 meters</li>
                      <li>All structures must be self-supporting and secure</li>
                      <li>Fire extinguishers required for booths ≥36 square meters</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Personal Protective Equipment mandatory during setup/dismantling</li>
                      <li>No flammable materials or substances producing toxic gases</li>
                      <li>Emergency exits and aisles must remain clear at all times</li>
                      <li>Smoking strictly prohibited within the venue</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Electrical Guidelines</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>All electrical work must be done by licensed electricians</li>
                      <li>Only ISI-marked materials to be used</li>
                      <li>LED lights mandatory, halogen lights require transformers</li>
                      <li>All connections must use appropriate industrial standard connectors</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Forms Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Custom Form Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomFormBuilder eventId={selectedEventId} organizerId={organizerId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
