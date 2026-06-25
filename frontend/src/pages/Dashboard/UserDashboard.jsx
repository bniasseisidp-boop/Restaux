import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ordersApi, reservationsApi } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ac } from '../../utils/adminTheme'
import {
  ShoppingBag, Calendar, User, LogOut, Home,
  Clock, ChefHat, Package, CheckCircle, XCircle, Truck,
  Receipt, MapPin, Phone, Mail, DollarSign, CreditCard, AlertCircle, Download,
  Sun, Moon
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

function printOrderReceipt(order, user) {
  const win = window.open('', '_blank', 'width=420,height=680')
  if (!win) return
  const date = order.created_at
    ? new Date(order.created_at).toLocaleString('fr-FR')
    : new Date().toLocaleString('fr-FR')
  const items = Array.isArray(order.items) ? order.items : []
  const total = Number(order.total_price) || Number(order.total) || 0

  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Reçu #${order.id}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Georgia, serif; padding: 28px; max-width: 360px; margin: 0 auto; color: #111; }
  h1 { text-align:center; font-size:22px; letter-spacing:2px; color:#e01e37; margin-bottom:2px; }
  .center { text-align:center; }
  .sub { font-size:11px; color:#666; }
  .divider { border-top:2px solid #e01e37; margin: 14px 0; }
  .dashed { border-top:1px dashed #ccc; margin: 10px 0; }
  .row { display:flex; justify-content:space-between; font-size:13px; padding: 4px 0; }
  .label { color:#666; }
  .value { font-weight:600; }
  .item-row { display:flex; justify-content:space-between; font-size:12px; padding: 5px 0; border-bottom:1px solid #f0f0f0; }
  .total-box { background:#fff5f5; border:2px solid #e01e37; border-radius:8px; padding:12px 16px; margin:14px 0; display:flex; justify-content:space-between; align-items:center; }
  .total-label { font-size:13px; color:#666; }
  .total-amount { font-size:22px; font-weight:bold; color:#e01e37; }
  .status-ok { display:inline-block; background:#d1fae5; border:1px solid #10b981; color:#065f46; font-size:11px; padding:4px 12px; border-radius:20px; font-weight:600; }
  .footer { text-align:center; font-size:11px; color:#888; margin-top:18px; }
  @media print { body { padding: 10px; } }
</style></head>
<body>
  <h1>★ LE CHEF ★</h1>
  <p class="center sub">Restaurant & Café • Dieuppeul I, Dakar</p>
  <p class="center sub">+221 33 824 13 33</p>
  <div class="divider"></div>
  <p style="text-align:center;font-weight:600;font-size:14px;letter-spacing:1px;">REÇU DE COMMANDE</p>
  <p style="text-align:center;font-size:11px;color:#999;margin-top:3px;">N° ${order.id} • ${date}</p>
  <div class="dashed"></div>
  <div class="row"><span class="label">Client</span><span class="value">${user?.name || order.user_name || '–'}</span></div>
  <div class="row"><span class="label">E-mail</span><span class="value">${user?.email || '–'}</span></div>
  <div class="row"><span class="label">Type</span><span class="value">${order.delivery_type === 'delivery' ? 'Livraison' : 'Sur place'}</span></div>
  <div class="dashed"></div>
  <p style="font-size:11px;color:#888;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Articles commandés</p>
  ${items.map(it => `
    <div class="item-row">
      <span>${it.name || it.product?.name || '–'} × ${it.quantity || 1}</span>
      <span>${Number((it.price || 0) * (it.quantity || 1)).toLocaleString('fr-FR')} F</span>
    </div>`).join('') || '<p style="font-size:12px;color:#aaa;padding:6px 0">Détails non disponibles</p>'}
  <div class="total-box">
    <span class="total-label">TOTAL</span>
    <span class="total-amount">${total.toLocaleString('fr-FR')} FCFA</span>
  </div>
  <div style="text-align:center;margin:8px 0">
    <span class="status-ok">✓ ${order.status === 'delivered' ? 'LIVRÉ' : 'CONFIRMÉ'}</span>
  </div>
  <div class="divider"></div>
  <div class="footer">
    <p>Merci de votre confiance !</p>
    <p style="margin-top:6px;color:#e01e37">★ Restaurant Le Chef ★</p>
    <p style="margin-top:4px;color:#bbb;font-size:9px;letter-spacing:2px">MULTI BRAIN TECH</p>
  </div>
  <script>window.onload = () => window.print()<\/script>
</body></html>`)
  win.document.close()
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const { isDark, toggle: toggleTheme } = useTheme()
  const t = ac(isDark)
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
    <div className="min-h-screen" style={{ background: t.pageBg, color: t.text }}>
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
             style={{ background: 'radial-gradient(circle, rgba(224,30,55,0.05) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-3xl"
             style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b"
              style={{ background: isDark ? 'rgba(10,10,10,0.95)' : 'rgba(245,241,235,0.95)', backdropFilter: 'blur(12px)', borderColor: t.cardBorder }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rouge flex items-center justify-center rounded-lg"
                 style={{ boxShadow: '0 0 12px rgba(224,30,55,0.35)' }}>
              <ChefHat size={15} className="text-blanc" />
            </div>
            <span className="font-playfair text-lg font-bold" style={{ color: t.text }}>Le <span className="text-rouge">Chef</span></span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Thème clair' : 'Thème sombre'}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', border: `1px solid ${t.cardBorder}` }}
            >
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                    style={{ opacity: isDark ? 1 : 0, transform: isDark ? 'scale(1)' : 'scale(0) rotate(90deg)' }}>
                <Sun size={14} style={{ color: '#d4a017' }} />
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                    style={{ opacity: isDark ? 0 : 1, transform: isDark ? 'scale(0) rotate(-90deg)' : 'scale(1)' }}>
                <Moon size={14} style={{ color: '#d91830' }} />
              </span>
            </button>
            <Link to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-xs"
              style={{ color: t.textMuted }}>
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
            background: isDark ? 'linear-gradient(135deg, #1a0608 0%, #110507 100%)' : 'linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)',
            border: `1px solid rgba(224,30,55,${isDark ? '0.15' : '0.2'})`,
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
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: t.textMuted }}>Espace client</p>
                <h1 className="font-playfair text-2xl font-bold" style={{ color: t.text }}>
                  Bonjour, <span className="text-rouge">{user?.name?.split(' ')[0]}</span> !
                </h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: t.textFaint }}>Dépenses totales</p>
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
                background: t.cardBg2,
                border: `1px solid ${color}25`,
              }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                   style={{ background: `${color}12` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <p className="font-bold text-xl leading-none mb-1" style={{ color: t.text }}>{value}</p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: t.textMuted }}>{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
          style={{ background: t.cardBg2, border: `1px solid ${t.cardBorder}` }}
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
                  color: isActive ? t.text : t.textMuted,
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
                  <div className="flex flex-col items-center justify-center py-20" style={{ color: t.textFaint }}>
                    <ShoppingBag size={44} className="mb-4 opacity-30" />
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
                          background: t.cardBg,
                          border: `1px solid ${t.cardBorder}`,
                        }}>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-rouge/10 border border-rouge/20 flex items-center justify-center">
                              <span className="text-rouge text-[10px] font-bold">#{order.id}</span>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-xs mb-1" style={{ color: t.textMuted }}>
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit', month: 'long', year: 'numeric'
                            }) : ''}
                          </p>
                          {order.items && Array.isArray(order.items) && (
                            <p className="text-xs line-clamp-1" style={{ color: t.textFaint }}>
                              {order.items.map(it => it.name || it.product?.name).filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="sm:text-right flex-shrink-0">
                          <p className="font-playfair text-or font-bold text-lg">
                            {(Number(order.total_price) || Number(order.total) || 0).toLocaleString()} FCFA
                          </p>
                          {(order.status === 'confirmed' || order.status === 'delivered') && (
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => printOrderReceipt(order, user)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mt-2 sm:ml-auto transition-all"
                              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
                              <Download size={11} /> Télécharger reçu
                            </motion.button>
                          )}
                          {order.status === 'pending' && (
                            <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: 'rgba(245,158,11,0.7)' }}>
                              <Clock size={9} /> En attente de confirmation
                            </p>
                          )}
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
                  <div className="flex flex-col items-center justify-center py-20" style={{ color: t.textFaint }}>
                    <Calendar size={44} className="mb-4 opacity-30" />
                    <p className="text-sm mb-6">Aucune réservation</p>
                    <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate('/')}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: '#e01e37', color: '#fff' }}>
                      Réserver une table
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reservations.map((res, i) => {
                      const payStatus = res.payment_status || 'unpaid'
                      const payConfig = {
                        unpaid:  { label: 'Non payé',       color: '#ef4444', icon: AlertCircle },
                        pending: { label: 'Paiement en attente', color: '#f59e0b', icon: Clock },
                        paid:    { label: 'Payé ✓',          color: '#10b981', icon: CheckCircle },
                      }[payStatus] || { label: 'Non payé', color: '#ef4444', icon: AlertCircle }
                      const PayIcon = payConfig.icon
                      const depositAmt = res.deposit_amount ? Number(res.deposit_amount) : 0
                      const pmLabel = { wave: 'Wave', orange_money: 'Orange Money', cash: 'Espèces', other: 'Autre' }[res.payment_method] || null

                      return (
                      <motion.div key={res.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="p-5 rounded-xl"
                        style={{
                          background: t.cardBg,
                          border: `1px solid ${payStatus === 'paid' ? 'rgba(16,185,129,0.2)' : payStatus === 'pending' ? 'rgba(245,158,11,0.2)' : t.cardBorder}`,
                        }}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-green-400 text-[10px] font-bold">#{res.id}</span>
                            </div>
                            <StatusBadge status={res.status} />
                          </div>
                          {/* Payment status badge */}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
                                style={{ background: `${payConfig.color}12`, border: `1px solid ${payConfig.color}30`, color: payConfig.color }}>
                            <PayIcon size={9} /> {payConfig.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs mb-3" style={{ color: t.textMuted }}>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-green-400/50" />
                            {res.date ? new Date(res.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '–'}
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

                        {/* Payment details */}
                        {depositAmt > 0 && (
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg mt-2"
                               style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `1px solid ${t.inputBorder}` }}>
                            <div className="flex items-center gap-2 text-xs" style={{ color: t.textMuted }}>
                              <CreditCard size={11} />
                              <span>Acompte ({pmLabel || '–'})</span>
                              {res.payment_reference && <span style={{ color: t.textFaint }}>· Réf: {res.payment_reference}</span>}
                            </div>
                            <span className="text-xs font-bold" style={{ color: '#d4a017' }}>{depositAmt.toLocaleString()} FCFA</span>
                          </div>
                        )}

                        {/* Pending payment instructions */}
                        {payStatus === 'pending' && (
                          <div className="mt-2 px-3 py-2 rounded-lg text-xs"
                               style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                            ⏳ Votre paiement est en cours de vérification par l'équipe Le Chef. Confirmation sous 2h.
                          </div>
                        )}
                        {payStatus === 'unpaid' && res.status !== 'cancelled' && (
                          <div className="mt-2 px-3 py-2 rounded-lg text-xs"
                               style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' }}>
                            ⚠️ Acompte non reçu. Contactez-nous au +221 33 824 13 33.
                          </div>
                        )}

                        {res.notes && <p className="text-xs italic mt-2" style={{ color: t.textFaint }}>"{res.notes}"</p>}
                      </motion.div>
                      )
                    })}
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
                       background: t.cardBg,
                       border: `1px solid ${t.cardBorder}`,
                     }}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                       style={{ background: 'radial-gradient(circle at top right, rgba(224,30,55,0.07) 0%, transparent 70%)' }} />

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-rouge/15 border border-rouge/25 flex items-center justify-center"
                         style={{ boxShadow: '0 0 20px rgba(224,30,55,0.12)' }}>
                      <span className="font-playfair text-rouge text-2xl font-bold">{initials}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: t.text }}>{user?.name}</h3>
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
                           style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `1px solid ${t.inputBorder}` }}>
                        <Icon size={13} className="flex-shrink-0" style={{ color: t.textFaint }} />
                        <span className="text-sm truncate" style={{ color: t.textMuted }}>{label || placeholder}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats card */}
                <div className="p-6 rounded-2xl"
                     style={{
                       background: t.cardBg,
                       border: `1px solid ${t.cardBorder}`,
                     }}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 rounded-full bg-rouge" />
                    <h3 className="font-semibold text-sm" style={{ color: t.text }}>Mon historique</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Total commandes',   value: orders.length,                                              color: '#e01e37' },
                      { label: 'Réservations',      value: reservations.length,                                        color: '#3b82f6' },
                      { label: 'En cours',          value: orders.filter(o => o.status === 'confirmed').length,        color: '#f59e0b' },
                      { label: 'Commandes livrées', value: orders.filter(o => o.status === 'delivered').length,        color: '#10b981' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between p-3 rounded-xl"
                           style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)', border: `1px solid ${t.divider}` }}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
                        </div>
                        <span className="font-bold text-sm" style={{ color: t.text }}>{value}</span>
                      </div>
                    ))}

                    <div className="p-3 rounded-xl mt-2"
                         style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)' }}>
                      <p className="text-xs mb-1" style={{ color: t.textMuted }}>Total dépensé (hors annulations)</p>
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
        <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: t.textFaint }}>MULTI BRAIN TECH — Le Chef</p>
      </footer>
    </div>
  )
}
