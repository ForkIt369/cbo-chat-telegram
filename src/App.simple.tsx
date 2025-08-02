import { useEffect, useState } from 'react'
import './index.css'

function SimpleApp() {
  const [status, setStatus] = useState('Initializing...')
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      // Check if Telegram WebApp is available
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()
        setStatus(`✅ Telegram WebApp v${tg.version} ready!`)
      } else {
        setStatus('⚠️ Not running in Telegram')
      }
    } catch (e: any) {
      setError(e.message)
      setStatus('❌ Error initializing')
    }
  }, [])

  const sendMessage = async () => {
    if (!message.trim()) return
    
    try {
      setResponse('Thinking...')
      // Simple echo for testing
      setTimeout(() => {
        setResponse(`Echo: ${message}`)
      }, 1000)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E0A] text-[#E5E7E5] p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-[#30D158]">CBO Chat</h1>
          <p className="text-sm text-gray-400 mt-2">{status}</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400 text-sm">Error: {error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-[#1A1F1A] rounded-lg p-4">
            <p className="text-sm">Welcome! This is a simple test version.</p>
          </div>

          {response && (
            <div className="bg-[#1A1F1A] rounded-lg p-4">
              <p className="text-sm">{response}</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0E0A] border-t border-[#2A352A]">
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-[#1A1F1A] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#30D158]"
            />
            <button
              onClick={sendMessage}
              className="bg-[#30D158] text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleApp