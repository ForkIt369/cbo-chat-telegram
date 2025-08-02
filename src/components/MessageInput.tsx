import { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { haptic } = useTelegram()

  useEffect(() => {
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage('')
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="glass border-t border-[var(--cbo-border)] px-4 py-3">
      <div className="flex items-end space-x-3">
        {/* Quick Actions */}
        <button
          onClick={() => {
            haptic?.impactOccurred('light')
            setMessage('How can I optimize my revenue?')
          }}
          className="p-2 rounded-full hover:bg-[var(--cbo-bg-secondary)] transition-colors"
          title="Revenue optimization"
        >
          <svg className="w-5 h-5 text-[var(--cbo-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>

        {/* Input Field */}
        <div className={`flex-1 relative transition-all ${isFocused ? 'transform scale-[1.01]' : ''}`}>
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask me about your business..."
            className="w-full bg-[var(--cbo-bg-secondary)] text-[var(--cbo-text-primary)] rounded-2xl px-4 py-3 resize-none outline-none transition-all placeholder-[var(--cbo-text-muted)] border border-transparent focus:border-[var(--cbo-primary)] focus:shadow-[0_0_20px_rgba(48,209,88,0.1)]"
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '48px' }}
          />
          
          {/* Character count */}
          {message.length > 0 && (
            <span className="absolute right-3 bottom-2 text-xs text-[var(--cbo-text-muted)]">
              {message.length}
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={() => {
            haptic?.impactOccurred('light')
            handleSend()
          }}
          disabled={!message.trim() || isLoading}
          className={`relative rounded-full p-3 transition-all transform ${
            message.trim() && !isLoading
              ? 'bg-gradient-to-br from-[var(--cbo-primary)] to-[var(--cbo-primary-dark)] text-black hover:scale-105 active:scale-95 shadow-lg shadow-[var(--cbo-shadow)]'
              : 'bg-[var(--cbo-bg-secondary)] text-[var(--cbo-text-muted)] cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      {/* Suggested Prompts */}
      {message.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {['Team scaling issues', 'Cash flow analysis', 'Growth strategies'].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                haptic?.impactOccurred('light')
                setMessage(prompt)
                inputRef.current?.focus()
              }}
              className="quick-action"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}