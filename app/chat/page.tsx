'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Send, User, Bot, Loader2, Shield } from 'lucide-react'
import { FeedbackWidget } from '@/components/responsible/FeedbackWidget'
import { detectEmergency, detectControlledSubstanceMisuse, detectOutOfScope } from '@/lib/ai/openai'
import { EmergencyBanner } from '@/components/responsible/EmergencyBanner'

interface Message {
  id: string; role: 'user' | 'assistant'; content: string; timestamp: Date
  isGuardrail?: boolean
}

const SUGGESTED_PROMPTS = [
  'What OTC medicine is best for a headache?',
  'When should I see a doctor for a cold?',
  "What's the difference between cold and flu?",
  'How can I relieve muscle pain naturally?',
]

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  lines.forEach((line, lineIdx) => {
    if (line.trim() === '') { elements.push(<br key={`br-${lineIdx}`} />); return }
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    const rendered = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
      const ip = part.split(/(\*[^*]+\*)/g)
      return <span key={i}>{ip.map((p, j) => p.startsWith('*') && p.endsWith('*') && p.length > 2 ? <em key={j}>{p.slice(1, -1)}</em> : p)}</span>
    })
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      elements.push(<div key={lineIdx} className="flex items-start gap-2 my-0.5"><span className="text-teal-500 mt-0.5 flex-shrink-0">•</span><span>{rendered}</span></div>)
    } else if (/^\d+\.\s/.test(line.trim())) {
      const num = line.trim().match(/^(\d+)\./)?.[1]
      elements.push(<div key={lineIdx} className="flex items-start gap-2 my-0.5"><span className="text-teal-500 font-semibold flex-shrink-0 min-w-[1.25rem]">{num}.</span><span>{rendered}</span></div>)
    } else {
      elements.push(<p key={lineIdx} className="my-0.5">{rendered}</p>)
    }
  })
  return <div className="space-y-0.5">{elements}</div>
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [showEmergency, setShowEmergency] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', role: 'assistant', timestamp: new Date(),
    content: `Hi! I'm Care360 AI — a responsible health guidance assistant powered by **GPT-4o (OpenAI)**.\n\nI can help with general health questions, explain symptoms, and suggest OTC options. I am **not a doctor** and cannot diagnose conditions.\n\nHow can I help you today?`,
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const addGuardrailMessage = (content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content, timestamp: new Date(), isGuardrail: true }])
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // v2 Guardrails — client-side checks first
    if (detectEmergency(content)) { setShowEmergency(true); return }

    if (detectControlledSubstanceMisuse(content)) {
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: content.trim(), timestamp: new Date() }
      setMessages(prev => [...prev, userMsg])
      setInput('')
      addGuardrailMessage("I'm not able to help with that. If you're struggling with substance use, please contact SAMHSA's free confidential helpline: **1-800-662-4357** (available 24/7). If this is an emergency, call 911.")
      return
    }

    if (detectOutOfScope(content)) {
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: content.trim(), timestamp: new Date() }
      setMessages(prev => [...prev, userMsg])
      setInput('')
      addGuardrailMessage("I'm a health guidance assistant and can only help with health-related questions. For that topic, please consult an appropriate resource. Is there a health question I can help you with?")
      return
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: content.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) }),
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response, timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'I encountered an error. Please try again.', timestamp: new Date() }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  if (showEmergency) return <EmergencyBanner />

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 text-center">
        <h1 className="text-lg font-semibold text-navy-950">AI Health Advisor</h1>
        <p className="text-sm text-slate-500">Get answers to your health questions</p>
        {/* v2: Model transparency — Alex */}
        <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium px-3 py-1 rounded-full mt-2">
          <Shield className="w-3 h-3" /> Powered by GPT-4o · Responsible AI Edition · Not a medical diagnosis
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage message={message} />
              {/* v2: Feedback on each assistant message — Alex/Max */}
              {message.role === 'assistant' && message.id !== '1' && !message.isGuardrail && (
                <div className="ml-11 mt-1">
                  <FeedbackWidget page="chat" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-teal-600" /></div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Thinking...</span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested prompts */}
      {messages.length <= 2 && (
        <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button key={i} onClick={() => sendMessage(prompt)} disabled={isLoading}
                  className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors disabled:opacity-50">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* v2: Human oversight disclaimer — Bibhu */}
      <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-center">
        <p className="text-xs text-amber-700">⚕️ <strong>Not medical advice.</strong> Always consult a licensed healthcare provider. Care360 AI is not a doctor.</p>
      </div>

      <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask a health question..." disabled={isLoading}
              className="flex-1 px-5 py-3 bg-slate-100 border border-slate-200 rounded-full text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50" />
            <button type="submit" disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-slate-200' : 'bg-teal-100'}`}>
        {isUser ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-teal-600" />}
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${isUser ? 'bg-teal-600 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'}`}>
        {isUser ? <span className="whitespace-pre-wrap">{message.content}</span> : renderMarkdown(message.content)}
      </div>
    </div>
  )
}
