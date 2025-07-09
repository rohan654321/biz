"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { connections } from "@/lib/mock-data"

export function ConnectionsSection() {
  return (
    <div className="space-y-6 mx-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search connections..." className="pl-10 w-64" />
          </div>
          <Button>Find People</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <Card key={connection.id}>
            <CardContent className="p-6 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-4">
                <AvatarImage src={connection.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {connection.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold mb-1">{connection.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{connection.title}</p>
              <p className="text-sm text-gray-500 mb-3">{connection.company}</p>
              <p className="text-xs text-gray-500 mb-4">{connection.mutualConnections} mutual connections</p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Message
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
