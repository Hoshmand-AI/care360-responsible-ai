import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const saveLocationSchema = z.object({
  placeId: z.string(),
  name: z.string(),
  address: z.string(),
  type: z.enum(['pharmacy', 'doctor', 'urgent_care', 'hospital']),
  phone: z.string().optional(),
  website: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  nickname: z.string().optional(),
  notes: z.string().optional(),
})

// Save a location
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Validate input
    const result = saveLocationSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const location = await prisma.savedLocation.upsert({
      where: {
        userId_placeId: {
          userId: session.user.id,
          placeId: result.data.placeId,
        },
      },
      update: {
        ...result.data,
      },
      create: {
        userId: session.user.id,
        ...result.data,
      },
    })
    
    return NextResponse.json({
      success: true,
      data: location,
    })
  } catch (error) {
    console.error('Save location error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save location' },
      { status: 500 }
    )
  }
}

// Get saved locations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const locations = await prisma.savedLocation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({
      success: true,
      data: locations,
    })
  } catch (error) {
    console.error('Get saved locations error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get locations' },
      { status: 500 }
    )
  }
}

// Delete a saved location
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const placeId = searchParams.get('placeId')
    
    if (!placeId) {
      return NextResponse.json(
        { success: false, error: 'Place ID is required' },
        { status: 400 }
      )
    }
    
    await prisma.savedLocation.delete({
      where: {
        userId_placeId: {
          userId: session.user.id,
          placeId,
        },
      },
    })
    
    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Delete location error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete location' },
      { status: 500 }
    )
  }
}
