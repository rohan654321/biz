"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronRight } from "lucide-react"

export default function SubAdminAddPage() {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])

    const handleToggle = (perm: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        )
    }

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId) 
                ? prev.filter((id) => id !== categoryId) 
                : [...prev, categoryId]
        )
    }

    const permissionCategories = [
        {
            title: "Dashboard Overview",
            id: "dashboard",
            subItems: [
                { title: "Dashboard Overview", id: "dashboard-overview" },
            ]
        },
        {
            title: "Events Management",
            id: "events",
            subItems: [
                { title: "All Events", id: "events-all" },
                { title: "Create New Event", id: "events-create" },
                { title: "Event Categories", id: "events-categories" },
                { title: "Event Approvals", id: "events-approvals" },
            ]
        },
        {
            title: "Organizer Management",
            id: "organizers",
            subItems: [
                { title: "All Organizers", id: "organizers-all" },
                { title: "Add Organizer", id: "organizers-add" },
                { title: "Connections", id: "organizers-connections" },
                { title: "Messages", id: "organizers-messages" },
                { title: "Venue Bookings", id: "organizers-bookings" },
                { title: "Event Feedback", id: "organizers-feedback" },
            ]
        },
        {
            title: "Exhibitor Management",
            id: "exhibitors",
            subItems: [
                { title: "All Exhibitors", id: "exhibitors-all" },
                { title: "Add Exhibitor", id: "exhibitors-add" },
                { title: "Events Participating", id: "exhibitors-events" },
                { title: "Promotions", id: "exhibitors-promotions" },
                { title: "Followers", id: "exhibitors-followers" },
                { title: "Messages", id: "exhibitors-messages" },
                { title: "Connections", id: "exhibitors-connections" },
                { title: "Appointments", id: "exhibitors-appointments" },
                { title: "Feedback", id: "exhibitors-feedback" },
            ]
        },
        {
            title: "Speaker Management",
            id: "speakers",
            subItems: [
                { title: "All Speakers", id: "speakers-all" },
                { title: "Add Speaker", id: "speakers-add" },
                { title: "Followers", id: "speakers-followers" },
                { title: "Messages", id: "speakers-messages" },
                { title: "Connections", id: "speakers-connections" },
                { title: "Appointments", id: "speakers-appointments" },
                { title: "Feedback", id: "speakers-feedback" },
            ]
        },
        {
            title: "Venue Management",
            id: "venues",
            subItems: [
                { title: "All Venues", id: "venues-all" },
                { title: "Add Venue", id: "venues-add" },
                { title: "Events by Venue", id: "venues-events" },
                { title: "Booking Enquiries", id: "venues-bookings" },
                { title: "Followers", id: "venues-followers" },
                { title: "Feedback", id: "venues-feedback" },
            ]
        },
        {
            title: "Visitor Management",
            id: "visitors",
            subItems: [
                { title: "All Visitors", id: "visitors-all" },
                { title: "Events by Visitor", id: "visitors-events" },
                { title: "Connections", id: "visitors-connections" },
                { title: "Appointments", id: "visitors-appointments" },
            ]
        },
        {
            title: "Financial & Transactions",
            id: "financial",
            subItems: [
                { title: "Payments Dashboard", id: "financial-payments" },
                { title: "Subscriptions & Plans", id: "financial-subscriptions" },
                { title: "Invoices & Receipts", id: "financial-invoices" },
                { title: "Transaction History", id: "financial-transactions" },
            ]
        },
        {
            title: "Content Management",
            id: "content",
            subItems: [
                { title: "News & Announcements", id: "content-news" },
                { title: "Blog & Articles", id: "content-blog" },
                { title: "Banner & Ads Manager", id: "content-banners" },
                { title: "Featured Events", id: "content-featured" },
                { title: "Media Library", id: "content-media" },
            ]
        },
        {
            title: "Marketing & Communication",
            id: "marketing",
            subItems: [
                { title: "Email Campaigns", id: "marketing-email" },
                { title: "Push Notifications", id: "marketing-notifications" },
                { title: "Traffic Analytics", id: "marketing-traffic" },
                { title: "SEO & Keywords", id: "marketing-seo" },
            ]
        },
        {
            title: "Reports & Analytics",
            id: "reports",
            subItems: [
                { title: "Event Performance", id: "reports-events" },
                { title: "User Engagement", id: "reports-engagement" },
                { title: "Revenue Reports", id: "reports-revenue" },
                { title: "Traffic Sources", id: "reports-traffic" },
                { title: "System Health", id: "reports-system" },
            ]
        },
        {
            title: "Integrations",
            id: "integrations",
            subItems: [
                { title: "Payment Gateways", id: "integrations-payment" },
                { title: "Email/SMS Providers", id: "integrations-communication" },
                { title: "Calendar & API", id: "integrations-calendar" },
                { title: "Hotel & Travel Partners", id: "integrations-travel" },
            ]
        },
        {
            title: "User Roles & Permissions",
            id: "roles",
            subItems: [
                { title: "Super Admin", id: "roles-superadmin" },
                { title: "Sub Admins", id: "roles-subadmins" },
                { title: "Access Control", id: "roles-access" },
            ]
        },
        {
            title: "Settings & Configuration",
            id: "settings",
            subItems: [
                { title: "Module Management", id: "settings-modules" },
                { title: "Notifications", id: "settings-notifications" },
                { title: "Security", id: "settings-security" },
                { title: "Language & Localization", id: "settings-language" },
                { title: "Backup & Restore", id: "settings-backup" },
            ]
        },
        {
            title: "Help & Support",
            id: "support",
            subItems: [
                { title: "Support Tickets", id: "support-tickets" },
                { title: "Contact Logs", id: "support-contacts" },
                { title: "Admin Notes", id: "support-notes" },
            ]
        },
    ]

    // Group categories into 3 columns
    const groupedCategories = [
        permissionCategories.slice(0, 5),
        permissionCategories.slice(5, 10),
        permissionCategories.slice(10)
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
                            {/* role */}
                            <div className="grid grid-cols-12 items-center gap-3">
                                <Label className="col-span-2 text-gray-700 font-medium">
                                    Role
                                </Label>
                                <Input className="col-span-9" placeholder="Enter your role" />
                            </div>
                            <hr></hr>
                            {/* User name */}
                            <div className="grid grid-cols-12 items-center gap-3">
                                <Label className="col-span-2 text-gray-700 font-medium">
                                    Email
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
                                {groupedCategories.map((column, columnIndex) => (
                                    <div key={columnIndex} className="space-y-3">
                                        {column.map((category) => (
                                            <div key={category.id} className="border-b last:border-none pb-3">
                                                {/* Category Header */}
                                                <div 
                                                    className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                                                    onClick={() => toggleCategory(category.id)}
                                                >
                                                    {expandedCategories.includes(category.id) ? (
                                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-gray-500" />
                                                    )}
                                                    <Checkbox
                                                        id={`category-${category.id}`}
                                                        checked={category.subItems.every(subItem => 
                                                            selectedPermissions.includes(subItem.id)
                                                        )}
                                                        onCheckedChange={() => {
                                                            const allSubItemIds = category.subItems.map(sub => sub.id);
                                                            if (category.subItems.every(subItem => 
                                                                selectedPermissions.includes(subItem.id)
                                                            )) {
                                                                // Remove all sub-items
                                                                setSelectedPermissions(prev => 
                                                                    prev.filter(p => !allSubItemIds.includes(p))
                                                                );
                                                            } else {
                                                                // Add all sub-items
                                                                setSelectedPermissions(prev => 
                                                                    [...prev, ...allSubItemIds.filter(p => !prev.includes(p))]
                                                                );
                                                            }
                                                        }}
                                                        className={`transition-colors duration-200 
                                                            ${category.subItems.every(subItem => 
                                                                selectedPermissions.includes(subItem.id)
                                                            ) 
                                                                ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" 
                                                                : "bg-white border-gray-300"
                                                            }`}
                                                    />
                                                    <Label 
                                                        htmlFor={`category-${category.id}`} 
                                                        className="text-gray-700 font-medium cursor-pointer"
                                                    >
                                                        {category.title}
                                                    </Label>
                                                </div>

                                                {/* Sub Items */}
                                                {expandedCategories.includes(category.id) && (
                                                    <div className="ml-6 mt-2 space-y-2">
                                                        {category.subItems.map((subItem) => (
                                                            <div
                                                                key={subItem.id}
                                                                className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50"
                                                            >
                                                                <Checkbox
                                                                    id={subItem.id}
                                                                    checked={selectedPermissions.includes(subItem.id)}
                                                                    onCheckedChange={() => handleToggle(subItem.id)}
                                                                    className={`transition-colors duration-200 
                                                                        ${selectedPermissions.includes(subItem.id)
                                                                            ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                                                            : "bg-white border-gray-300"
                                                                        }`}
                                                                />
                                                                <Label htmlFor={subItem.id} className="text-gray-600 text-sm">
                                                                    {subItem.title}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
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