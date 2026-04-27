import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiService, AIProviderError } from '@/lib/ai'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().optional(),
  messages: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
  sessionId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // Validate input
    const result = chatSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { message: rawMessage, messages: incomingMessages, sessionId } = result.data
    const message = rawMessage || (incomingMessages && incomingMessages.length > 0 ? incomingMessages[incomingMessages.length - 1].content : '')
    
    if (!message) {
      return NextResponse.json({ success: false, error: 'No message provided' }, { status: 400 })
    }

    // Get user context if logged in
    let userContext: any = undefined
    let chatSession = null
    let messages: { role: 'user' | 'assistant'; content: string }[] = 
      (incomingMessages as any) || [{ role: 'user' as const, content: message }]
    
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          dateOfBirth: true,
          sex: true,
          allergies: true,
        },
      })
      
      if (user) {
        userContext = {
          age: user.dateOfBirth
            ? Math.floor((Date.now() - user.dateOfBirth.getTime()) / 31557600000)
            : undefined,
          sex: user.sex || undefined,
          allergies: user.allergies,
        }
      }
      
      // Get or create chat session
      if (sessionId) {
        chatSession = await prisma.chatSession.findUnique({
          where: { id: sessionId, userId: session.user.id },
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              take: 20, // Limit context window
            },
          },
        })
        
        if (chatSession) {
          messages = chatSession.messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }))
        }
      }
      
      if (!chatSession) {
        chatSession = await prisma.chatSession.create({
          data: {
            userId: session.user.id,
            title: (message || 'Chat session').slice(0, 50),
          },
        })
      }
    }
    
    // Add the new message to history
    messages.push({ role: 'user', content: message })
    
    // Get AI response
    const aiResponse = await aiService.healthChat(messages, userContext)
    
    // Save messages to database if logged in
    if (session?.user?.id && chatSession) {
      await prisma.chatMessage.createMany({
        data: [
          {
            chatSessionId: chatSession.id,
            role: 'user',
            content: message,
          },
          {
            chatSessionId: chatSession.id,
            role: 'assistant',
            content: aiResponse,
          },
        ],
      })
      
      // Update session timestamp
      await prisma.chatSession.update({
        where: { id: chatSession.id },
        data: { updatedAt: new Date() },
      })
    }
    
    return NextResponse.json({
      success: true,
      response: aiResponse,
      data: {
        sessionId: chatSession?.id,
        message: aiResponse,
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    
    if (error instanceof AIProviderError) {
      return NextResponse.json(
        { success: false, error: `AI service error: ${error.message}` },
        { status: error.statusCode || 500 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to get response' },
      { status: 500 }
    )
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (sessionId) {
      // Get specific session
      const chatSession = await prisma.chatSession.findUnique({
        where: { id: sessionId, userId: session.user.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      })
      
      return NextResponse.json({
        success: true,
        data: chatSession,
      })
    }
    
    // Get all sessions
    const sessions = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        _count: {
          select: { messages: true },
        },
      },
    })
    
    return NextResponse.json({
      success: true,
      data: sessions,
    })
  } catch (error) {
    console.error('Get chat history error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get history' },
      { status: 500 }
    )
  }
}
