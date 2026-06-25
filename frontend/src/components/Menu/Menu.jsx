import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flame, X, Plus, Minus, CheckCircle, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { ordersApi } from '../../utils/api'
import toast from 'react-hot-toast'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = ['Tous', 'Entrées', 'Plats', 'Grillades', 'Desserts', 'Boissons']

const DISHES = [
  {
    id: 1, name: 'Thiéboudienne Royal', category: 'Plats', price: '4 500',
    desc: 'Le plat national sénégalais revisité avec poisson frais, légumes du jardin et riz parfumé.',
    tag: 'Best-Seller', image: '/images/pr1.jpg'
  },
  {
    id: 2, name: 'Yassa Poulet', category: 'Plats', price: '3 800',
    desc: 'Poulet mariné à l\'oignon caramélisé, citron confit, olives noires. Servi avec riz blanc.',
    tag: 'Populaire', image: '/images/pr2.jpg'
  },
  {
    id: 3, name: 'Mafé Bœuf', category: 'Plats', price: '4 200',
    desc: 'Ragoût de bœuf à la pâte d\'arachide, légumes fondants, épices secrètes de la maison.',
    tag: null, image: '/images/acc.jpg'
  },
  {
    id: 4, name: 'Brochettes Mixtes', category: 'Grillades', price: '5 000',
    desc: 'Assortiment de brochettes bœuf-agneau-poulet marinées aux herbes, flambées sur charbon.',
    tag: 'Chef recommande', image: '/images/pr1.jpg'
  },
  {
    id: 5, name: 'Salade Le Chef', category: 'Entrées', price: '2 500',
    desc: 'Roquette, tomates cerises, avocat, crevettes grillées, vinaigrette maison.',
    tag: null, image: '/images/pr2.jpg'
  },
  {
    id: 6, name: 'Accra de Crevettes', category: 'Entrées', price: '2 000',
    desc: 'Beignets croustillants de crevettes fraîches, sauce tartare maison.',
    tag: 'Nouveau', image: '/images/acc.jpg'
  },
  {
    id: 7, name: 'Fondant Chocolat', category: 'Desserts', price: '1 800',
    desc: 'Fondant chocolat noir coulant, crème vanillée, éclats de praline.',
    tag: null, image: '/images/pr1.jpg'
  },
  {
    id: 8, name: 'Bissap Royal', category: 'Boissons', price: '800',
    desc: 'Hibiscus infusé, eau de rose, menthe fraîche, glace pilée. Signature de la maison.',
    tag: 'Maison', image: '/images/pr2.jpg'
  },
]

/* ─── Order Modal (module level, not inside another component) ─── */
function OrderModal({ dish, user, onClose }) {
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const priceNum = parseInt(dish.price.replace(/\s/g, ''), 10)
  const total = priceNum * qty

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await ordersApi.create({
        user_name: user.name,
        user_email: user.email,
        items: [{ name: dish.name, price: priceNum, quantity: qty, type: 'product' }],
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
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/75" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden z-10"
          initial={{ scale: 0.92, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          style={{ background: 'linear-gradient(145deg, #141414, #0c0c0c)', border: '1px solid rgba(224,30,55,0.2)' }}
        >
          {/* Image header */}
          <div className="relative h-40 overflow-hidden">
            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <X size={13} className="text-blanc" />
            </button>
            <div className="absolute bottom-3 left-4">
              <p className="font-playfair text-lg text-blanc font-bold">{dish.name}</p>
              <p className="text-rouge text-sm font-bold">{dish.price} FCFA / unité</p>
            </div>
          </div>

          <div className="p-5">
            {!success ? (
              <>
                {/* Quantity */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-blanc/60 text-sm">Quantité</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(224,30,55,0.12)', border: '1px solid rgba(224,30,55,0.25)' }}
                    >
                      <Minus size={13} className="text-rouge" />
                    </button>
                    <span className="text-blanc font-bold text-lg w-6 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(224,30,55,0.12)', border: '1px solid rgba(224,30,55,0.25)' }}
                    >
                      <Plus size={13} className="text-rouge" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Instructions spéciales (optionnel)..."
                  rows={2}
                  className="w-full text-sm rounded-lg px-3 py-2.5 mb-5 resize-none focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />

                {/* Total + submit */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blanc/40 text-xs uppercase tracking-wide">Total</span>
                  <span className="text-blanc font-bold text-xl">{total.toLocaleString()} FCFA</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-blanc text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2"
                  style={{
                    background: loading ? 'rgba(224,30,55,0.5)' : '#e01e37',
                    boxShadow: loading ? 'none' : '0 0 20px rgba(224,30,55,0.35)',
                  }}
                >
                  {loading
                    ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-blanc/30 border-t-blanc rounded-full" />
                    : <><ShoppingBag size={15} /> Commander</>
                  }
                </button>
              </>
            ) : (
              <motion.div
                className="flex flex-col items-center py-6 gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}
                >
                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                </motion.div>
                <p className="font-playfair text-lg text-blanc font-bold">Commande envoyée !</p>
                <p className="text-blanc/40 text-sm text-center">
                  L'admin va confirmer votre commande sous peu.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── Dish Card ─── */
function DishCard({ dish, index, onOrder }) {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.7,
        ease: 'power3.out',
        delay: (index % 4) * 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
        }
      }
    )
  }, [index])

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(224,30,55,0.18)' }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-2xl bg-noir-700 border border-white/5 transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden rounded-t-2xl">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/20 to-transparent" />
        {dish.tag && (
          <span className="absolute top-3 right-3 bg-rouge text-blanc text-[10px] px-3 py-1 rounded-full font-semibold tracking-widest uppercase"
                style={{ boxShadow: '0 0 10px rgba(224,30,55,0.4)' }}>
            {dish.tag}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-playfair text-lg text-blanc font-bold">{dish.name}</h3>
          <span className="text-rouge font-bold whitespace-nowrap text-sm">{dish.price} FCFA</span>
        </div>
        <p className="text-blanc/50 text-sm leading-relaxed mb-4">{dish.desc}</p>
        <motion.button
          whileHover={{ scale: 1.02, x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onOrder(dish)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-widest uppercase font-semibold transition-all"
          style={{ background: 'rgba(224,30,55,0.1)', border: '1px solid rgba(224,30,55,0.25)', color: '#e01e37' }}
        >
          <Flame size={13} /> Commander
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [orderDish, setOrderDish] = useState(null)
  const titleRef = useRef(null)
  const headerRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    gsap.fromTo([headerRef.current, titleRef.current],
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.2,
        scrollTrigger: { trigger: headerRef.current, start: 'top 80%' }
      }
    )
  }, [])

  const handleOrder = (dish) => {
    if (user) {
      setOrderDish(dish)
    } else {
      const msg = `Bonjour Le Chef ! Je souhaite commander: ${dish.name} (${dish.price} FCFA)`
      window.open(`https://wa.me/221338241333?text=${encodeURIComponent(msg)}`, '_blank')
    }
  }

  const filtered = activeCategory === 'Tous'
    ? DISHES
    : DISHES.filter(d => d.category === activeCategory)

  return (
    <section id="menu" className="py-24 bg-noir-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <span className="section-label">Notre Carte</span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 ref={titleRef} className="section-title">
              Saveurs <span className="text-gradient-red italic">Authentiques</span>
            </h2>
            <p className="text-blanc/50 max-w-md text-sm leading-relaxed">
              Chaque plat est préparé avec passion, utilisant des ingrédients frais
              sélectionnés chaque matin auprès de nos producteurs locaux.
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-12 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs tracking-widest uppercase font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-rouge text-blanc'
                  : 'border border-white/10 text-blanc/50 hover:text-blanc hover:border-rouge/50'
              }`}
              style={{ boxShadow: activeCategory === cat ? '0 0 14px rgba(224,30,55,0.35)' : 'none' }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} index={i} onOrder={handleOrder} />
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-16 text-center">
          <p className="text-blanc/40 text-sm mb-4">
            Vous avez des questions ou envies spéciales ?
          </p>
          <a
            href="https://wa.me/221338241333?text=Bonjour%20Le%20Chef%20!%20J'ai%20une%20question%20sur%20votre%20menu."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            Contactez le Chef via WhatsApp
          </a>
        </div>
      </div>

      {/* Order modal */}
      {orderDish && (
        <OrderModal
          dish={orderDish}
          user={user}
          onClose={() => setOrderDish(null)}
        />
      )}
    </section>
  )
}
