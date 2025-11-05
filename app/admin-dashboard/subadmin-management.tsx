"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function SubAdminAddPage() {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

    const handleToggle = (perm: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        )
    }

    const permissionCategories = [
        [
            "Dashboard Overview",
            "Events Management",
            "Organizer Management",
            "Exhibitor Management",
            "Speaker Management",
        ],
        [
            "Venue Management",
            "Visitor Management",
            "Financial & Transactions",
            "Content Management",
            "Marketing & Communication",
        ],
        [
            "Reports & Analytics",
            "Integrations",
            "User Roles & Permissions",
            "Settings & Configuration",
            "Help & Support",
        ],
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative flex items-center justify-center w-full mb-6">
                    {/* Gradient line */}
                    <div className="w-full h-[4px] rounded-full bg-gradient-to-r from-green-300 to-blue-500" />

                    {/* Centered button */}
                    <div className="absolute">
                        <div className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-md shadow">
                            ADD NEW SUB ADMIN
                        </div>
                    </div>
                </div>


                <div>
                    <CardHeader>
                        <CardTitle className="text-gray-800 pb-5">Sub admin details</CardTitle>
                    </CardHeader>
                    <hr></hr>
                    <CardContent className="space-y-5">
                        {/* Form Inputs */}
                        <div className="space-y-4 pt-3">
                            {/* Sub admin name */}
                            <div className="grid grid-cols-12 items-center gap-3">
                                <Label className="col-span-2 text-gray-700 font-medium">
                                    Sub admin name
                                </Label>

                                <Input className="col-span-9" placeholder="Name" />
                            </div>
                            <hr></hr>
                            {/* User name */}

                            <div className="grid grid-cols-12 items-center gap-3">
                                <Label className="col-span-2 text-gray-700 font-medium">
                                    User name
                                </Label>
                                <Input className="col-span-9" placeholder="Enter user name" />
                            </div>
                            <hr></hr>
                            {/* Password */}
                            <div className="grid grid-cols-12 items-center gap-3">
                                <Label className="col-span-2 text-gray-700 font-medium">Password</Label>
                                <Input
                                    className="col-span-9"
                                    type="password"
                                    placeholder="Enter password"
                                />
                            </div>
                            <hr></hr>
                            {/* Profile picture */}
                            <div className="grid grid-cols-12 items-center gap-3">
                                <Label className="col-span-2 text-gray-700 font-medium">
                                    Profile picture
                                </Label>
                                <Input className="col-span-9" type="file" />
                            </div>
                        </div>
                        <hr></hr>

                        {/* Permissions */}
                        <div>
                            <Label className="block mb-3 font-medium text-gray-700">
                                Credentials
                            </Label>

                            <div className="grid md:grid-cols-3 gap-6">
                                {permissionCategories.map((group, groupIndex) => (
                                    <div key={groupIndex} className="space-y-3">
                                        {group.map((perm) => (
                                            <div
                                                key={perm}
                                                className="flex items-center space-x-2 last:border-none pb-2"
                                            >
                                                <Checkbox
                                                    id={perm}
                                                    checked={selectedPermissions.includes(perm)}
                                                    onCheckedChange={() => handleToggle(perm)}
                                                    className={`transition-colors duration-200 
    ${selectedPermissions.includes(perm)
                                                            ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                                            : "bg-white border-gray-300"
                                                        }`}
                                                />

                                                <Label htmlFor={perm} className="text-gray-700">
                                                    {perm}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add User Button */}
                        <div className="flex justify-start">
                            <Button className="bg-green-500 hover:bg-green-600 text-white">
                                Add User
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </div>
        </div>
    )
}
