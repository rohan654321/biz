import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { registerSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received registration data:", body)

    // Parse and validate the form data
    const { fullName, email, password, phone, companyName, designation, website, userType, selectedPlan } = body

    // Improved name parsing logic
    const nameParts = fullName.trim().split(" ")
    let firstName = ""
    let lastName = ""

    if (nameParts.length === 1) {
      // Single name - use as first name, set lastName to a default
      firstName = nameParts[0]
      lastName = "User" // Default last name
    } else if (nameParts.length === 2) {
      // Two parts - first and last name
      firstName = nameParts[0]
      lastName = nameParts[1]
    } else {
      // Multiple parts - first name is first part, last name is rest
      firstName = nameParts[0]
      lastName = nameParts.slice(1).join(" ")
    }

    // Map userType to role enum
    const roleMapping: Record<string, string> = {
      visitor: "ATTENDEE",
      exhibitor: "EXHIBITOR",
      organiser: "ORGANIZER",
      speaker: "SPEAKER",
      venue: "VENUE_MANAGER",
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone: phone || undefined,
      role: roleMapping[userType] || "ATTENDEE",
      company: companyName || undefined,
      jobTitle: designation || undefined,
      website: website || undefined,
    }

    console.log("Parsed user data:", userData)

    // Validate the data
    const validatedData = registerSchema.parse(userData)
    console.log("Validated data:", validatedData)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      console.log("User already exists:", validatedData.email)
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    console.log("Password hashed successfully")

    // Create user in database
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        role: validatedData.role as any,   
        company: validatedData.company,
        jobTitle: validatedData.jobTitle,
        website: validatedData.website,
        isVerified: false,
        isActive: true,
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        loginAttempts: 0,
      },
    })

    console.log("User created successfully:", user.id)

    // If organizer, store selected plan (you can extend this later)
    if (userType === "organiser" && selectedPlan) {
      console.log(`User ${user.id} selected plan: ${selectedPlan}`)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Welcome to our platform.",
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.name === "ZodError") {
      console.log("Validation errors:", error.errors)
      const errorMessages = error.errors.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errorMessages,
          validationErrors: error.errors,
        },
        { status: 400 },
      )
    }

    if (error.code === "P2031") {
      console.log("MongoDB replica set error")
      return NextResponse.json(
        {
          error: "Database configuration error. Please contact support.",
        },
        { status: 500 },
      )
    }

    if (error.code === "P2002") {
      console.log("Duplicate email error")
      return NextResponse.json(
        {
          error: "User with this email already exists",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Registration failed. Please try again.",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
