import { TelegramProvider } from './hooks/useTelegram'
import ChatInterface from './components/ChatInterface'
import './App.css'

function App() {
  return (
    <TelegramProvider>
      <div className="min-h-screen bg-telegram-bg text-telegram-text flex flex-col">
        <ChatInterface />
      </div>
    </TelegramProvider>
  )
}

export default App