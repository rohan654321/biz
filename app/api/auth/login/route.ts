import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuthService, TokenPayload } from '@/lib/auth-sub-admin'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists as SuperAdmin or SubAdmin
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { email, isActive: true }
    })

    const subAdmin = await prisma.subAdmin.findUnique({
      where: { email, isActive: true },
      include: { createdBy: true }
    })

    const user = superAdmin || subAdmin
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await AuthService.comparePassword(password, user.password)
    if (!isValidPassword) {
      // Increment login attempts
      if (superAdmin) {
        await prisma.superAdmin.update({
          where: { id: user.id },
          data: { loginAttempts: { increment: 1 } }
        })
      } else {
        await prisma.subAdmin.update({
          where: { id: user.id },
          data: { loginAttempts: { increment: 1 } }
        })
      }

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate tokens with proper typing
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: superAdmin ? 'SUPER_ADMIN' : 'SUB_ADMIN',
      type: superAdmin ? 'SUPER_ADMIN' : 'SUB_ADMIN'
    }

    const token = AuthService.generateToken(tokenPayload)
    const refreshToken = AuthService.generateRefreshToken(tokenPayload)

    // Get IP address safely
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : 'unknown'

    // Create session
    await prisma.adminSession.create({
      data: {
        adminId: user.id,
        adminType: superAdmin ? 'SUPER_ADMIN' : 'SUB_ADMIN',
        token,
        refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        deviceInfo: request.headers.get('user-agent') || '',
        ipAddress,
        userAgent: request.headers.get('user-agent') || '',
        ...(superAdmin ? { superAdminId: user.id } : { subAdminId: user.id })
      }
    })

    // Create admin log
    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        adminType: superAdmin ? 'SUPER_ADMIN' : 'SUB_ADMIN',
        action: 'LOGIN',
        resource: 'AUTH',
        ipAddress,
        userAgent: request.headers.get('user-agent') || '',
        ...(superAdmin ? { superAdminId: user.id } : { subAdminId: user.id })
      }
    })

    // Update last login and reset login attempts
    if (superAdmin) {
      await prisma.superAdmin.update({
        where: { id: user.id },
        data: { 
          lastLogin: new Date(),
          loginAttempts: 0 
        }
      })
    } else {
      await prisma.subAdmin.update({
        where: { id: user.id },
        data: { 
          lastLogin: new Date(),
          loginAttempts: 0 
        }
      })
    }

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: superAdmin ? 'SUPER_ADMIN' : 'SUB_ADMIN',
        permissions: user.permissions,
        ...(subAdmin && { createdBy: subAdmin.createdBy.name })
      }
    })

    // Set cookies
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    response.cookies.set('adminRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}