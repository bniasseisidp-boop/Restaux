import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminApi } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import { ac } from '../../utils/adminTheme'
import {
  ShoppingBag, Calendar, Users, Package,
  TrendingUp, Clock, CheckCircle, XCircle, Zap
} from 'lucide-react'

function useCountUp(end, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!end) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(ease * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration])
  return count
}

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  const { isDark } = useTheme()
  const t = ac(isDark)
  const count = useCountUp(typeof value === 'number' ? value : 0, 1800)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay / 1000, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative overflow-hidden rounded-xl p-5 cursor-default"
      style={{
        background: t.cardBg,
        border: `1px solid ${color}22`,
        boxShadow: `0 0 30px ${color}10, inset 0 1px 0 ${color}15`,
      }}
    >
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
           style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
           style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <TrendingUp size={13} style={{ color: `${color}50` }} />
      </div>

      <p className="font-playfair text-3xl font-bold mb-1" style={{ color: t.text }}>
        {typeof value === 'number' ? count.toLocaleString() : value}
      </p>
      <p className="text-xs tracking-wide uppercase" style={{ color: t.textMuted }}>{label}</p>

      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, delay: delay / 1000 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(105deg, transparent 40%, ${color}08 50%, transparent 60%)` }}
      />
    </motion.div>
  )
}

function OrderStatusBadge({ status }) {
  const map = {
    pending:   { label: 'En attente', bg: '#f59e0b15', border: '#f59e0b40', color: '#f59e0b' },
    confirmed: { label: 'Confirmé',   bg: '#3b82f615', border: '#3b82f640', color: '#3b82f6' },
    delivered: { label: 'Livré',      bg: '#10b98115', border: '#10b98140', color: '#10b981' },
    cancelled: { label: 'Annulé',     bg: '#ef444415', border: '#ef444440', color: '#ef4444' },
  }
  const s = map[status] || map.pending
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

function ReservationStatusBadge({ status }) {
  const map = {
    pending:   { label: 'En attente', color: '#f59e0b' },
    confirmed: { label: 'Confirmée',  color: '#10b981' },
    cancelled: { label: 'Annulée',    color: '#ef4444' },
  }
  const s = map[status] || map.pending
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase"
          style={{ background: `${s.color}15`, border: `1px solid ${s.color}35`, color: s.color }}>
      <span className="w-1 h-1 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

export default function AdminDashboard() {
  const { isDark } = useTheme()
  const t = ac(isDark)
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [recentReservations, setRecentReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.stats(),
      adminApi.orders({ limit: 6 }),
      adminApi.reservations({ limit: 5 }),
    ])
      .then(([statsRes, ordersRes, resRes]) => {
        setStats(statsRes.data)
        setRecentOrders(Array.isArray(ordersRes.data?.orders) ? ordersRes.data.orders : [])
        setRecentReservations(Array.isArray(resRes.data?.reservations) ? resRes.data.reservations : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: t.pageBg }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 rounded-full border-2 border-rouge/30 border-t-rouge" />
    </div>
  )

  return (
    <div className="min-h-screen p-6 lg:p-8 transition-colors duration-300" style={{ background: t.pageBg }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 rounded-full bg-rouge" style={{ boxShadow: '0 0 10px #e01e37' }} />
          <div>
            <h1 className="font-playfair text-2xl lg:text-3xl font-bold" style={{ color: t.text }}>
              Tableau de <span className="text-rouge">Bord</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>Vue d'ensemble du restaurant</p>
          </div>
        </div>
      </motion.div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShoppingBag} label="Commandes totales"  value={stats?.total_orders || 0}       color="#e01e37" delay={0}   />
        <StatCard icon={Calendar}    label="Réservations"       value={stats?.total_reservations || 0} color="#10b981" delay={100} />
        <StatCard icon={Users}       label="Utilisateurs"       value={stats?.total_users || 0}        color="#3b82f6" delay={200} />
        <StatCard icon={Package}     label="Produits en ligne"  value={stats?.total_products || 0}     color="#a855f7" delay={300} />
      </div>

      {/* Mini stats row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Clock,       label: 'En attente', value: stats?.pending_orders   || 0, color: '#f59e0b' },
          { icon: CheckCircle, label: 'Confirmées', value: stats?.confirmed_orders || 0, color: '#3b82f6' },
          { icon: Zap,         label: 'Livrées',    value: stats?.delivered_orders || 0, color: '#10b981' },
          { icon: XCircle,     label: 'Annulées',   value: stats?.cancelled_orders || 0, color: '#ef4444' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-300"
               style={{ background: t.cardBg2, border: `1px solid ${color}20` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div>
              <p className="font-bold text-lg leading-none" style={{ color: t.text }}>{value}</p>
              <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: t.textFaint }}>{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Two-column: recent orders + recent reservations */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-xl overflow-hidden transition-colors duration-300"
          style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>
          <div className="flex items-center justify-between px-5 py-4"
               style={{ borderBottom: `1px solid ${t.divider}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full bg-rouge" style={{ boxShadow: '0 0 6px #e01e37' }} />
              <h2 className="font-semibold text-sm" style={{ color: t.text }}>Commandes récentes</h2>
            </div>
            <span className="text-xs" style={{ color: t.textFaint }}>{recentOrders.length} entrées</span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: t.textFaint }}>
              <ShoppingBag size={32} className="mb-2 opacity-30" />
              <p className="text-xs">Aucune commande</p>
            </div>
          ) : (
            <div style={{ borderBottom: `1px solid ${t.divider}` }}>
              {recentOrders.map((order, i) => (
                <motion.div key={order.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors"
                  style={{ borderBottom: `1px solid ${t.divider}` }}
                  onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rouge/10 border border-rouge/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-rouge text-[10px] font-bold">#{order.id}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: t.text }}>
                        {order.user_name || order.user?.name || 'Client'}
                      </p>
                      <p className="text-[10px]" style={{ color: t.textFaint }}>
                        {order.items?.length || 0} art.{order.total ? ` · ${Number(order.total).toLocaleString()} F` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] hidden sm:block" style={{ color: t.textFaint }}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : ''}
                    </p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Reservations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
          className="rounded-xl overflow-hidden transition-colors duration-300"
          style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>
          <div className="flex items-center justify-between px-5 py-4"
               style={{ borderBottom: `1px solid ${t.divider}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <h2 className="font-semibold text-sm" style={{ color: t.text }}>Réservations récentes</h2>
            </div>
            <span className="text-xs" style={{ color: t.textFaint }}>{recentReservations.length} entrées</span>
          </div>

          {recentReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: t.textFaint }}>
              <Calendar size={32} className="mb-2 opacity-30" />
              <p className="text-xs">Aucune réservation</p>
            </div>
          ) : (
            <div>
              {recentReservations.map((res, i) => (
                <motion.div key={res.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + i * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors"
                  style={{ borderBottom: `1px solid ${t.divider}` }}
                  onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <span className="text-[10px] font-bold" style={{ color: '#10b981' }}>#{res.id}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: t.text }}>
                        {res.user_name || res.user?.name || 'Client'}
                      </p>
                      <p className="text-[10px]" style={{ color: t.textFaint }}>
                        {res.date ? new Date(res.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '–'}
                        {res.time ? ` · ${res.time}` : ''}
                        {res.guests ? ` · ${res.guests} pers.` : ''}
                      </p>
                    </div>
                  </div>
                  <ReservationStatusBadge status={res.status} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="text-center text-[10px] tracking-[0.4em] uppercase" style={{ color: t.textFaint }}>
        MULTI BRAIN TECH — Le Chef Admin v2.0
      </motion.p>
    </div>
  )
}
