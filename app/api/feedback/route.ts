import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { type, page, sessionId, description } = body

    await prisma.feedbackReport.create({
      data: {
        userId: session?.user?.id || null,
        type,
        page,
        sessionId: sessionId || null,
        description: description || '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
