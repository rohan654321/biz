import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'
import { UserRole } from '@prisma/client'

// ================= GET NOTES ==================
// In your GET function, replace the return part:
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isArchived = searchParams.get('isArchived') === 'true'

    const userRole = session.user.role as UserRole

    // Base permissions
    let whereClause: any = {
      OR: [
        { createdById: session.user.id },
        { visibility: { in: ['TEAM', 'PUBLIC'] } },
        {
          collaborators: {
            some: {
              userId: session.user.id
            }
          }
        }
      ]
    }

    // TEAM role restriction
    if (userRole && Object.values(UserRole).includes(userRole)) {
      whereClause.OR.push({
        AND: [
          { visibility: 'TEAM' },
          {
            OR: [
              { userRoles: { has: userRole } },
              { userRoles: { isEmpty: true } }
            ]
          }
        ]
      })
    }

    // Archive filter
    whereClause.isArchived = isArchived

    const notes = await prisma.adminNote.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        tags: true,
        visibility: true,
        userRoles: true,
        dashboardTypes: true,
        isPinned: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        createdById: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        collaborators: {
          select: {
            id: true,
            permission: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    // Safely handle null createdBy and collaborators
    const safeNotes = notes.map(note => ({
      ...note,
      createdBy: note.createdBy || {
        firstName: 'Unknown',
        lastName: 'User',
        email: 'unknown@example.com',
        role: 'USER' as UserRole
      },
      collaborators: note.collaborators.map(collab => ({
        ...collab,
        user: collab.user || {
          firstName: 'Unknown',
          lastName: 'User', 
          email: 'unknown@example.com',
          role: 'USER' as UserRole
        }
      }))
    }))

    return NextResponse.json(safeNotes)
  } catch (error) {
    console.error('Error fetching admin notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin notes' },
      { status: 500 }
    )
  }
}

// ================= CREATE NOTE ==================
export async function POST(request: NextRequest) {
  console.log('POST /api/admin-notes called'); // Debug log
  
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session); // Debug log
    
    if (!session?.user?.id) {
      console.log('No session user ID'); // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body); // Debug log
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create the note directly without checking user existence first
    // Let Prisma handle the foreign key constraint
    const newNote = await prisma.adminNote.create({
      data: {
        title: body.title,
        content: body.content,
        category: body.category || 'General',
        tags: body.tags || [],
        visibility: body.visibility || 'PRIVATE',
        userRoles: body.userRoles || [],
        dashboardTypes: body.dashboardTypes || [],
        isPinned: body.isPinned || false,
        isArchived: body.isArchived || false,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true, email: true, role: true }
        },
        collaborators: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true, role: true }
            }
          }
        }
      }
    })

    console.log('Note created successfully:', newNote.id); // Debug log
    return NextResponse.json(newNote, { status: 201 })
    
  } catch (error: any) {
    console.error('Error creating admin note:', error)
    
    // More specific error handling
    if (error.code === 'P2003') { // Foreign key constraint failed
      return NextResponse.json(
        { error: 'User not found. Please log in again.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create admin note' },
      { status: 500 }
    )
  }
}