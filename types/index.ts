import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Symptom Check types
export interface SymptomCheckInput {
  symptoms: string[]
  duration?: string
  severity?: string
  additionalInfo?: string
}

export interface SymptomCheckResult {
  id: string
  urgencyLevel: 'routine' | 'soon' | 'urgent' | 'emergency'
  possibleCauses: string[]
  recommendations: string[]
  otcSuggestions: OTCSuggestion[]
  warningSignsToWatch: string[]
  createdAt: string
}

export interface OTCSuggestion {
  name: string
  brands: string[]
  purpose: string
  warnings?: string[]
}

// Chat types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface ChatSession {
  id: string
  title?: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

// Places types
export interface Place {
  placeId: string
  name: string
  address: string
  type: 'pharmacy' | 'doctor' | 'urgent_care' | 'hospital'
  phone?: string
  website?: string
  rating?: number
  totalRatings?: number
  latitude: number
  longitude: number
  distance?: number
  isOpen?: boolean
  openUntil?: string
  photoUrl?: string
}

// User profile types
export interface UserProfile {
  id: string
  email: string
  name?: string
  image?: string
  dateOfBirth?: string
  sex?: string
  allergies: string[]
}
