import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, Briefcase, Heart, Star, Zap, Crown, X, Plus, Minus, ShoppingBag, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { ordersApi } from '../../utils/api'
import toast from 'react-hot-toast'

gsap.registerPlugin(ScrollTrigger)

const PACKS = [
  {
    id: 1,
    icon: Zap,
    name: 'Pack Express',
    subtitle: 'Midi en vitesse',
    price: '5 000',
    duration: 'Servi en 20 min',
    color: '#e01e37',
    items: ['Plat du jour', 'Boisson fraîche', 'Dessert maison', 'Pain artisanal'],
    image: '/images/pr1.jpg',
    desc: 'Idéal pour les pauses déjeuner courtes. Rapide, savoureux, complet.'
  },
  {
    id: 2,
    icon: Users,
    name: 'Pack Famille',
    subtitle: 'Partagez en famille',
    price: '18 000',
    duration: 'Pour 4 personnes',
    color: '#d4a017',
    items: ['2 Entrées au choix', '4 Plats principaux', '4 Desserts', '4 Boissons', 'Pain garni'],
    image: '/images/pr2.jpg',
    desc: 'Le plaisir du partage. Une sélection généreuse pour toute la famille.'
  },
  {
    id: 3,
    icon: Heart,
    name: 'Pack Romantique',
    subtitle: 'Soirée inoubliable',
    price: '25 000',
    duration: 'Pour 2 personnes',
    color: '#ff0038',
    items: ['Champagne d\'accueil', '2 Entrées raffinées', '2 Plats gastronomiques', 'Dessert duo', 'Déco table incluse'],
    image: '/images/acc.jpg',
    desc: 'Table décorée, bougies, ambiance tamisée. Le pack idéal pour les occasions spéciales.'
  },
  {
    id: 4,
    icon: Briefcase,
    name: 'Pack Business',
    subtitle: 'Déjeuner professionnel',
    price: '12 000',
    duration: 'Pour 2 personnes',
    color: '#4a9eff',
    items: ['Entrée du chef', '2 Plats signature', '2 Boissons premium', 'Café ou thé', 'Salle privée possible'],
    image: '/images/pr1.jpg',
    desc: 'Impressionnez vos clients dans un cadre élégant et discret.'
  },
  {
    id: 5,
    icon: Star,
    name: 'Pack Weekend',
    subtitle: 'Brunch du dimanche',
    price: '8 500',
    duration: 'Sam. & Dim.',
    color: '#00c896',
    items: ['Buffet d\'entrées', 'Plat principal', 'Jus frais pressé', 'Pâtisserie maison', 'Café gourmand'],
    image: '/images/pr2.jpg',
    desc: 'Le brunch dominical tant attendu. Détente, gourmandise et bonne humeur garanties.'
  },
  {
    id: 6,
    icon: Crown,
    name: 'Pack VIP',
    subtitle: 'L\'expérience ultime',
    price: '45 000',
    duration: 'Sur réservation',
    color: '#d4a017',
    items: ['Menu 5 services', 'Vins sélectionnés', 'Chef à table', 'Transfert possible', 'Cadeau souvenir'],
    image: '/images/acc.jpg',
    desc: 'L\'expérience gastronomique absolue. Le chef crée un menu personnalisé rien que pour vous.'
  },
]

/* ─── Pack Order Modal ─── */
function PackOrderModal({ pack, user, onClose }) {
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const priceNum = parseInt(pack.price.replace(/\s/g, ''), 10)
  const total = priceNum * qty

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await ordersApi.create({
        user_name: user.name,
        user_email: user.email,
        items: [{ name: pack.name, price: priceNum, quantity: qty, type: 'pack' }],
        notes: notes.trim() || null,
        delivery_type: 'dine-in',
      })
      setSuccess(true)
      toast.success('Commande envoyée ! L\'admin va la confirmer.')
      setTimeout(() => onClose(), 2800)
    } catch {
      toast.error('Erreur lors de la commande. Réessayez.')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-black/75" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden z-10"
          initial={{ scale: 0.92, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          style={{ background: 'linear-gradient(145deg, #141414, #0c0c0c)', border: `1px solid ${pack.color}33` }}
        >
          <div className="relative p-5 pb-3" style={{ borderBottom: `3px solid ${pack.color}` }}>
            <button onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <X size={13} className="text-blanc" />
            </button>
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
              style={{ background: `${pack.color}20`, border: `1px solid ${pack.color}40` }}>
              {(() => { const IconComp = pack.icon; return <IconComp size={18} style={{ color: pack.color }} /> })()}
            </div>
            <p className="font-playfair text-lg text-blanc font-bold">{pack.name}</p>
            <p style={{ color: pack.color }} className="text-sm font-bold">{pack.price} FCFA / unité</p>
          </div>

          <div className="p-5">
            {!success ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-blanc/60 text-sm">Quantité</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${pack.color}15`, border: `1px solid ${pack.color}30` }}>
                      <Minus size={13} style={{ color: pack.color }} />
                    </button>
                    <span className="text-blanc font-bold text-lg w-6 text-center">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${pack.color}15`, border: `1px solid ${pack.color}30` }}>
                      <Plus size={13} style={{ color: pack.color }} />
                    </button>
                  </div>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Instructions spéciales (optionnel)..."
                  rows={2}
                  className="w-full text-sm rounded-lg px-3 py-2.5 mb-5 resize-none focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blanc/40 text-xs uppercase tracking-wide">Total</span>
                  <span className="text-blanc font-bold text-xl">{total.toLocaleString()} FCFA</span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-blanc text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all"
                  style={{ background: loading ? `${pack.color}80` : pack.color }}>
                  {loading
                    ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-blanc/30 border-t-blanc rounded-full" />
                    : <><ShoppingBag size={15} /> Commander</>}
                </button>
              </>
            ) : (
              <motion.div className="flex flex-col items-center py-6 gap-3"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}>
                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                </motion.div>
                <p className="font-playfair text-lg text-blanc font-bold">Commande envoyée !</p>
                <p className="text-blanc/40 text-sm text-center">L'admin va confirmer votre commande sous peu.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function PackCard({ pack, index, onOrder }) {
  const cardRef = useRef(null)
  const IconComp = pack.icon

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 60, rotateX: 15 },
      {
        opacity: 1, y: 0, rotateX: 0, duration: 0.8,
        ease: 'power3.out',
        delay: (index % 3) * 0.15,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
        }
      }
    )
  }, [index])

  return (
    <div ref={cardRef} className="pack-card h-80">
      <div className="pack-card-inner h-full">
        {/* Front */}
        <div className="pack-card-front h-full relative overflow-hidden rounded-2xl bg-noir-700 border border-white/5"
             style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.4)` }}>
          <img
            src={pack.image}
            alt={pack.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/70 to-transparent" />
          <div
            className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
            style={{ background: pack.color }}
          />
          <div className="relative h-full flex flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${pack.color}20`, border: `1px solid ${pack.color}40` }}
              >
                <IconComp size={18} style={{ color: pack.color }} />
              </div>
              <span className="text-blanc/30 text-xs tracking-widest uppercase">{pack.duration}</span>
            </div>
            <div>
              <h3 className="font-playfair text-2xl text-blanc font-bold mb-1">{pack.name}</h3>
              <p className="text-blanc/50 text-sm mb-4">{pack.subtitle}</p>
              <div className="flex items-end justify-between">
                <p className="text-blanc/40 text-xs">À partir de</p>
                <p className="font-bold text-xl" style={{ color: pack.color }}>{pack.price} FCFA</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-blanc/20 text-[10px] tracking-widest">
            Survolez pour voir
          </div>
        </div>

        {/* Back */}
        <div
          className="pack-card-back h-full flex flex-col justify-between p-6 rounded-2xl bg-noir-700"
          style={{ borderTop: `3px solid ${pack.color}`, boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${pack.color}15` }}
        >
          <div>
            <p className="text-blanc/60 text-sm leading-relaxed mb-4">{pack.desc}</p>
            <ul className="space-y-2">
              {pack.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-blanc/80">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: pack.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 8px 20px ${pack.color}50` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOrder(pack)}
              className="flex-1 py-2.5 rounded-xl text-xs text-blanc font-semibold tracking-widets uppercase transition-all"
              style={{ background: pack.color, boxShadow: `0 4px 14px ${pack.color}40` }}
            >
              Commander
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold tracking-widets uppercase border transition-all hover:bg-white/5"
              style={{ borderColor: `${pack.color}50`, color: pack.color }}
            >
              Réserver
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Packs() {
  const headerRef = useRef(null)
  const [orderPack, setOrderPack] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: headerRef.current, start: 'top 80%' } }
    )
  }, [])

  const handleOrder = (pack) => {
    if (user) {
      setOrderPack(pack)
    } else {
      const msg = `Bonjour ! Je voudrais commander le ${pack.name} à ${pack.price} FCFA.`
      window.open(`https://wa.me/221338241333?text=${encodeURIComponent(msg)}`, '_blank')
    }
  }

  return (
    <section id="packs" className="py-24 bg-noir-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(224,30,55,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={headerRef} className="mb-16">
          <span className="section-label">Nos Formules</span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="section-title">
              Des Packs pour <span className="text-gradient-red italic">Chaque Occasion</span>
            </h2>
            <p className="text-blanc/50 max-w-md text-sm leading-relaxed">
              Survolez chaque pack pour découvrir le détail complet.
              Commandez directement via WhatsApp ou réservez en ligne.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKS.map((pack, i) => (
            <PackCard key={pack.id} pack={pack} index={i} onOrder={handleOrder} />
          ))}
        </div>
      </div>

      {orderPack && (
        <PackOrderModal
          pack={orderPack}
          user={user}
          onClose={() => setOrderPack(null)}
        />
      )}
    </section>
  )
}
