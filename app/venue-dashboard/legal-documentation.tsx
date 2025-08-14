"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
} from "lucide-react"

export default function LegalDocumentation() {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)

  // Mock documents data
  const standardDocuments = [
    {
      id: 1,
      name: "Standard Venue Terms & Conditions",
      type: "Terms & Conditions",
      version: "v2.1",
      lastUpdated: "2025-01-15",
      status: "Active",
      description:
        "Standard terms and conditions for venue bookings including cancellation policy, payment terms, and liability clauses.",
      fileSize: "2.3 MB",
      downloadCount: 156,
    },
    {
      id: 2,
      name: "Event Booking Agreement Template",
      type: "Contract Template",
      version: "v1.8",
      lastUpdated: "2025-01-10",
      status: "Active",
      description: "Standard booking agreement template with customizable fields for different event types.",
      fileSize: "1.9 MB",
      downloadCount: 89,
    },
    {
      id: 3,
      name: "Liability Waiver Form",
      type: "Waiver",
      version: "v1.2",
      lastUpdated: "2024-12-20",
      status: "Active",
      description: "Liability waiver form for event organizers and attendees.",
      fileSize: "0.8 MB",
      downloadCount: 234,
    },
    {
      id: 4,
      name: "Catering Service Agreement",
      type: "Service Agreement",
      version: "v1.5",
      lastUpdated: "2024-12-15",
      status: "Active",
      description: "Agreement template for catering services provided at the venue.",
      fileSize: "1.4 MB",
      downloadCount: 67,
    },
  ]

  const eventContracts = [
    {
      id: 1,
      eventName: "Global Tech Conference 2025",
      organizer: "TechEvents India",
      contractType: "Event Booking Agreement",
      signedDate: "2025-01-20",
      eventDate: "2025-03-15",
      status: "Signed",
      value: "₹12,00,000",
      documents: [
        { name: "Main Contract", type: "PDF", size: "2.1 MB" },
        { name: "Addendum - AV Services", type: "PDF", size: "0.5 MB" },
      ],
    },
    {
      id: 2,
      eventName: "Healthcare Innovation Summit",
      organizer: "MedTech Solutions",
      contractType: "Event Booking Agreement",
      signedDate: "2025-01-18",
      eventDate: "2025-04-22",
      status: "Signed",
      value: "₹9,50,000",
      documents: [
        { name: "Main Contract", type: "PDF", size: "1.8 MB" },
        { name: "Catering Agreement", type: "PDF", size: "0.7 MB" },
      ],
    },
    {
      id: 3,
      eventName: "Digital Marketing Summit 2025",
      organizer: "Marketing Pro Events",
      contractType: "Event Booking Agreement",
      signedDate: null,
      eventDate: "2025-05-15",
      status: "Pending Signature",
      value: "₹8,50,000",
      documents: [{ name: "Draft Contract", type: "PDF", size: "2.0 MB" }],
    },
  ]

  const complianceDocuments = [
    {
      id: 1,
      name: "Fire Safety Certificate",
      type: "Safety Certificate",
      issueDate: "2024-06-15",
      expiryDate: "2025-06-15",
      status: "Valid",
      issuingAuthority: "Mumbai Fire Department",
      certificateNumber: "MFD-2024-1234",
    },
    {
      id: 2,
      name: "Building Occupancy Certificate",
      type: "Occupancy Certificate",
      issueDate: "2023-12-10",
      expiryDate: "2028-12-10",
      status: "Valid",
      issuingAuthority: "Municipal Corporation",
      certificateNumber: "MC-OC-2023-5678",
    },
    {
      id: 3,
      name: "Food Safety License",
      type: "Food License",
      issueDate: "2024-04-01",
      expiryDate: "2025-03-31",
      status: "Expiring Soon",
      issuingAuthority: "Food Safety Department",
      certificateNumber: "FSD-2024-9012",
    },
    {
      id: 4,
      name: "Entertainment License",
      type: "Entertainment License",
      issueDate: "2024-01-15",
      expiryDate: "2024-12-31",
      status: "Expired",
      issuingAuthority: "Police Department",
      certificateNumber: "PD-ENT-2024-3456",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Valid":
      case "Signed":
        return "bg-green-500"
      case "Pending Signature":
      case "Expiring Soon":
        return "bg-yellow-500"
      case "Expired":
      case "Inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
      case "Valid":
      case "Signed":
        return <CheckCircle className="w-4 h-4" />
      case "Pending Signature":
      case "Expiring Soon":
        return <Clock className="w-4 h-4" />
      case "Expired":
      case "Inactive":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const DocumentCard = ({ document, type = "standard" }: { document: any; type?: string }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{document.name || document.eventName}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {type === "standard" && (
                <>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Type: {document.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last Updated: {document.lastUpdated}
                  </div>
                  <div>Version: {document.version}</div>
                  <div>Downloads: {document.downloadCount}</div>
                </>
              )}
              {type === "contract" && (
                <>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Organizer: {document.organizer}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Event Date: {document.eventDate}
                  </div>
                  {document.signedDate && <div>Signed: {document.signedDate}</div>}
                  <div>Value: {document.value}</div>
                </>
              )}
              {type === "compliance" && (
                <>
                  <div>Issuing Authority: {document.issuingAuthority}</div>
                  <div>Certificate No: {document.certificateNumber}</div>
                  <div>Issue Date: {document.issueDate}</div>
                  <div>Expiry Date: {document.expiryDate}</div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStatusColor(document.status)}>
              {getStatusIcon(document.status)}
              <span className="ml-1">{document.status}</span>
            </Badge>
            {document.fileSize && <Badge variant="outline">{document.fileSize}</Badge>}
          </div>
        </div>

        {document.description && <p className="text-sm text-gray-700 mb-4">{document.description}</p>}

        {type === "contract" && document.documents && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Documents:</h4>
            <div className="space-y-1">
              {document.documents.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span>{doc.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {doc.size}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setSelectedDocument(document)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{document.name || document.eventName}</DialogTitle>
              </DialogHeader>
              {selectedDocument && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <p className="text-gray-600">{selectedDocument.type || selectedDocument.contractType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <p className="text-gray-600">{selectedDocument.status}</p>
                    </div>
                  </div>
                  {selectedDocument.description && (
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-gray-600">{selectedDocument.description}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          {type === "standard" && (
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Legal & Documentation</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{standardDocuments.length}</div>
            <div className="text-gray-600">Standard Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {eventContracts.filter((c) => c.status === "Signed").length}
            </div>
            <div className="text-gray-600">Signed Contracts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {complianceDocuments.filter((c) => c.status === "Expiring Soon").length}
            </div>
            <div className="text-gray-600">Expiring Soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {complianceDocuments.filter((c) => c.status === "Expired").length}
            </div>
            <div className="text-gray-600">Expired</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="standard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="standard">Standard Documents</TabsTrigger>
          <TabsTrigger value="contracts">Event Contracts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance & Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Standard Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Document Name" />
                <Input placeholder="Document Type" />
              </div>
              <Textarea placeholder="Document Description" rows={3} />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {standardDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} type="standard" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="space-y-4">
            {eventContracts.map((contract) => (
              <DocumentCard key={contract.id} document={contract} type="contract" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Compliance Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {complianceDocuments.filter((c) => c.status === "Valid").length}
                  </div>
                  <div className="text-sm text-green-700">Valid Certificates</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {complianceDocuments.filter((c) => c.status === "Expiring Soon").length}
                  </div>
                  <div className="text-sm text-yellow-700">Expiring Soon</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {complianceDocuments.filter((c) => c.status === "Expired").length}
                  </div>
                  <div className="text-sm text-red-700">Expired</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {complianceDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} type="compliance" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
