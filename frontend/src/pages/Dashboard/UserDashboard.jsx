import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ordersApi, reservationsApi } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import {
  ShoppingBag, Calendar, User, LogOut, Home,
  Clock, ChefHat, Package, CheckCircle, XCircle, Truck,
  Receipt, MapPin, Phone, Mail, Edit3
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  pending:   { label: 'En attente', icon: Clock,       color: '#f59e0b' },
  confirmed: { label: 'Confirmé',   icon: CheckCircle, color: '#3b82f6' },
  delivered: { label: 'Livré',      icon: Truck,       color: '#10b981' },
  cancelled: { label: 'Annulé',     icon: XCircle,     color: '#ef4444' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || STATUS_MAP.pending
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
          style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
      <Icon size={10} /> {cfg.label}
    </span>
  )
}

const TABS = [
  { id: 'orders',       label: 'Commandes',   icon: ShoppingBag },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'profile',      label: 'Mon Profil',  icon: User },
]

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      ordersApi.myOrders().catch(() => ({ data: { orders: [] } })),
      reservationsApi.myReservations().catch(() => ({ data: { reservations: [] } })),
    ]).then(([o, r]) => {
      setOrders(o.data?.orders || o.data || [])
      setReservations(r.data?.reservations || r.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await logout()
    toast.success('À bientôt !')
    navigate('/')
  }

  const totalSpent = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total_price) || Number(o.total) || 0), 0)

  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
             style={{ background: 'radial-gradient(circle, rgba(224,30,55,0.05) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-3xl"
             style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5"
              style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rouge flex items-center justify-center rounded-lg"
                 style={{ boxShadow: '0 0 12px rgba(224,30,55,0.35)' }}>
              <ChefHat size={15} className="text-blanc" />
            </div>
            <span className="font-playfair text-lg text-blanc font-bold">Le <span className="text-rouge">Chef</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-blanc/35 hover:text-blanc hover:bg-white/5 transition-all text-xs">
              <Home size={13} /> Accueil
            </Link>
            <div className="w-7 h-7 rounded-full bg-rouge/20 border border-rouge/30 flex items-center justify-center">
              <span className="text-rouge text-[10px] font-bold">{initials}</span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rouge/50 hover:text-rouge hover:bg-rouge/8 transition-all text-xs">
              <LogOut size={13} /> Déco.
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl p-6 mb-8"
          style={{
            background: 'linear-gradient(135deg, #1a0608 0%, #110507 100%)',
            border: '1px solid rgba(224,30,55,0.15)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(ellipse at top right, rgba(224,30,55,0.1) 0%, transparent 60%)' }} />
          <div className="absolute top-0 right-0 left-0 h-px"
               style={{ background: 'linear-gradient(90deg, transparent, rgba(224,30,55,0.4), transparent)' }} />

          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rouge/20 border border-rouge/30 flex items-center justify-center flex-shrink-0"
                   style={{ boxShadow: '0 0 20px rgba(224,30,55,0.15)' }}>
                <span className="font-playfair text-rouge text-xl font-bold">{initials}</span>
              </div>
              <div>
                <p className="text-blanc/40 text-xs tracking-widest uppercase mb-1">Espace client</p>
                <h1 className="font-playfair text-2xl text-blanc font-bold">
                  Bonjour, <span className="text-rouge">{user?.name?.split(' ')[0]}</span> !
                </h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blanc/25 text-[10px] uppercase tracking-widest">Dépenses totales</p>
              <p className="font-playfair text-2xl text-or font-bold">{totalSpent.toLocaleString()} FCFA</p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { icon: ShoppingBag, label: 'Commandes',   value: orders.length,                                            color: '#e01e37' },
            { icon: Calendar,    label: 'Réservations', value: reservations.length,                                      color: '#3b82f6' },
            { icon: Package,     label: 'En cours',    value: orders.filter(o => o.status === 'confirmed').length,       color: '#f59e0b' },
            { icon: CheckCircle, label: 'Livrées',     value: orders.filter(o => o.status === 'delivered').length,       color: '#10b981' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
              className="p-4 rounded-xl"
              style={{
                background: '#111',
                border: `1px solid ${color}20`,
              }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                   style={{ background: `${color}12` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <p className="text-blanc font-bold text-xl leading-none mb-1">{value}</p>
              <p className="text-blanc/35 text-[10px] uppercase tracking-wide">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
          style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: isActive ? 'rgba(224,30,55,0.18)' : 'transparent',
                  border: isActive ? '1px solid rgba(224,30,55,0.3)' : '1px solid transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
              >
                <Icon size={13} style={{ color: isActive ? '#e01e37' : undefined }} />
                {tab.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-7 h-7 rounded-full border-2 border-rouge/30 border-t-rouge" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Orders */}
            {activeTab === 'orders' && (
              <motion.div key="orders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-blanc/20">
                    <ShoppingBag size={44} className="mb-4 opacity-20" />
                    <p className="text-sm mb-6">Aucune commande pour l'instant</p>
                    <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate('/')}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: '#e01e37', color: '#fff' }}>
                      Voir notre menu
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, i) => (
                      <motion.div key={order.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, #111 0%, #0d0d0d 100%)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-rouge/10 border border-rouge/20 flex items-center justify-center">
                              <span className="text-rouge text-[10px] font-bold">#{order.id}</span>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-blanc/30 text-xs mb-1">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit', month: 'long', year: 'numeric'
                            }) : ''}
                          </p>
                          {order.items && Array.isArray(order.items) && (
                            <p className="text-blanc/25 text-xs line-clamp-1">
                              {order.items.map(it => it.name || it.product?.name).filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="sm:text-right">
                          <p className="font-playfair text-or font-bold text-lg">
                            {(Number(order.total_price) || Number(order.total) || 0).toLocaleString()} FCFA
                          </p>
                          <button className="flex items-center gap-1.5 text-blanc/20 hover:text-blanc/50 text-xs mt-1.5 sm:ml-auto transition-colors">
                            <Receipt size={11} /> Ticket
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Reservations */}
            {activeTab === 'reservations' && (
              <motion.div key="reservations"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                {reservations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-blanc/20">
                    <Calendar size={44} className="mb-4 opacity-20" />
                    <p className="text-sm mb-6">Aucune réservation</p>
                    <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate('/')}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: '#e01e37', color: '#fff' }}>
                      Réserver une table
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reservations.map((res, i) => (
                      <motion.div key={res.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, #111 0%, #0d0d0d 100%)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                              <span className="text-green-400 text-[10px] font-bold">#{res.id}</span>
                            </div>
                            <StatusBadge status={res.status} />
                          </div>
                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-blanc/35 text-xs">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-green-400/50" />
                              {res.date || '–'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock size={11} className="text-green-400/50" />
                              {res.time || '–'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <User size={11} className="text-green-400/50" />
                              {res.guests || 1} personne{(res.guests || 1) > 1 ? 's' : ''}
                            </span>
                          </div>
                          {res.message && (
                            <p className="text-blanc/20 text-xs italic mt-2">"{res.message}"</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <motion.div key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid sm:grid-cols-2 gap-5">

                {/* Profile card */}
                <div className="p-6 rounded-2xl relative overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, #141414 0%, #0d0d0d 100%)',
                       border: '1px solid rgba(255,255,255,0.07)',
                     }}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                       style={{ background: 'radial-gradient(circle at top right, rgba(224,30,55,0.07) 0%, transparent 70%)' }} />

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-rouge/15 border border-rouge/25 flex items-center justify-center"
                         style={{ boxShadow: '0 0 20px rgba(224,30,55,0.12)' }}>
                      <span className="font-playfair text-rouge text-2xl font-bold">{initials}</span>
                    </div>
                    <div>
                      <h3 className="text-blanc font-semibold">{user?.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block"
                            style={{
                              background: 'rgba(59,130,246,0.12)',
                              border: '1px solid rgba(59,130,246,0.25)',
                              color: '#3b82f6',
                            }}>
                        Client
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: Mail,  label: user?.email,   placeholder: 'Email' },
                      { icon: Phone, label: user?.phone,   placeholder: 'Téléphone' },
                      { icon: MapPin, label: 'Dakar, Sénégal', placeholder: 'Ville' },
                    ].map(({ icon: Icon, label, placeholder }) => (
                      <div key={placeholder} className="flex items-center gap-3 p-3 rounded-xl"
                           style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Icon size={13} className="text-blanc/25 flex-shrink-0" />
                        <span className="text-blanc/50 text-sm truncate">{label || placeholder}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats card */}
                <div className="p-6 rounded-2xl"
                     style={{
                       background: 'linear-gradient(135deg, #141414 0%, #0d0d0d 100%)',
                       border: '1px solid rgba(255,255,255,0.07)',
                     }}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 rounded-full bg-rouge" />
                    <h3 className="text-blanc font-semibold text-sm">Mon historique</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Total commandes',   value: orders.length,                                              color: '#e01e37' },
                      { label: 'Réservations',      value: reservations.length,                                        color: '#3b82f6' },
                      { label: 'En cours',          value: orders.filter(o => o.status === 'confirmed').length,        color: '#f59e0b' },
                      { label: 'Commandes livrées', value: orders.filter(o => o.status === 'delivered').length,        color: '#10b981' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between p-3 rounded-xl"
                           style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-blanc/40 text-sm">{label}</span>
                        </div>
                        <span className="font-bold text-blanc text-sm">{value}</span>
                      </div>
                    ))}

                    <div className="p-3 rounded-xl mt-2"
                         style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)' }}>
                      <p className="text-blanc/30 text-xs mb-1">Total dépensé (hors annulations)</p>
                      <p className="font-playfair text-or font-bold text-xl">{totalSpent.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <footer className="text-center py-8">
        <p className="text-blanc/8 text-[9px] tracking-[0.4em] uppercase">MULTI BRAIN TECH — Le Chef</p>
      </footer>
    </div>
  )
}
