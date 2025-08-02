import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0E0A] text-[#E5E7E5] p-4">
          <div className="max-w-md mx-auto">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 mt-8">
              <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
              <details className="text-sm">
                <summary className="cursor-pointer text-red-300 mb-2">Error details</summary>
                <pre className="bg-black/50 p-4 rounded mt-2 overflow-auto text-xs">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}