import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid exhibitor ID" }, { status: 400 })
    }

    // Mock products data
    const products = [
      {
        id: "prod-1",
        name: "Smart Display System",
        description: "Advanced digital display solution for exhibitions with touch interface and cloud connectivity",
        price: 2999.99,
        category: "Technology",
        specifications: {
          dimensions: "55 inches",
          resolution: "4K Ultra HD",
          connectivity: "WiFi, Bluetooth, USB-C",
          weight: "25 kg",
        },
        images: ["/smart-display.png", "/smart-display-front.png", "/smart-display-back.png"],
        views: 156,
        inquiries: 23,
        status: "ACTIVE",
        inventory: 15,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-02-20T14:30:00Z",
      },
      {
        id: "prod-2",
        name: "Interactive Software Platform",
        description: "Comprehensive software solution for business management with AI-powered analytics",
        price: 1499.99,
        category: "Software",
        specifications: {
          deployment: "Cloud-based",
          users: "Up to 100 users",
          storage: "1TB included",
          support: "24/7 premium support",
        },
        images: ["/software-dashboard.png", "/generic-software-interface.png", "/analytics-dashboard.png"],
        views: 89,
        inquiries: 12,
        status: "ACTIVE",
        inventory: null, // Digital product
        createdAt: "2024-02-01T09:00:00Z",
        updatedAt: "2024-02-25T16:45:00Z",
      },
      {
        id: "prod-3",
        name: "Portable Exhibition Booth",
        description: "Lightweight, modular exhibition booth that can be assembled in minutes",
        price: 899.99,
        category: "Exhibition Equipment",
        specifications: {
          size: "3x3 meters",
          weight: "45 kg total",
          material: "Aluminum frame with fabric panels",
          setup: "Tool-free assembly",
        },
        images: ["/portable-booth.png", "/booth-assembly.png"],
        views: 67,
        inquiries: 8,
        status: "ACTIVE",
        inventory: 8,
        createdAt: "2024-01-20T11:30:00Z",
        updatedAt: "2024-02-18T13:15:00Z",
      },
    ]

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid exhibitor ID" }, { status: 400 })
    }

    // Mock product creation
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      specifications: body.specifications || {},
      images: body.images || ["/new-product-launch.png"],
      views: 0,
      inquiries: 0,
      status: "ACTIVE",
      inventory: body.inventory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Product created successfully",
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid exhibitor ID" }, { status: 400 })
    }

    // Mock product update
    const updatedProduct = {
      id: body.productId,
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      specifications: body.specifications,
      images: body.images,
      status: body.status,
      inventory: body.inventory,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid exhibitor ID" }, { status: 400 })
    }

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
