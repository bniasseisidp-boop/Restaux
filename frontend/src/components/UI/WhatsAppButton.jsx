import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

const WHATSAPP_NUMBER = '221338241333'
const MESSAGES = [
  { label: 'Commander maintenant', msg: 'Bonjour Le Chef ! Je voudrais passer une commande.' },
  { label: 'Réserver une table', msg: 'Bonjour ! Je souhaite réserver une table au restaurant Le Chef.' },
  { label: 'Renseignements', msg: 'Bonjour Le Chef ! J\'ai quelques questions à vous poser.' },
]

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  const sendMessage = (msg) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Options panel */}
      {open && (
        <div className="bg-noir-700 border border-white/10 rounded-lg overflow-hidden shadow-2xl w-64 animate-slide-up">
          <div className="bg-[#25D366] px-4 py-3 flex items-center gap-3">
            <MessageCircle size={20} className="text-white" />
            <div>
              <p className="text-white text-sm font-bold">Restaurant Le Chef</p>
              <p className="text-white/80 text-xs">En ligne</p>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {MESSAGES.map((item) => (
              <button
                key={item.label}
                onClick={() => sendMessage(item.msg)}
                className="text-left text-sm text-blanc/80 hover:text-blanc bg-noir-600 hover:bg-noir-500 px-3 py-2.5 rounded transition-colors duration-200 border border-white/5"
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-blanc/30 text-xs text-center pb-3">
            Réponse rapide garantie
          </p>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className="whatsapp-btn w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-2xl hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110"
        aria-label="Contact WhatsApp"
      >
        {open
          ? <X size={24} className="text-white" />
          : <MessageCircle size={26} className="text-white" />
        }
      </button>
    </div>
  )
}
