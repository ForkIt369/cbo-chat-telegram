import { useEffect, useState } from 'react'
import { TelegramProvider } from './hooks/useTelegram'
import { ConvexClientProvider } from './providers/ConvexProvider'
import ChatInterface from './components/ChatInterface'
import './App.css'

function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Ensure Telegram WebApp is ready
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
      
      // Set theme colors
      const tg = window.Telegram.WebApp
      if (tg.themeParams) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#0A0E0A')
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#E5E7E5')
      }
      
      // Small delay to prevent flash
      setTimeout(() => setIsReady(true), 100)
    } else {
      // For web testing
      setIsReady(true)
    }
  }, [])

  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-[var(--cbo-bg-dark)] flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[var(--cbo-primary)] rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-[var(--cbo-primary)] rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-[var(--cbo-primary)] rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    )
  }

  return (
    <ConvexClientProvider>
      <TelegramProvider>
        <div className="h-screen w-screen overflow-hidden bg-[var(--cbo-bg-dark)] text-[var(--cbo-text-primary)]">
          <ChatInterface />
        </div>
      </TelegramProvider>
    </ConvexClientProvider>
  )
}

export default App