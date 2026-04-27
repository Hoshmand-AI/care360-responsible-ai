import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ===========================================
// TYPES
// ===========================================

export interface SymptomAnalysisInput {
  symptoms: string[]
  duration?: string
  severity?: string
  age?: number
  sex?: string
  allergies?: string[]
  additionalInfo?: string
}

export interface SymptomAnalysisResult {
  urgencyLevel: 'routine' | 'soon' | 'urgent' | 'emergency'
  possibleCauses: string[]
  recommendations: string[]
  otcSuggestions: {
    name: string
    brands: string[]
    purpose: string
    warnings?: string[]
  }[]
  warningSignsToWatch: string[]
  disclaimers: string[]
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// ===========================================
// SYMPTOM ANALYSIS
// ===========================================

export async function analyzeSymptoms(
  input: SymptomAnalysisInput
): Promise<SymptomAnalysisResult> {
  const systemPrompt = `You are Care360 AI, a helpful health guidance assistant created by Hoshmand AI. 
You provide general wellness guidance based on symptoms, but you are NOT a doctor and do not provide medical diagnoses.

IMPORTANT RULES:
1. Always err on the side of caution
2. For serious symptoms (chest pain, difficulty breathing, severe bleeding, loss of consciousness), ALWAYS return urgency "emergency"
3. Provide clear, actionable guidance
4. Include appropriate OTC medication suggestions when relevant
5. Always include warning signs to watch for
6. Be empathetic but professional

Respond ONLY with valid JSON matching this schema:
{
  "urgencyLevel": "routine" | "soon" | "urgent" | "emergency",
  "possibleCauses": ["string array of 2-4 possible causes"],
  "recommendations": ["string array of 3-5 actionable recommendations"],
  "otcSuggestions": [
    {
      "name": "generic drug name",
      "brands": ["brand names"],
      "purpose": "what it helps with",
      "warnings": ["optional warnings"]
    }
  ],
  "warningSignsToWatch": ["signs that should prompt seeking care"],
  "disclaimers": ["important disclaimers"]
}`

  const userPrompt = `Analyze these symptoms and provide guidance:

Symptoms: ${input.symptoms.join(', ')}
${input.duration ? `Duration: ${input.duration}` : ''}
${input.severity ? `Severity: ${input.severity}` : ''}
${input.age ? `Age: ${input.age}` : ''}
${input.sex ? `Sex: ${input.sex}` : ''}
${input.allergies?.length ? `Known allergies: ${input.allergies.join(', ')}` : ''}
${input.additionalInfo ? `Additional info: ${input.additionalInfo}` : ''}

Provide your analysis as JSON only.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 1000,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from AI')
  }

  const result = JSON.parse(content) as SymptomAnalysisResult
  
  // Add standard disclaimers if not present
  if (!result.disclaimers || result.disclaimers.length === 0) {
    result.disclaimers = [
      'This is general wellness guidance, not medical advice.',
      'Always consult a healthcare provider for medical concerns.',
      'If symptoms worsen, seek immediate medical attention.',
    ]
  }

  return result
}

// ===========================================
// HEALTH CHAT
// ===========================================

export async function healthChat(
  messages: ChatMessage[],
  userContext?: {
    age?: number
    sex?: string
    allergies?: string[]
  }
): Promise<string> {
  const systemPrompt = `You are Care360 AI, a friendly and knowledgeable health guidance assistant created by Hoshmand AI.

Your role:
- Answer health questions clearly and helpfully
- Provide general wellness guidance
- Suggest OTC medications when appropriate
- Help users understand when to seek professional care
- Be empathetic, warm, and professional

You are NOT a doctor and cannot:
- Diagnose conditions
- Prescribe medications
- Replace professional medical advice

${userContext ? `User context:
- Age: ${userContext.age || 'unknown'}
- Sex: ${userContext.sex || 'unknown'}
- Known allergies: ${userContext.allergies?.join(', ') || 'none specified'}` : ''}

Keep responses concise but thorough. Use simple language. For serious symptoms, always recommend seeking immediate medical care.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ],
    temperature: 0.7,
    max_tokens: 800,
  })

  return response.choices[0].message.content || 'I apologize, but I was unable to generate a response. Please try again.'
}

// ===========================================
// QUICK HEALTH QUESTION
// ===========================================

export async function quickHealthQuestion(question: string): Promise<string> {
  return healthChat([{ role: 'user', content: question }])
}

export default openai
