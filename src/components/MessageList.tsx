import { Message } from '../services/cbo-bro'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.sender === 'user'
                ? 'bg-telegram-button text-telegram-button-text'
                : message.isError
                ? 'bg-red-500/20 text-red-400'
                : 'bg-telegram-secondary-bg text-telegram-text'
            }`}
          >
            {message.isTyping ? (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-telegram-hint rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-telegram-hint rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-telegram-hint rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            )}
            <p className="text-xs mt-1 opacity-60">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}