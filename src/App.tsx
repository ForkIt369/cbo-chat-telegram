import { TelegramProvider } from './hooks/useTelegram'
import { ConvexClientProvider } from './providers/ConvexProvider'
import ChatInterface from './components/ChatInterface'
import './App.css'

function App() {
  return (
    <ConvexClientProvider>
      <TelegramProvider>
        <div className="min-h-screen bg-telegram-bg text-telegram-text flex flex-col">
          <ChatInterface />
        </div>
      </TelegramProvider>
    </ConvexClientProvider>
  )
}

export default App