/**
 * Care360 AI - Service Layer
 * A Hoshmand AI Product
 * 
 * This is the main entry point for AI functionality.
 * It provides a unified interface regardless of the underlying provider.
 * 
 * Usage:
 * ```ts
 * import { aiService } from '@/lib/ai'
 * 
 * // Analyze symptoms
 * const result = await aiService.analyzeSymptoms({ symptoms: ['headache'] })
 * 
 * // Chat
 * const response = await aiService.chat([{ role: 'user', content: 'Hello' }])
 * ```
 */

import { getOpenAIProvider } from './openai'
import type {
  AIProvider,
  AIMessage,
  AIResponse,
  ChatOptions,
  SymptomAnalysisInput,
  SymptomAnalysisResult,
  UserContext,
} from './types'

// Re-export types
export * from './types'

// ===========================================
// AI SERVICE WRAPPER
// ===========================================

class AIService {
  private provider: AIProvider

  constructor() {
    // Default to OpenAI provider
    // Can be changed to support multiple providers in the future
    this.provider = getOpenAIProvider()
  }

  /**
   * Get the current provider name
   */
  get providerName(): string {
    return this.provider.name
  }

  /**
   * Send a chat completion request
   */
  async chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    return this.provider.chat(messages, options)
  }

  /**
   * Analyze symptoms and return structured guidance
   */
  async analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisResult> {
    return this.provider.analyzeSymptoms(input)
  }

  /**
   * Health-focused chat with optional user context
   */
  async healthChat(messages: AIMessage[], userContext?: UserContext): Promise<string> {
    return this.provider.healthChat(messages, userContext)
  }

  /**
   * Quick one-off health question
   */
  async quickQuestion(question: string): Promise<string> {
    return this.healthChat([{ role: 'user', content: question }])
  }
}

// ===========================================
// SINGLETON INSTANCE
// ===========================================

let aiServiceInstance: AIService | null = null

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService()
  }
  return aiServiceInstance
}

// Default export for convenience
export const aiService = getAIService()

export default aiService
