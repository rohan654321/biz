"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react"
import SubAdminAddPage from "./subadmin-management"

export default function SuperAdminManagement() {
  const [showAddPage, setShowAddPage] = useState(false)

  const [subAdmins] = useState([
    {
      id: "1",
      name: "Delanook",
      userName: "Satoook",
      password: "……….",
    },
  ])

  // If Add Page is open, show it instead of table
  if (showAddPage) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Add New Sub Admin</h1>
            <Button
              onClick={() => setShowAddPage(false)}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <SubAdminAddPage />
        </div>
      </div>
    )
  }

  // Default Sub Admin Table View
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
            <div className="relative flex items-center justify-center w-full">
      {/* Gradient line */}
      <div className="w-full h-[4px] rounded-full bg-gradient-to-r from-green-300 to-blue-500" />
      
      {/* Center label */}
      <div className="absolute bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded">
        SUB ADMINS
      </div>
    </div>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SUB ADMINS</h1>
          </div>

          <Button
            onClick={() => setShowAddPage(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Sub Admin
          </Button>
        </div>

        {/* Table Card */}
        <div className="">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">All Sub Admins</CardTitle>
            <CardDescription>View and manage all sub-administrator accounts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b">
                  <TableHead className="font-semibold text-gray-900 py-3">No</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3">User</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3">User Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3">Password</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 text-center">Edit</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 text-center">Delete</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 text-center">View Log</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subAdmins.map((subAdmin, index) => (
                  <TableRow key={subAdmin.id} className="border-b hover:bg-gray-50">
                    <TableCell className="py-3 font-medium">{index + 1}</TableCell>
                    <TableCell className="py-3 font-medium">{subAdmin.name}</TableCell>
                    <TableCell className="py-3">{subAdmin.userName}</TableCell>
                    <TableCell className="py-3">{subAdmin.password}</TableCell>

                    <TableCell className="py-3 text-center">
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>

                    <TableCell className="py-3 text-center">
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>

                    <TableCell className="py-3 text-center">
                      <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </div>
      </div>
    </div>
  )
}
