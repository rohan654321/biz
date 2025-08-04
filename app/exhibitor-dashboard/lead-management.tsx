"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Download, Search, Phone, Mail, MessageSquare, Calendar, Eye, Edit } from "lucide-react"

export default function LeadManagement() {
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock leads data
  const leads = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@techsolutions.com",
      phone: "+91 98765 43210",
      company: "Tech Solutions Pvt Ltd",
      query: "Interested in AI-powered analytics platform for our enterprise needs. Need pricing and demo.",
      source: "Global Tech Expo 2025",
      timestamp: "2025-01-15 14:30",
      status: "New",
      priority: "High",
      notes: "",
      followUpDate: null,
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@innovate.in",
      phone: "+91 87654 32109",
      company: "Innovate India",
      query: "Looking for cloud security solutions for our startup. Budget around 5L annually.",
      source: "Healthcare Innovation Summit",
      timestamp: "2025-01-14 11:15",
      status: "Contacted",
      priority: "Medium",
      notes: "Sent initial proposal. Waiting for response.",
      followUpDate: "2025-01-20",
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit@manufacturing.co",
      phone: "+91 76543 21098",
      company: "Manufacturing Co",
      query: "Need mobile app development for inventory management. Timeline 3-4 months.",
      source: "Global Tech Expo 2025",
      timestamp: "2025-01-13 16:45",
      status: "Qualified",
      priority: "High",
      notes: "Very interested. Scheduled demo for next week.",
      followUpDate: "2025-01-18",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha@retail.com",
      phone: "+91 65432 10987",
      company: "Retail Solutions",
      query: "Exploring analytics solutions for retail business. Small scale implementation.",
      source: "AI & ML Conference",
      timestamp: "2025-01-12 09:20",
      status: "Not Interested",
      priority: "Low",
      notes: "Budget constraints. May revisit in Q3.",
      followUpDate: null,
    },
  ]

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = filterStatus === "all" || lead.status.toLowerCase().replace(" ", "-") === filterStatus
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500"
      case "Contacted":
        return "bg-yellow-500"
      case "Qualified":
        return "bg-green-500"
      case "Not Interested":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const LeadCard = ({ lead }: { lead: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{lead.name}</h3>
              <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
              <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                {lead.priority}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {lead.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {lead.phone}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {lead.timestamp} • {lead.source}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Lead Details - {lead.name}</DialogTitle>
                </DialogHeader>
                {selectedLead && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <p className="text-gray-600">{selectedLead.company}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Source</label>
                        <p className="text-gray-600">{selectedLead.source}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Query</label>
                      <p className="text-gray-600 mt-1">{selectedLead.query}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Internal Notes</label>
                      <Textarea value={selectedLead.notes} placeholder="Add your notes here..." className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select value={selectedLead.status}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Not Interested">Not Interested</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Follow-up Date</label>
                        <Input type="date" value={selectedLead.followUpDate || ""} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 font-medium mb-1">{lead.company}</p>
          <p className="text-sm text-gray-600">{lead.query}</p>
        </div>

        {lead.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{lead.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {lead.followUpDate && (
              <Badge variant="outline" className="text-blue-600">
                Follow-up: {lead.followUpDate}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export to Excel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{leads.length}</div>
            <div className="text-gray-600">Total Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {leads.filter((l) => l.status === "Qualified").length}
            </div>
            <div className="text-gray-600">Qualified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {leads.filter((l) => l.status === "Contacted").length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round((leads.filter((l) => l.status === "Qualified").length / leads.length) * 100)}%
            </div>
            <div className="text-gray-600">Conversion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search leads by name, company, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="not-interested">Not Interested</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No leads found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
