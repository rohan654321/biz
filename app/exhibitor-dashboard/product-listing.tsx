"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Package, Plus, Upload, FileText, Video, Edit, Trash2, Eye, ExternalLink } from "lucide-react"

interface ProductListingProps {
  exhibitorId: string
}

interface Product {
  id: string
  name: string
  category: string
  description: string
  images: string[]
  brochures: string[]
  videos: string[]
  views: number
  downloads: number
  price?: number
  currency?: string
  isActive: boolean
}

export default function ProductListing({ exhibitorId }: ProductListingProps) {
  const { toast } = useToast()
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    currency: "USD",
  })

  useEffect(() => {
    if (exhibitorId && exhibitorId !== "undefined") {
      fetchProducts()
    }
  }, [exhibitorId])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/exhibitors/${exhibitorId}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    try {
      const response = await fetch(`/api/exhibitors/${exhibitorId}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? Number.parseFloat(formData.price) : null,
          images: [],
          brochures: [],
          videos: [],
          features: [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      const data = await response.json()
      setProducts([data.product, ...products])
      setIsAddProductOpen(false)
      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        currency: "USD",
      })

      toast({
        title: "Success",
        description: "Product added successfully!",
      })
    } catch (err) {
      console.error("Error adding product:", err)
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={product.images[0] || "/placeholder.svg?height=96&width=96&text=Product"}
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
                <div className="font-semibold text-blue-600">{product.views || 0}</div>
                <div className="text-gray-600">Views</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-600">{product.downloads || 0}</div>
                <div className="text-gray-600">Downloads</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="font-semibold text-purple-600">{product.brochures?.length || 0}</div>
                <div className="text-gray-600">Brochures</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="font-semibold text-orange-600">{product.videos?.length || 0}</div>
                <div className="text-gray-600">Videos</div>
              </div>
            </div>

            {product.price && (
              <div className="mb-4">
                <span className="text-lg font-semibold text-green-600">
                  {product.currency} {product.price}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {product.brochures?.map((brochure: string, index: number) => (
                <Button key={index} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  Brochure {index + 1}
                </Button>
              ))}
              {product.videos?.map((video: string, index: number) => (
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    )
  }

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
                  <Input
                    id="product-name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="Enter category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe your product or service..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Optional)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    placeholder="USD"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  />
                </div>
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

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No products listed</h3>
              <p className="text-gray-500">Add your first product to get started</p>
            </CardContent>
          </Card>
        )}
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
              <div className="text-3xl font-bold text-green-600">
                {products.reduce((sum, p) => sum + (p.views || 0), 0)}
              </div>
              <div className="text-gray-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {products.reduce((sum, p) => sum + (p.downloads || 0), 0)}
              </div>
              <div className="text-gray-600">Total Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {products.reduce((sum, p) => sum + (p.brochures?.length || 0), 0)}
              </div>
              <div className="text-gray-600">Total Brochures</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
