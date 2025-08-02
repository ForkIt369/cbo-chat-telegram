import { useState, useRef, KeyboardEvent } from 'react'
import { useTelegram } from '../hooks/useTelegram'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { haptic } = useTelegram()

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
    <div className="border-t border-telegram-hint/20 bg-telegram-secondary-bg px-4 py-3">
      <div className="flex items-end space-x-2">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask CBO Bro anything..."
          className="flex-1 bg-telegram-bg text-telegram-text rounded-2xl px-4 py-2 resize-none outline-none focus:ring-2 focus:ring-telegram-button/50 min-h-[40px] max-h-[120px]"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={() => {
            haptic?.impactOccurred('light')
            handleSend()
          }}
          disabled={!message.trim() || isLoading}
          className={`rounded-full p-2 transition-all ${
            message.trim() && !isLoading
              ? 'bg-telegram-button text-telegram-button-text hover:opacity-90'
              : 'bg-telegram-hint/20 text-telegram-hint cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  )
}