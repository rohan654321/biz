"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react"
import SubAdminAddPage from "./subadmin-management"
import { toast } from "sonner"

interface SubAdmin {
  id: string
  name: string
  email: string
  phone?: string
  permissions: string[]
  isActive: boolean
  lastLogin?: string
  createdAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
}

export default function SuperAdminManagement() {
  const [showAddPage, setShowAddPage] = useState(false)
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubAdmins = async () => {
    try {
      const response = await fetch('/api/sub-admins')
      if (!response.ok) throw new Error('Failed to fetch sub-admins')
      
      const data = await response.json()
      setSubAdmins(data.subAdmins)
    } catch (error) {
      console.error('Error fetching sub-admins:', error)
      toast.error('Failed to load sub-admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubAdmins()
  }, [])

  const handleDeleteSubAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sub-admin?')) return

    try {
      const response = await fetch(`/api/sub-admins/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete sub-admin')

      toast.success('Sub-admin deleted successfully')
      fetchSubAdmins() // Refresh the list
    } catch (error) {
      console.error('Error deleting sub-admin:', error)
      toast.error('Failed to delete sub-admin')
    }
  }

  const handleAddSuccess = () => {
    setShowAddPage(false)
    fetchSubAdmins() // Refresh the list
    toast.success('Sub-admin created successfully')
  }

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
          <SubAdminAddPage onSuccess={handleAddSuccess} onCancel={() => setShowAddPage(false)} />
        </div>
      </div>
    )
  }

  // Default Sub Admin Table View
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative flex items-center justify-center w-full">
          <div className="w-full h-[4px] rounded-full bg-gradient-to-r from-green-300 to-blue-500" />
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
        <Card>
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
                  <TableHead className="font-semibold text-gray-900 py-3">Email</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3">Phone</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3">Permissions</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 text-center">Edit</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 text-center">Delete</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-3 text-center">View Log</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : subAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No sub-admins found
                    </TableCell>
                  </TableRow>
                ) : (
                  subAdmins.map((subAdmin, index) => (
                    <TableRow key={subAdmin.id} className="border-b hover:bg-gray-50">
                      <TableCell className="py-3 font-medium">{index + 1}</TableCell>
                      <TableCell className="py-3 font-medium">{subAdmin.name}</TableCell>
                      <TableCell className="py-3">{subAdmin.email}</TableCell>
                      <TableCell className="py-3">{subAdmin.phone || 'N/A'}</TableCell>
                      <TableCell className="py-3">
                        <div className="max-w-xs truncate" title={subAdmin.permissions.join(', ')}>
                          {subAdmin.permissions.length} permissions
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subAdmin.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subAdmin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteSubAdmin(subAdmin.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}