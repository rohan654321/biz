"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Video, ImageIcon, Download, Trash2, Eye, AlertCircle, Calendar } from "lucide-react"

export function PresentationMaterials() {
  const [dragActive, setDragActive] = useState(false)

  const materials = [
    {
      id: 1,
      sessionTitle: "The Future of Cloud Architecture",
      eventName: "TechConf 2024",
      files: [
        {
          id: 1,
          name: "Cloud_Architecture_Keynote.pptx",
          type: "presentation",
          size: "15.2 MB",
          uploadDate: "2024-02-15",
          status: "final",
          allowDownload: true,
          deadline: "2024-03-10",
        },
        {
          id: 2,
          name: "Demo_Video.mp4",
          type: "video",
          size: "45.8 MB",
          uploadDate: "2024-02-18",
          status: "draft",
          allowDownload: false,
          deadline: "2024-03-10",
        },
      ],
    },
    {
      id: 2,
      sessionTitle: "Machine Learning in Production",
      eventName: "AI Summit 2024",
      files: [
        {
          id: 3,
          name: "ML_Production_Workshop.pdf",
          type: "document",
          size: "8.5 MB",
          uploadDate: "2024-02-20",
          status: "draft",
          allowDownload: true,
          deadline: "2024-03-18",
        },
      ],
    },
    {
      id: 3,
      sessionTitle: "Scaling DevOps Culture",
      eventName: "DevOps Days",
      files: [],
      deadline: "2024-04-01",
    },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "presentation":
        return <FileText className="h-8 w-8 text-orange-500" />
      case "video":
        return <Video className="h-8 w-8 text-purple-500" />
      case "document":
        return <FileText className="h-8 w-8 text-blue-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-green-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "final":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    // Handle file upload logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Presentation Materials</h2>
        <Button className="flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Upload Files</span>
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Presentation Materials</h3>
            <p className="text-gray-600 mb-4">Drag and drop your files here, or click to browse</p>
            <p className="text-sm text-gray-500">Supported formats: PPT, PPTX, PDF, MP4, MOV, DOC, DOCX (Max 100MB)</p>
            <Button variant="outline" className="mt-4 bg-transparent">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions with Materials */}
      <div className="space-y-6">
        {materials.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{session.sessionTitle}</CardTitle>
                  <p className="text-blue-600 font-medium">{session.eventName}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {/* <span>Deadline: {new Date(session.deadline).toLocaleDateString()}</span> */}
                  </div>
                  {/* {getDaysUntilDeadline(session.deadline) <= 7 && (
                    <div className="flex items-center space-x-1 text-orange-600 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{getDaysUntilDeadline(session.deadline)} days left</span>
                    </div>
                  )} */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.files.length > 0 ? (
                <div className="space-y-3">
                  {session.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getFileIcon(file.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{file.size}</span>
                            <span>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</span>
                            <Badge className={getStatusColor(file.status)}>{file.status.toUpperCase()}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`download-${file.id}`} className="text-sm">
                            Allow Download
                          </Label>
                          <Switch id={`download-${file.id}`} checked={file.allowDownload} />
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No materials uploaded yet</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Upload Materials
                  </Button>
                </div>
              )}

              {/* Progress Bar for Deadline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Upload Progress</span>
                  <span className="text-gray-600">
                    {session.files.length > 0 ? "Materials uploaded" : "No materials"}
                  </span>
                </div>
                <Progress value={session.files.length > 0 ? 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
