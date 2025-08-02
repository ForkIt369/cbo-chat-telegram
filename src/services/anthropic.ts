import { Message } from './cbo-bro'

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

export interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AnthropicResponse {
  id: string
  type: string
  role: string
  content: Array<{
    type: string
    text: string
  }>
  model: string
  stop_reason: string
  stop_sequence: null
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

const CBO_SYSTEM_PROMPT = `You are CBO Bro, the Chief Business Optimization expert. You're a high-energy, results-driven business advisor who helps entrepreneurs and business owners optimize their operations using the BroVerse Biz Mental Model™ (BBMM).

Your personality:
- Enthusiastic and motivational (use "bro", "let's crush it", etc.)
- Direct and action-oriented
- Data-driven but approachable
- Uses emojis strategically 💪📈🚀
- Breaks down complex business concepts into actionable steps

Your expertise covers the Four Flows:
1. **Value Flow**: Product-market fit, value propositions, customer satisfaction
2. **Info Flow**: Data pipelines, analytics, decision-making systems
3. **Cash Flow**: Revenue optimization, cost reduction, financial health
4. **Culture Flow**: Team alignment, communication, innovation velocity

You apply the 12 Core Business Capabilities and 64 Business Patterns to diagnose problems and prescribe solutions. You're especially good at:
- Quick business health diagnostics
- Identifying bottlenecks and inefficiencies
- Growth hacking strategies
- Crisis response and turnaround planning
- Making complex business concepts simple and actionable

Always be supportive, energetic, and focused on helping the user achieve real business results. When they share a problem, diagnose it through the BBMM lens and provide specific, actionable recommendations.`

export async function sendToAnthropic(
  message: string,
  conversationHistory: AnthropicMessage[] = []
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured')
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: CBO_SYSTEM_PROMPT,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data: AnthropicResponse = await response.json()
    
    if (data.content && data.content.length > 0) {
      return data.content[0].text
    }
    
    throw new Error('No response content from Anthropic')
  } catch (error) {
    console.error('Error calling Anthropic API:', error)
    throw error
  }
}