import { useState, useRef, useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useConvexSession } from '../hooks/useConvexSession'
import { useConvexMock } from '../hooks/useConvexMock'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { Message, sendMessageToCBOBro } from '../services/cbo-bro'

export default function ChatInterface() {
  const { user, haptic } = useTelegram()
  
  // Check if Convex is available
  const isConvexAvailable = !!import.meta.env.VITE_CONVEX_URL
  
  // Use either real Convex or mock
  const convexHook = isConvexAvailable ? useConvexSession : useConvexMock
  const { saveMessage, userInsights } = convexHook(user)
  
  console.log('[ChatInterface] Using Convex:', isConvexAvailable)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! I'm CBO Bro, your Chief Business Optimization partner. Ready to level up your business game? 🚀",
      sender: 'bot',
      timestamp: new Date(),
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    haptic?.impactOccurred('light')

    // Show typing indicator
    setIsLoading(true)
    const typingMessage: Message = {
      id: 'typing',
      text: '...',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      // Save user message to Convex
      await saveMessage('user', text)
      
      // Send to CBO-Bro agent
      const response = await sendMessageToCBOBro(text, user || undefined)
      
      // Save bot response to Convex
      await saveMessage('assistant', response)
      
      // Remove typing indicator and add response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing')
        return [...filtered, {
          id: Date.now().toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date(),
        }]
      })
      haptic?.notificationOccurred('success')
    } catch (error) {
      // Remove typing indicator and show error
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing')
        return [...filtered, {
          id: Date.now().toString(),
          text: "Yo, something went wrong. Let's try that again!",
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
        }]
      })
      haptic?.notificationOccurred('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-[var(--cbo-bg-dark)]">
      {/* Header */}
      <header className="glass px-5 py-4 border-b border-[var(--cbo-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--cbo-primary)] to-[var(--cbo-primary-dark)] flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-sm">CBO</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-[var(--cbo-text-primary)]">CBO Bro</h1>
              <p className="text-xs text-[var(--cbo-text-secondary)]">Your business optimization AI</p>
            </div>
          </div>
          {userInsights && (
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-xs text-[var(--cbo-text-secondary)]">Active insights</p>
                <p className="text-sm font-semibold text-[var(--cbo-primary)]">{userInsights.activeInsights}</p>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}