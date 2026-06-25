import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
             style={{ background: '#080808' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
               style={{ background: 'rgba(224,30,55,0.12)', border: '1px solid rgba(224,30,55,0.25)' }}>
            <AlertTriangle size={28} style={{ color: '#e01e37' }} />
          </div>
          <div className="text-center max-w-md">
            <h2 className="font-playfair text-2xl text-blanc font-bold mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {this.state.error?.message || 'Erreur inconnue'}
            </p>
            <p className="text-xs font-mono px-4 py-2 rounded-lg mb-6 text-left overflow-auto max-h-24"
               style={{ background: 'rgba(224,30,55,0.06)', color: 'rgba(255,100,80,0.8)', border: '1px solid rgba(224,30,55,0.15)' }}>
              {this.state.error?.stack?.split('\n').slice(0, 3).join('\n')}
            </p>
          </div>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#e01e37', color: '#fff' }}
          >
            <RefreshCw size={14} /> Recharger la page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
