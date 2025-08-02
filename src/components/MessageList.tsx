import { Message } from '../services/cbo-bro'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${
            index === messages.length - 1 ? 'animate-fadeIn' : ''
          }`}
        >
          <div className="flex items-end space-x-2 max-w-[85%]">
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--cbo-primary)] to-[var(--cbo-primary-dark)] flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-xs font-bold text-black">CB</span>
              </div>
            )}
            
            <div
              className={`rounded-2xl px-4 py-3 shadow-sm transition-all ${
                message.sender === 'user'
                  ? 'bg-[var(--cbo-primary)] text-black rounded-br-sm animate-slideInRight'
                  : message.isError
                  ? 'bg-red-900/20 text-red-400 border border-red-800/30 rounded-bl-sm'
                  : 'glass text-[var(--cbo-text-primary)] rounded-bl-sm animate-slideInLeft'
              }`}
            >
              {message.isTyping ? (
                <div className="flex items-center space-x-1 py-1">
                  <div className="w-2 h-2 bg-[var(--cbo-text-secondary)] rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-[var(--cbo-text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-[var(--cbo-text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  {message.insights && message.insights.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.insights.map((insight, i) => (
                        <div 
                          key={i} 
                          className="p-2 rounded-lg bg-[var(--cbo-bg-secondary)] border border-[var(--cbo-border)]"
                        >
                          <p className="text-xs font-medium text-[var(--cbo-primary)]">{insight.type}</p>
                          <p className="text-xs text-[var(--cbo-text-secondary)] mt-1">{insight.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-xs font-semibold text-white">
                  {message.sender === 'user' ? 'You' : 'CB'}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}