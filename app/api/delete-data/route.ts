import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    // Delete all user health data
    await prisma.symptomCheck.deleteMany({ where: { userId: session.user.id } })
    await prisma.chatSession.deleteMany({ where: { userId: session.user.id } })
    await prisma.savedLocation.deleteMany({ where: { userId: session.user.id } })
    await prisma.user.update({
      where: { id: session.user.id },
      data: { dataDeleteRequested: true, dateOfBirth: null, sex: null, allergies: [], weight: null, race: null, currentMedications: [] },
    })

    return NextResponse.json({ success: true, message: 'All health data deleted successfully.' })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
