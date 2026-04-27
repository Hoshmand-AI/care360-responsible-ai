/**
 * Care360 AI - Provider Abstraction Layer
 * A Hoshmand AI Product
 * 
 * This module defines the interface for AI providers, allowing
 * easy swapping between OpenAI, Anthropic, or other providers.
 */

// ===========================================
// TYPES
// ===========================================

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatOptions {
  temperature?: number
  maxTokens?: number
  jsonMode?: boolean
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model?: string
  finishReason?: string
}

export interface SymptomAnalysisInput {
  symptoms: string[]
  duration?: string
  severity?: string
  age?: number
  sex?: string
  allergies?: string[]
  currentMedications?: string[]
  additionalInfo?: string
  weight?: string
}

export interface OTCSuggestion {
  name: string
  brands: string[]
  purpose: string
  warnings?: string[]
  source?: string
  contraindications?: string[]
}

export interface SymptomAnalysisResult {
  urgencyLevel: 'routine' | 'soon' | 'urgent' | 'emergency'
  confidenceScore?: number
  explanationOfReasoning?: string
  possibleCauses: string[]
  recommendations: string[]
  otcSuggestions: OTCSuggestion[]
  warningSignsToWatch: string[]
  disclaimers: string[]
}

export interface UserContext {
  age?: number
  sex?: string
  allergies?: string[]
  currentMedications?: string[]
}

// ===========================================
// PROVIDER INTERFACE
// ===========================================

export interface AIProvider {
  /**
   * Provider name for logging/tracking
   */
  readonly name: string

  /**
   * Send a chat completion request
   */
  chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse>

  /**
   * Analyze symptoms and return structured guidance
   */
  analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisResult>

  /**
   * Health-focused chat with optional user context
   */
  healthChat(messages: AIMessage[], userContext?: UserContext): Promise<string>
}

// ===========================================
// COST TRACKING
// ===========================================

export interface AIUsageLog {
  provider: string
  model: string
  operation: 'chat' | 'symptom_analysis' | 'health_chat'
  promptTokens: number
  completionTokens: number
  estimatedCost: number
  timestamp: Date
  userId?: string
}

// Cost per 1K tokens (as of 2024)
export const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
}

export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const costs = MODEL_COSTS[model] || MODEL_COSTS['gpt-4o']
  const inputCost = (promptTokens / 1000) * costs.input
  const outputCost = (completionTokens / 1000) * costs.output
  return inputCost + outputCost
}

// ===========================================
// ERROR TYPES
// ===========================================

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = 'AIProviderError'
  }
}

export class AIRateLimitError extends AIProviderError {
  constructor(provider: string, retryAfter?: number) {
    super(`Rate limit exceeded for ${provider}`, provider, 'RATE_LIMIT', 429)
    this.name = 'AIRateLimitError'
  }
}

export class AIContentFilterError extends AIProviderError {
  constructor(provider: string) {
    super(`Content filtered by ${provider}`, provider, 'CONTENT_FILTER', 400)
    this.name = 'AIContentFilterError'
  }
}
