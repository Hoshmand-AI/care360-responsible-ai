import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { searchNearbyPlaces, getPlaceDetails } from '@/lib/places'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const searchSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  type: z.enum(['pharmacy', 'doctor', 'urgent_care', 'hospital', 'all']),
  radius: z.number().optional(),
  keyword: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = searchSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const places = await searchNearbyPlaces(result.data)
    
    return NextResponse.json({
      success: true,
      data: places,
    })
  } catch (error) {
    console.error('Places search error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search places' },
      { status: 500 }
    )
  }
}

// Get place details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const placeId = searchParams.get('placeId')
    
    if (!placeId) {
      return NextResponse.json(
        { success: false, error: 'Place ID is required' },
        { status: 400 }
      )
    }
    
    const place = await getPlaceDetails(placeId)
    
    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: place,
    })
  } catch (error) {
    console.error('Get place details error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get place details' },
      { status: 500 }
    )
  }
}
