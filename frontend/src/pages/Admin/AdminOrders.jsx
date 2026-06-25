import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApi, ordersApi } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import { ac } from '../../utils/adminTheme'
import {
  Clock, CheckCircle, Truck, XCircle, Search,
  Plus, Trash2, Printer, X, ShoppingBag, User
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = [
  { value: '',          label: 'Tous',       color: '#888888' },
  { value: 'pending',   label: 'En attente', color: '#f59e0b', icon: Clock },
  { value: 'confirmed', label: 'Confirmé',   color: '#3b82f6', icon: CheckCircle },
  { value: 'delivered', label: 'Livré',      color: '#10b981', icon: Truck },
  { value: 'cancelled', label: 'Annulé',     color: '#ef4444', icon: XCircle },
]

function StatusBadge({ status }) {
  const s = STATUSES.find(x => x.value === status) || STATUSES[1]
  const Icon = s.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
          style={{ background: `${s.color}15`, border: `1px solid ${s.color}35`, color: s.color }}>
      {Icon && <Icon size={10} />}
      {s.label}
    </span>
  )
}

function printReceipt(order) {
  const win = window.open('', '_blank', 'width=400,height=650')
  if (!win) return
  const date = new Date().toLocaleString('fr-FR')
  const items = order.items || []
  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Reçu #${order.id}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Courier New', monospace; padding: 20px; max-width: 320px; margin: 0 auto; color: #111; }
  h1 { text-align:center; font-size:20px; letter-spacing:2px; margin-bottom:2px; }
  .center { text-align:center; }
  .sub { font-size:11px; color:#555; }
  .divider { border-top:1px dashed #999; margin: 10px 0; }
  .row { display:flex; justify-content:space-between; font-size:12px; padding: 3px 0; }
  .total-row { display:flex; justify-content:space-between; font-size:15px; font-weight:bold; padding: 5px 0; }
  .footer { text-align:center; font-size:11px; color:#666; margin-top:10px; }
  @media print { body { padding:0; } }
</style></head>
<body>
  <h1>★ LE CHEF ★</h1>
  <p class="center sub">Restaurant & Café</p>
  <p class="center sub">Dieuppeul I, Villa 2207 — Dakar</p>
  <p class="center sub">+221 33 824 13 33</p>
  <div class="divider"></div>
  <div class="row"><span><b>Reçu #${order.id}</b></span><span>${date}</span></div>
  <div class="row"><span>Client:</span><span>${order.user_name || 'Client'}</span></div>
  ${order.user_phone ? `<div class="row"><span>Tél:</span><span>${order.user_phone}</span></div>` : ''}
  <div class="divider"></div>
  ${items.map(item => `
    <div class="row">
      <span>${item.name} × ${item.quantity || 1}</span>
      <span>${Number((item.price || 0) * (item.quantity || 1)).toLocaleString()} F</span>
    </div>`).join('')}
  <div class="divider"></div>
  <div class="total-row"><span>TOTAL</span><span>${Number(order.total || 0).toLocaleString()} FCFA</span></div>
  <div class="divider"></div>
  <div class="footer">
    <p>Type: Sur place (Walk-in)</p>
    <p style="margin-top:8px">━━━━━━━━━━━━━━━━━━━━━━</p>
    <p>Merci de votre visite !</p>
    <p>Revenez nous voir bientôt.</p>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body></html>`)
  win.document.close()
}

/* ─── Walk-In Order Modal (module level) ─── */
function WalkInModal({ onClose, onCreated, isDark }) {
  const t = ac(isDark)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([{ name: '', price: '' }])
  const [loading, setLoading] = useState(false)

  const addItem = () => setItems(prev => [...prev, { name: '', price: '' }])
  const removeItem = (i) => setItems(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)
  const updateItem = (i, k, v) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [k]: v } : it))

  const total = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Nom du client requis')
    if (items.some(it => !it.name.trim() || !it.price)) return toast.error('Remplissez tous les articles')
    setLoading(true)
    try {
      const res = await adminApi.createOrder({
        user_name: name.trim(),
        user_phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
        items: items.map(it => ({ name: it.name.trim(), price: parseFloat(it.price), quantity: 1 })),
      })
      toast.success('Commande créée !')
      onCreated(res.data.order)
    } catch {
      toast.error('Erreur lors de la création')
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: t.modalBg, border: `1px solid ${t.modalBorder}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
             style={{ borderBottom: `1px solid ${t.divider}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rouge/15 border border-rouge/30 flex items-center justify-center">
              <ShoppingBag size={16} className="text-rouge" />
            </div>
            <div>
              <h3 className="font-playfair text-base font-bold" style={{ color: t.text }}>Commande sur place</h3>
              <p className="text-xs" style={{ color: t.textMuted }}>Client physique (Walk-in)</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: t.inputBg, color: t.textMuted }}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: t.textMuted }}>
                Nom client *
              </label>
              <input value={name} onChange={e => setName(e.target.value)} required
                placeholder="Ex: Abdou Diallo"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: t.textMuted }}>
                Téléphone
              </label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+221 77…"
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] uppercase tracking-widest" style={{ color: t.textMuted }}>Articles *</label>
              <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={addItem}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(224,30,55,0.12)', border: '1px solid rgba(224,30,55,0.25)', color: '#e01e37' }}>
                <Plus size={12} /> Ajouter
              </motion.button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)}
                    placeholder="Nom du plat"
                    className="flex-1 px-3 py-2 rounded-xl text-sm focus:outline-none"
                    style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
                  <input value={item.price} onChange={e => updateItem(i, 'price', e.target.value)}
                    placeholder="Prix" type="number" min="0"
                    className="w-24 px-3 py-2 rounded-xl text-sm focus:outline-none"
                    style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] uppercase tracking-widets mb-1.5 block" style={{ color: t.textMuted }}>
              Notes
            </label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Instructions spéciales..."
              className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl"
               style={{ background: 'rgba(224,30,55,0.08)', border: '1px solid rgba(224,30,55,0.15)' }}>
            <span className="text-sm font-semibold" style={{ color: t.textMuted }}>Total estimé</span>
            <span className="font-playfair font-bold text-xl text-rouge">{total.toLocaleString()} FCFA</span>
          </div>

          <div className="flex gap-3">
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#e01e37', color: '#fff', opacity: loading ? 0.7 : 1 }}>
              {loading
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                : <><CheckCircle size={15} /> Valider</>}
            </motion.button>
            <motion.button type="button" onClick={onClose}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.textMuted }}>
              Annuler
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function StatusSelect({ orderId, current, onChange, isDark }) {
  const t = ac(isDark)
  const options = STATUSES.filter(s => s.value)
  return (
    <select value={current} onChange={e => onChange(orderId, e.target.value)}
      className="text-xs rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer transition-colors duration-300"
      style={{ background: t.selectBg, border: `1px solid ${t.selectBorder}`, color: t.selectColor }}>
      {options.map(s => (
        <option key={s.value} value={s.value} style={{ background: t.selectBg }}>{s.label}</option>
      ))}
    </select>
  )
}

export default function AdminOrders() {
  const { isDark } = useTheme()
  const t = ac(isDark)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [showWalkIn, setShowWalkIn] = useState(false)

  const fetchOrders = useCallback(() => {
    adminApi.orders(filter ? { status: filter } : {})
      .then(r => setOrders(Array.isArray(r.data?.orders) ? r.data.orders : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (id, status) => {
    setUpdating(id)
    try {
      await ordersApi.updateStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setUpdating(null)
    }
  }

  const handleWalkInCreated = (order) => {
    setShowWalkIn(false)
    setOrders(prev => [order, ...prev])
    printReceipt(order)
  }

  const filtered = orders.filter(o => {
    if (!search) return true
    return (o.user_name || o.user?.name || '').toLowerCase().includes(search.toLowerCase())
      || String(o.id).includes(search)
  })

  return (
    <div className="min-h-screen p-6 lg:p-8 transition-colors duration-300" style={{ background: t.pageBg }}>
      <AnimatePresence>
        {showWalkIn && (
          <WalkInModal
            isDark={isDark}
            onClose={() => setShowWalkIn(false)}
            onCreated={handleWalkInCreated}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
            <div>
              <h1 className="font-playfair text-2xl lg:text-3xl font-bold" style={{ color: t.text }}>
                Ges<span className="text-rouge">tion</span> des Commandes
              </h1>
              <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>{orders.length} commandes au total</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowWalkIn(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#e01e37', color: '#fff', boxShadow: '0 4px 14px rgba(224,30,55,0.35)' }}>
            <Plus size={15} />
            <span className="hidden sm:inline">Commande sur place</span>
            <span className="sm:hidden">Walk-in</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.textMuted }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une commande…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
            style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <motion.button key={s.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(s.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: filter === s.value ? `${s.color}20` : t.inputBg,
                border: `1px solid ${filter === s.value ? s.color + '50' : t.inputBorder}`,
                color: filter === s.value ? s.color : t.textMuted,
              }}>
              {s.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl overflow-hidden transition-colors duration-300"
        style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>

        <div className="hidden sm:grid grid-cols-[60px_1fr_100px_120px_140px_160px] gap-4 px-6 py-3"
             style={{ borderBottom: `1px solid ${t.divider}` }}>
          {['#', 'Client', 'Articles', 'Total', 'Statut', 'Action'].map(h => (
            <p key={h} className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: t.textFaint }}>{h}</p>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-7 h-7 rounded-full border-2 border-rouge/30 border-t-rouge" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: t.textFaint }}>
            <Search size={36} className="mb-3 opacity-30" />
            <p className="text-sm">Aucune commande trouvée</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((order, i) => (
              <motion.div key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="grid sm:grid-cols-[60px_1fr_100px_120px_140px_160px] gap-4 items-center px-6 py-4 transition-colors cursor-default"
                style={{ borderBottom: `1px solid ${t.divider}` }}
                onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-rouge/10 border border-rouge/20">
                  <span className="text-rouge text-xs font-bold">#{order.id}</span>
                </div>

                <div>
                  <p className="text-sm font-medium" style={{ color: t.text }}>
                    {order.user_name || order.user?.name || 'Client WhatsApp'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: t.textFaint }}>
                    {order.user?.email || order.user_phone || ''}
                  </p>
                </div>

                <p className="text-sm" style={{ color: t.textMuted }}>
                  {order.items?.length || 0} art.
                </p>

                <p className="text-or font-semibold text-sm">
                  {order.total ? `${Number(order.total).toLocaleString()} F` : '–'}
                </p>

                <StatusBadge status={order.status} />

                <div className="flex items-center gap-2">
                  {updating === order.id ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                      className="w-5 h-5 rounded-full border-2 border-blanc/10 border-t-blanc/50" />
                  ) : (
                    <StatusSelect orderId={order.id} current={order.status} onChange={handleStatusChange} isDark={isDark} />
                  )}
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => printReceipt(order)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6' }}
                    title="Imprimer le reçu">
                    <Printer size={13} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
