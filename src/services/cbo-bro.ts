export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
  isError?: boolean
}

export interface User {
  id: number
  first_name?: string
  last_name?: string
  username?: string
}

// CBO-Bro Agent API stub - ready for MCP integration
export async function sendMessageToCBOBro(message: string, user?: User): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  // For now, return mock responses based on keywords
  // This will be replaced with actual MCP integration
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `Yo ${user?.first_name || 'bro'}! I'm CBO Bro, your Chief Business Optimization wingman! 💪

Here's what I can help you with:
• 📊 Business health diagnostics using the BroVerse Biz Mental Model™
• 🔍 Identify bottlenecks in your Four Flows (Value, Info, Cash, Culture)
• 💡 Strategic recommendations based on 64 Business Patterns
• 📈 Growth hacking strategies that actually work
• 🚀 Crisis response and turnaround planning

Just tell me what's going on with your business, and I'll hook you up with some serious insights!`
  }

  if (lowerMessage.includes('revenue') || lowerMessage.includes('sales')) {
    return `Alright, let's talk revenue optimization! 📈

Based on the BBMM framework, here are the key areas to check:

1. **Value Flow**: Is your value prop crystal clear? Are customers getting it?
2. **Info Flow**: How's your sales data pipeline? Real-time insights?
3. **Cash Flow**: What's your conversion rate looking like?
4. **Culture Flow**: Is your sales team aligned and motivated?

Want me to dive deeper into any of these? I can run a full diagnostic!`
  }

  if (lowerMessage.includes('customer') || lowerMessage.includes('client')) {
    return `Customer optimization - now we're talking! 🎯

The BBMM framework identifies these customer-related patterns:
• Customer Acquisition Cost (CAC) optimization
• Lifetime Value (LTV) enhancement
• Churn reduction strategies
• NPS improvement tactics

Which area is giving you the most headaches right now?`
  }

  if (lowerMessage.includes('team') || lowerMessage.includes('employee')) {
    return `Team optimization is crucial, bro! 👥

Culture Flow is one of the Four Flows that drives everything:
• Communication patterns
• Decision-making speed
• Innovation capacity
• Execution velocity

Tell me more about your team challenges, and I'll prescribe the right pattern!`
  }

  // Default response for unmatched queries
  return `Interesting question! 🤔

To give you the most valuable insights, I need to understand your business context better. 

Could you tell me:
1. What specific challenge are you facing?
2. What's the impact on your business?
3. What have you tried so far?

The more details you share, the better I can apply the BBMM framework to help you crush it! 💪`
}

// Future MCP integration placeholder
export class CBOBroMCPClient {
  private mcpEndpoint: string
  
  constructor(endpoint: string = import.meta.env.VITE_AGENT_ENDPOINT) {
    this.mcpEndpoint = endpoint
  }

  async connect() {
    // TODO: Implement MCP connection
    console.log('MCP connection stub - ready for implementation')
  }

  async sendMessage(message: string, context?: any) {
    // TODO: Implement MCP message sending
    console.log('MCP message sending stub', { message, context })
    return sendMessageToCBOBro(message)
  }

  async disconnect() {
    // TODO: Implement MCP disconnection
    console.log('MCP disconnection stub')
  }
}