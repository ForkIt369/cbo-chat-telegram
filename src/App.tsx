import { useEffect, useState } from 'react'
import { TelegramProvider } from './hooks/useTelegram'
import { ConvexClientProvider } from './providers/ConvexProvider'
import ChatInterface from './components/ChatInterface'
import { ErrorBoundary } from './components/ErrorBoundary'
import './App.css'

// Debug logging
const log = (msg: string, data?: any) => {
  console.log(`[CBO Chat] ${msg}`, data || '')
}

function App() {
  const [isReady, setIsReady] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    log('App mounting...')
    
    try {
      // Check environment
      const isInTelegram = window.Telegram?.WebApp !== undefined
      log('Environment check:', {
        hasTelegram: !!window.Telegram,
        hasWebApp: !!window.Telegram?.WebApp,
        href: window.location.href,
        userAgent: navigator.userAgent
      })
      
      if (isInTelegram) {
        const tg = window.Telegram.WebApp
        log('Telegram WebApp found:', {
          version: tg.version,
          platform: tg.platform,
          colorScheme: tg.colorScheme,
          viewportHeight: tg.viewportHeight,
          isExpanded: tg.isExpanded
        })
        
        // Initialize
        tg.ready()
        tg.expand()
        
        // Set theme colors
        if (tg.themeParams) {
          const theme = tg.themeParams
          log('Theme params:', theme)
          
          if (theme.bg_color) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bg_color)
            document.documentElement.style.setProperty('--cbo-bg-dark', theme.bg_color)
          }
          if (theme.text_color) {
            document.documentElement.style.setProperty('--tg-theme-text-color', theme.text_color)
            document.documentElement.style.setProperty('--cbo-text-primary', theme.text_color)
          }
        }
        
        setDebugInfo(`Telegram v${tg.version} on ${tg.platform}`)
      } else {
        log('Not in Telegram, running in browser mode')
        setDebugInfo('Browser mode')
      }
      
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        log('App ready!')
        setIsReady(true)
      }, 100)
      
    } catch (error) {
      console.error('[CBO Chat] Initialization error:', error)
      setDebugInfo(`Error: ${error}`)
      // Still show the app even if there's an error
      setIsReady(true)
    }
    
    return () => {
      log('App unmounting')
    }
  }, [])

  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-[#0A0E0A] flex flex-col items-center justify-center">
        <div className="flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-[#30D158] rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-[#30D158] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#30D158] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-[#6B7C6B] text-xs">{debugInfo}</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <ConvexClientProvider>
        <TelegramProvider>
          <div className="h-screen w-screen overflow-hidden bg-[#0A0E0A] text-[#E5E7E5]">
            <ChatInterface />
            {/* Debug info in corner */}
            {debugInfo && (
              <div className="absolute top-0 right-0 p-2 text-[8px] text-[#6B7C6B] opacity-50">
                {debugInfo}
              </div>
            )}
          </div>
        </TelegramProvider>
      </ConvexClientProvider>
    </ErrorBoundary>
  )
}

export default App