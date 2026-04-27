import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiService } from '@/lib/ai'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const symptomsSchema = z.object({
  symptoms: z.array(z.string()).min(1).max(20),
  duration: z.string().optional(),
  severity: z.string().optional(),
  additionalInfo: z.string().max(500).optional(),
  // v2: Bio-Safety Profile fields
  age: z.number().min(0).max(120).optional(),
  sex: z.string().optional(),
  weight: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const result = symptomsSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
    }

    const { symptoms, duration, severity, additionalInfo, age, sex, weight, allergies, currentMedications } = result.data

    const analysis = await aiService.analyzeSymptoms({
      symptoms, duration, severity, additionalInfo,
      age, sex, weight, allergies, currentMedications,
    })

    // Save to DB if logged in
    if (session?.user?.id) {
      await prisma.symptomCheck.create({
        data: {
          userId: session.user.id,
          symptoms,
          duration,
          severity,
          additionalInfo,
          urgencyLevel: analysis.urgencyLevel,
          possibleCauses: analysis.possibleCauses,
          recommendations: analysis.recommendations,
          otcSuggestions: analysis.otcSuggestions as any,
          warningSignsToWatch: analysis.warningSignsToWatch,
          confidenceScore: analysis.confidenceScore,
          aiModel: 'gpt-4o',
          modelVersion: 'gpt-4o-2024-02-15-preview',
        },
      })
    }

    return NextResponse.json({ success: true, data: analysis })
  } catch (error) {
    console.error('Symptom analysis error:', error)
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 })
  }
}
