"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Plus, Upload, FileText, Video, Edit, Trash2, Eye, ExternalLink } from "lucide-react"

export default function ProductListing() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  // Mock product data
  const products = [
    {
      id: 1,
      name: "AI-Powered Analytics Platform",
      category: "Software",
      description: "Advanced analytics platform with machine learning capabilities for business intelligence.",
      images: ["/placeholder.svg?height=200&width=300&text=AI+Platform"],
      brochures: ["AI_Platform_Brochure.pdf", "Technical_Specs.pdf"],
      videos: ["https://youtube.com/watch?v=demo1"],
      views: 245,
      downloads: 89,
    },
    {
      id: 2,
      name: "Cloud Security Suite",
      category: "Security",
      description: "Comprehensive cloud security solution with real-time threat detection and prevention.",
      images: ["/placeholder.svg?height=200&width=300&text=Security+Suite"],
      brochures: ["Security_Suite_Overview.pdf"],
      videos: ["https://youtube.com/watch?v=demo2"],
      views: 189,
      downloads: 67,
    },
    {
      id: 3,
      name: "Enterprise Mobile App",
      category: "Mobile",
      description: "Custom enterprise mobile application development platform with cross-platform support.",
      images: ["/placeholder.svg?height=200&width=300&text=Mobile+App"],
      brochures: ["Mobile_App_Features.pdf", "Development_Guide.pdf"],
      videos: [],
      views: 156,
      downloads: 45,
    },
  ]

  const ProductCard = ({ product }: { product: any }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {product.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{product.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-semibold text-blue-600">{product.views}</div>
                <div className="text-gray-600">Views</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-600">{product.downloads}</div>
                <div className="text-gray-600">Downloads</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="font-semibold text-purple-600">{product.brochures.length}</div>
                <div className="text-gray-600">Brochures</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="font-semibold text-orange-600">{product.videos.length}</div>
                <div className="text-gray-600">Videos</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.brochures.map((brochure: string, index: number) => (
                <Button key={index} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  {brochure}
                </Button>
              ))}
              {product.videos.map((video: string, index: number) => (
                <Button key={index} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Video className="w-4 h-4" />
                  Video {index + 1}
                  <ExternalLink className="w-3 h-3" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Product Listing & Brochures</h1>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product/Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product/Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Enter category" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} placeholder="Describe your product or service..." />
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload images or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Brochures/Catalogues</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Upload PDF brochures and catalogues</p>
                  <p className="text-sm text-gray-500">PDF files up to 25MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-url">Product Video (YouTube URL)</Label>
                <Input id="video-url" placeholder="https://youtube.com/watch?v=..." />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                  Cancel
                </Button>
                <Button>Add Product</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Upload Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Content Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{products.length}</div>
              <div className="text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{products.reduce((sum, p) => sum + p.views, 0)}</div>
              <div className="text-gray-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {products.reduce((sum, p) => sum + p.downloads, 0)}
              </div>
              <div className="text-gray-600">Total Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {products.reduce((sum, p) => sum + p.brochures.length, 0)}
              </div>
              <div className="text-gray-600">Total Brochures</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
