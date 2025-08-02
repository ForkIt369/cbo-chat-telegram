import { useEffect, useState } from 'react'
import { TelegramProvider } from './hooks/useTelegram'
import ChatInterface from './components/ChatInterface'
import { ErrorBoundary } from './components/ErrorBoundary'
import './App.css'

// Version without Convex for testing
function AppNoConvex() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    console.log('[CBO Chat] App mounting (No Convex version)...')
    
    try {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()
        console.log('[CBO Chat] Telegram WebApp initialized')
      }
      
      setTimeout(() => setIsReady(true), 100)
    } catch (error) {
      console.error('[CBO Chat] Error:', error)
      setIsReady(true)
    }
  }, [])

  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-[#0A0E0A] flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#30D158] rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-[#30D158] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#30D158] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <TelegramProvider>
        <div className="h-screen w-screen overflow-hidden bg-[#0A0E0A] text-[#E5E7E5]">
          <ChatInterface />
        </div>
      </TelegramProvider>
    </ErrorBoundary>
  )
}

export default AppNoConvex