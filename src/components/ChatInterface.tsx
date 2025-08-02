import { useState, useRef, useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { Message, sendMessageToCBOBro } from '../services/cbo-bro'

export default function ChatInterface() {
  const { user, hapticFeedback } = useTelegram()
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
    hapticFeedback?.impactOccurred('light')

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
      // Send to CBO-Bro agent
      const response = await sendMessageToCBOBro(text, user)
      
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
      hapticFeedback?.notificationOccurred('success')
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
      hapticFeedback?.notificationOccurred('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-telegram-bg">
      <header className="bg-telegram-secondary-bg px-4 py-3 shadow-sm">
        <h1 className="text-lg font-semibold text-telegram-text">CBO Bro Chat</h1>
        <p className="text-xs text-telegram-hint">Business optimization at your fingertips</p>
      </header>
      
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}