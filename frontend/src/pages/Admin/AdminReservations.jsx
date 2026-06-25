import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApi, reservationsApi } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import { ac } from '../../utils/adminTheme'
import { Calendar, Clock, Users, CheckCircle, XCircle, Search, CreditCard, Printer, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = [
  { value: '',          label: 'Toutes',     color: '#888888' },
  { value: 'pending',   label: 'En attente', color: '#f59e0b' },
  { value: 'confirmed', label: 'Confirmée',  color: '#10b981' },
  { value: 'cancelled', label: 'Annulée',    color: '#ef4444' },
]

const PAYMENT_STATUS_LABELS = {
  unpaid:  { label: 'Non payé',  color: '#ef4444' },
  pending: { label: 'En attente', color: '#f59e0b' },
  paid:    { label: 'Payé',       color: '#10b981' },
}

const PAYMENT_METHOD_LABELS = {
  wave:         'Wave',
  orange_money: 'Orange Money',
  cash:         'Espèces',
  other:        'Autre',
}

function StatusBadge({ status }) {
  const s = STATUSES.find(x => x.value === status) || STATUSES[1]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
          style={{ background: `${s.color}15`, border: `1px solid ${s.color}35`, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

function PaymentBadge({ paymentStatus }) {
  const p = PAYMENT_STATUS_LABELS[paymentStatus] || PAYMENT_STATUS_LABELS.unpaid
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
          style={{ background: `${p.color}12`, border: `1px solid ${p.color}30`, color: p.color }}>
      <DollarSign size={8} /> {p.label}
    </span>
  )
}

function printInvoice(res) {
  const win = window.open('', '_blank', 'width=480,height=700')
  if (!win) return
  const paymentLabel = PAYMENT_METHOD_LABELS[res.payment_method] || 'Non spécifié'
  const dateLabel = res.date ? new Date(res.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '–'
  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Facture Réservation #${res.id}</title>
<style>
  body { font-family: Georgia, serif; padding: 30px; max-width: 400px; margin: 0 auto; color: #111; }
  h1 { text-align:center; font-size:22px; letter-spacing:2px; color:#e01e37; margin-bottom:4px; }
  .sub { text-align:center; font-size:11px; color:#666; margin-bottom:2px; }
  .divider { border-top:2px solid #e01e37; margin: 16px 0; }
  .dashed { border-top:1px dashed #ccc; margin: 12px 0; }
  .row { display:flex; justify-content:space-between; font-size:13px; padding: 5px 0; }
  .label { color:#666; }
  .value { font-weight:600; }
  .total-box { background:#fff5f5; border:2px solid #e01e37; border-radius:8px; padding:12px; margin:16px 0; text-align:center; }
  .total-amount { font-size:24px; font-weight:bold; color:#e01e37; }
  .status-paid { display:inline-block; background:#d1fae5; border:1px solid #10b981; color:#065f46; font-size:11px; padding:4px 10px; border-radius:20px; font-weight:600; }
  .footer { text-align:center; font-size:11px; color:#888; margin-top:20px; }
  @media print { body { padding: 10px; } }
</style></head>
<body>
  <h1>★ LE CHEF ★</h1>
  <p class="sub">Restaurant & Café • Dieuppeul I, Dakar</p>
  <p class="sub">+221 33 824 13 33 • info@lechef-dakar.com</p>
  <div class="divider"></div>
  <p style="text-align:center;font-weight:600;font-size:14px;">FACTURE DE RÉSERVATION</p>
  <p style="text-align:center;font-size:11px;color:#999;">N° ${res.id} • Émise le ${new Date().toLocaleString('fr-FR')}</p>
  <div class="dashed"></div>
  <div class="row"><span class="label">Client</span><span class="value">${res.user_name || res.name || '–'}</span></div>
  <div class="row"><span class="label">Téléphone</span><span class="value">${res.user_phone || res.phone || 'N/A'}</span></div>
  <div class="row"><span class="label">E-mail</span><span class="value">${res.user_email || 'N/A'}</span></div>
  <div class="dashed"></div>
  <div class="row"><span class="label">Date</span><span class="value">${dateLabel}</span></div>
  <div class="row"><span class="label">Heure</span><span class="value">${res.time || '–'}</span></div>
  <div class="row"><span class="label">Personnes</span><span class="value">${res.guests || 1}</span></div>
  <div class="dashed"></div>
  <div class="row"><span class="label">Mode de paiement</span><span class="value">${paymentLabel}</span></div>
  ${res.payment_reference ? `<div class="row"><span class="label">Référence</span><span class="value">${res.payment_reference}</span></div>` : ''}
  <div class="total-box">
    <p style="font-size:12px;color:#666;margin-bottom:4px;">Acompte versé (30%)</p>
    <p class="total-amount">${res.deposit_amount ? Number(res.deposit_amount).toLocaleString('fr-FR') : '–'} FCFA</p>
  </div>
  <div style="text-align:center;margin:8px 0"><span class="status-paid">✓ PAIEMENT CONFIRMÉ</span></div>
  ${res.notes ? `<div class="dashed"></div><p style="font-size:11px;color:#666;font-style:italic">Note: ${res.notes}</p>` : ''}
  <div class="divider"></div>
  <div class="footer">
    <p>Merci de votre confiance. À bientôt au Chef !</p>
    <p style="margin-top:8px;color:#e01e37">★ Restaurant Le Chef ★</p>
  </div>
  <script>window.onload = () => window.print()<\/script>
</body></html>`)
  win.document.close()
}

export default function AdminReservations() {
  const { isDark } = useTheme()
  const t = ac(isDark)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [confirming, setConfirming] = useState(null)

  const fetchReservations = useCallback(() => {
    adminApi.reservations(filter ? { status: filter } : {})
      .then(r => setReservations(Array.isArray(r.data?.reservations) ? r.data.reservations : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      await reservationsApi.updateStatus(id, status)
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setUpdating(null)
    }
  }

  const confirmPayment = async (res) => {
    setConfirming(res.id)
    try {
      const resp = await adminApi.confirmPayment(res.id)
      const updated = resp.data?.reservation
      setReservations(prev => prev.map(r => r.id === res.id
        ? { ...r, payment_status: 'paid', status: 'confirmed', ...updated }
        : r
      ))
      toast.success('Paiement confirmé')
      // auto-print invoice
      printInvoice({ ...res, payment_status: 'paid', status: 'confirmed', ...updated })
    } catch {
      toast.error('Erreur lors de la confirmation')
    } finally {
      setConfirming(null)
    }
  }

  const filtered = reservations.filter(r =>
    !search ||
    (r.user_name || r.name || r.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.user_phone || r.phone || '').includes(search)
  )

  return (
    <div className="min-h-screen p-6 lg:p-8 transition-colors duration-300" style={{ background: t.pageBg }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <div>
            <h1 className="font-playfair text-2xl lg:text-3xl font-bold" style={{ color: t.text }}>
              Réser<span className="text-rouge">vations</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>{reservations.length} réservations au total</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.textMuted }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une réservation…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
            style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
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

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-7 h-7 rounded-full border-2 border-rouge/30 border-t-rouge" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" style={{ color: t.textFaint }}>
          <Calendar size={40} className="mb-3 opacity-30" />
          <p className="text-sm">Aucune réservation trouvée</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((res, i) => (
              <motion.div key={res.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileHover={{ y: -3 }}
                className="rounded-xl p-5 relative overflow-hidden transition-colors duration-300"
                style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>

                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                     style={{ background: 'radial-gradient(circle at top right, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />

                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                         style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <span className="text-xs font-bold" style={{ color: '#10b981' }}>{String(res.id).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: t.text }}>
                        {res.user_name || res.name || res.user?.name || 'Client'}
                      </p>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        {res.user_phone || res.phone || res.user?.email || ''}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={res.status} />
                </div>

                {/* Reservation details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs" style={{ color: t.textMuted }}>
                    <Calendar size={12} style={{ color: '#10b981' }} className="flex-shrink-0" />
                    <span>{res.date ? new Date(res.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '–'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: t.textMuted }}>
                    <Clock size={12} style={{ color: '#10b981' }} className="flex-shrink-0" />
                    <span>{res.time || '–'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: t.textMuted }}>
                    <Users size={12} style={{ color: '#10b981' }} className="flex-shrink-0" />
                    <span>{res.guests || 1} personne{(res.guests || 1) > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Payment info */}
                {(res.deposit_amount || res.payment_status) && (
                  <div className="py-2.5 px-3 rounded-lg mb-3"
                       style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${t.divider}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: t.textMuted }}>
                        <CreditCard size={11} />
                        <span>{PAYMENT_METHOD_LABELS[res.payment_method] || 'N/A'}</span>
                        {res.payment_reference && (
                          <span style={{ color: t.textFaint }}>· {res.payment_reference}</span>
                        )}
                      </div>
                      <PaymentBadge paymentStatus={res.payment_status} />
                    </div>
                    {res.deposit_amount && (
                      <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
                        Acompte: {Number(res.deposit_amount).toLocaleString('fr-FR')} FCFA
                      </p>
                    )}
                  </div>
                )}

                {res.notes && (
                  <p className="text-xs italic mb-3 line-clamp-2" style={{ color: t.textFaint }}>
                    "{res.notes}"
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                  {res.status === 'pending' && res.payment_status !== 'paid' && (
                    <div className="flex gap-2">
                      {/* Confirm payment (validates reservation too) */}
                      {(res.payment_status === 'pending') && (
                        <motion.button
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => confirmPayment(res)}
                          disabled={confirming === res.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                          {confirming === res.id ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                              className="w-3 h-3 rounded-full border border-green-400/30 border-t-green-400" />
                          ) : <CheckCircle size={12} />}
                          Confirmer paiement
                        </motion.button>
                      )}
                      {res.payment_status !== 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => updateStatus(res.id, 'confirmed')}
                          disabled={updating === res.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                          <CheckCircle size={12} /> Confirmer
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => updateStatus(res.id, 'cancelled')}
                        disabled={updating === res.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                        <XCircle size={12} /> Annuler
                      </motion.button>
                    </div>
                  )}

                  {/* Invoice print — shown once confirmed + paid */}
                  {res.payment_status === 'paid' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => printInvoice(res)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: 'rgba(224,30,55,0.1)', border: '1px solid rgba(224,30,55,0.25)', color: '#e01e37' }}>
                      <Printer size={12} /> Imprimer la facture
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
