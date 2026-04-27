/**
 * Care360 Responsible AI — OpenAI Provider
 * Implements: NIST AI RMF, Jobin et al., Stilgoe/Owen RI principles
 */

import OpenAI from 'openai'
import {
  AIProvider, AIMessage, AIResponse, ChatOptions,
  SymptomAnalysisInput, SymptomAnalysisResult,
  UserContext, AIProviderError, AIRateLimitError, calculateCost,
} from './types'

// Emergency keywords — Roxette's "Kill Switch"
const EMERGENCY_KEYWORDS = [
  'chest pain', 'chest tightness', 'cannot breathe', "can't breathe",
  'difficulty breathing', 'trouble breathing', 'stroke', 'heart attack',
  'loss of consciousness', 'unconscious', 'passed out', 'severe bleeding',
  'uncontrollable bleeding', 'seizure', 'overdose', 'suicide', 'poisoning',
  'anaphylaxis', 'allergic reaction severe', 'not breathing',
]

// Controlled substance / misuse keywords — Molly's guardrail
const CONTROLLED_SUBSTANCE_PATTERNS = [
  /where can i (buy|get|find|purchase) (sudafed|pseudoephedrine|codeine|oxycodone|adderall|ritalin|xanax|valium)/i,
  /what symptoms (do i need|should i have) to get (codeine|oxycodone|percocet|vicodin|adderall)/i,
  /how (to|do i) get (prescribed|access) (opioids?|opiates?|benzos?|stimulants?)/i,
  /how (much|many) (sudafed|pseudoephedrine) can i buy/i,
  /make (meth|methamphetamine)/i,
  /(get high|abuse) (on )?(prescription|medication)/i,
]

// Out-of-scope detection — Bibhu's guardrail
const OUT_OF_SCOPE_PATTERNS = [
  /bike chain|bicycle|car|vehicle|plumbing|electrical|legal advice|financial advice|homework|essay|recipe|cooking|weather/i,
]

export function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase()
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw))
}

export function detectControlledSubstanceMisuse(text: string): boolean {
  return CONTROLLED_SUBSTANCE_PATTERNS.some(p => p.test(text))
}

export function detectOutOfScope(text: string): boolean {
  return OUT_OF_SCOPE_PATTERNS.some(p => p.test(text))
}

// ─── System Prompts ───────────────────────────────────────────────────────────

const SYMPTOM_ANALYSIS_SYSTEM_PROMPT = `You are Care360 AI, a responsible health guidance assistant by Hoshmand AI.
You provide general wellness guidance — you are NOT a doctor and do NOT diagnose.

RESPONSIBLE AI RULES:
1. For emergency symptoms (chest pain, difficulty breathing, severe bleeding, loss of consciousness, stroke signs), ALWAYS return urgencyLevel "emergency" and set confidenceScore to 99
2. Always include a confidenceScore (0-100) reflecting how confident the analysis is given limited symptom data
3. Never recommend prescription medications — OTC only
4. Always include source tags for OTC suggestions (FDA/Mayo Clinic)
5. Consider user's age, weight, allergies, and currentMedications for contraindications
6. If currentMedications include blood thinners (warfarin, aspirin therapy, clopidogrel) — flag ibuprofen/naproxen with a contraindication warning
7. Always recommend consulting a licensed healthcare provider
8. Include explanationOfReasoning — explain WHY each recommendation was made

Respond ONLY with valid JSON:
{
  "urgencyLevel": "routine" | "soon" | "urgent" | "emergency",
  "confidenceScore": 0-100,
  "possibleCauses": ["2-4 possible causes"],
  "recommendations": ["3-5 actionable recommendations"],
  "explanationOfReasoning": "plain English explanation of how this analysis was reached",
  "otcSuggestions": [
    {
      "name": "generic name",
      "brands": ["brand names"],
      "purpose": "what it helps",
      "source": "FDA Approved Label" | "Mayo Clinic Guide" | "CDC Guidelines",
      "contraindications": ["if any based on user profile"],
      "warnings": ["important warnings"]
    }
  ],
  "warningSignsToWatch": ["signs requiring immediate care"],
  "disclaimers": ["important disclaimers"]
}`

const HEALTH_CHAT_SYSTEM_PROMPT = `You are Care360 AI, a responsible health guidance assistant by Hoshmand AI.

RESPONSIBLE AI RULES:
1. You are NOT a doctor. Never diagnose. Always recommend consulting a healthcare professional.
2. If the user asks about a non-health topic (bikes, cars, homework, legal, financial), respond: "I'm a health guidance assistant and can only help with health-related questions. For that, please consult an appropriate resource."
3. If the user asks about obtaining controlled substances, drug abuse, or ways to misuse medications, respond: "I can't help with that. If you're struggling with substance use, please contact SAMHSA's helpline: 1-800-662-4357."
4. Always be empathetic, clear, and recommend professional care for serious concerns.
5. End every response that includes health advice with: "Remember: I provide general guidance only. Always consult a licensed healthcare provider for medical decisions."
6. You are powered by GPT-4o (OpenAI). This is disclosed for transparency.`

// ─── Provider Class ───────────────────────────────────────────────────────────

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai'
  private client: OpenAI
  private defaultModel: string
  readonly modelVersion = 'gpt-4o'

  constructor(apiKey?: string, defaultModel: string = 'gpt-4o') {
    this.client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY })
    this.defaultModel = defaultModel
  }

  async chat(messages: AIMessage[], options?: ChatOptions): Promise<AIResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.defaultModel,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1000,
        response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
      })
      const choice = response.choices[0]
      return {
        content: choice.message.content || '',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
        model: response.model,
        finishReason: choice.finish_reason,
      }
    } catch (error: any) {
      if (error?.status === 429) throw new AIRateLimitError(this.name)
      throw new AIProviderError(error?.message || 'OpenAI API error', this.name, error?.code, error?.status)
    }
  }

  async analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisResult> {
    const userPrompt = `Analyze these symptoms:

Symptoms: ${input.symptoms.join(', ')}
${input.duration ? `Duration: ${input.duration}` : ''}
${input.severity ? `Severity: ${input.severity}` : ''}
${input.age ? `Age: ${input.age}` : ''}
${input.sex ? `Sex: ${input.sex}` : ''}
${input.weight ? `Weight: ${input.weight}` : ''}
${input.allergies?.length ? `Known allergies: ${input.allergies.join(', ')}` : ''}
${input.currentMedications?.length ? `Current medications: ${input.currentMedications.join(', ')}` : ''}
${input.additionalInfo ? `Additional info: ${input.additionalInfo}` : ''}

Respond with JSON only. Include confidenceScore and explanationOfReasoning.`

    const response = await this.chat(
      [
        { role: 'system', content: SYMPTOM_ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.3, maxTokens: 1200, jsonMode: true }
    )

    try {
      const result = JSON.parse(response.content) as SymptomAnalysisResult
      if (!result.disclaimers || result.disclaimers.length === 0) {
        result.disclaimers = [
          'This is general wellness guidance, not medical advice.',
          'Always consult a licensed healthcare provider for medical concerns.',
          'AI results are not a substitute for professional diagnosis.',
        ]
      }
      return result
    } catch {
      throw new AIProviderError('Failed to parse symptom analysis response', this.name, 'PARSE_ERROR')
    }
  }

  async healthChat(messages: AIMessage[], userContext?: UserContext): Promise<string> {
    let systemPrompt = HEALTH_CHAT_SYSTEM_PROMPT
    if (userContext) {
      systemPrompt += `\n\nUser health profile (for personalized guidance):
- Age: ${userContext.age || 'not provided'}
- Sex: ${userContext.sex || 'not provided'}
- Known allergies: ${userContext.allergies?.join(', ') || 'none'}
- Current medications: ${(userContext as any).currentMedications?.join(', ') || 'none'}`
    }
    const response = await this.chat(
      [{ role: 'system', content: systemPrompt }, ...messages],
      { temperature: 0.7, maxTokens: 900 }
    )
    return response.content
  }

  getEstimatedCost(response: AIResponse): number {
    if (!response.usage) return 0
    return calculateCost(response.model || this.defaultModel, response.usage.promptTokens, response.usage.completionTokens)
  }
}

let openaiProvider: OpenAIProvider | null = null
export function getOpenAIProvider(): OpenAIProvider {
  if (!openaiProvider) openaiProvider = new OpenAIProvider()
  return openaiProvider
}
export default OpenAIProvider
