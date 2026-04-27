import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return formatDate(d)
}

// Format distance in miles
export function formatDistance(miles: number): string {
  if (miles < 0.1) return '< 0.1 mi'
  return `${miles.toFixed(1)} mi`
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Generate greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Urgency level helpers
export const urgencyConfig = {
  routine: {
    label: 'Self-care likely appropriate',
    description: 'Based on your symptoms, rest and self-care may help.',
    color: 'green',
    icon: '✅',
  },
  soon: {
    label: 'Consider seeing a doctor soon',
    description: 'Schedule an appointment within the next few days.',
    color: 'amber',
    icon: '⏰',
  },
  urgent: {
    label: 'Seek care today',
    description: 'Visit urgent care or your doctor as soon as possible.',
    color: 'orange',
    icon: '⚠️',
  },
  emergency: {
    label: 'Seek immediate medical attention',
    description: 'Call 911 or go to the nearest emergency room.',
    color: 'red',
    icon: '🚨',
  },
} as const

// Common symptoms list
export const commonSymptoms = [
  'Headache',
  'Fever',
  'Cough',
  'Sore throat',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Body aches',
  'Congestion',
  'Chills',
  'Runny nose',
  'Sneezing',
]

export const digestiveSymptoms = [
  'Stomach pain',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Constipation',
  'Bloating',
]

export const emergencySymptoms = [
  'Chest pain',
  'Difficulty breathing',
  'Severe bleeding',
  'Loss of consciousness',
]

// Common allergies
export const commonAllergies = [
  'Penicillin',
  'Aspirin',
  'NSAIDs (Ibuprofen)',
  'Sulfa drugs',
  'Latex',
  'None',
]
