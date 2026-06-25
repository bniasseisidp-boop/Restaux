import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Calendar, Clock, Users, User, Phone, MessageSquare,
  Check, Sparkles, ArrowRight, CreditCard, Smartphone, ChevronLeft
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../utils/api'

gsap.registerPlugin(ScrollTrigger)

const TIMES = ['09:30','10:00','11:00','12:00','12:30','13:00','13:30','19:00','19:30','20:00','20:30','21:00']
const GUESTS = [1,2,3,4,5,6,7,8]
const PRICE_PER_GUEST = 5000
const DEPOSIT_RATE = 0.30

const PAYMENT_METHODS = [
  {
    id: 'wave',
    label: 'Wave',
    desc: 'Paiement mobile Wave',
    number: '+221 77 XXX XX XX',
    color: '#1a73e8',
    icon: '🌊',
  },
  {
    id: 'orange_money',
    label: 'Orange Money',
    desc: 'Paiement Orange Money',
    number: '+221 77 XXX XX XX',
    color: '#FF6600',
    icon: '🟠',
  },
  {
    id: 'cash',
    label: 'Espèces à l\'arrivée',
    desc: 'Payez le dépôt en arrivant',
    number: null,
    color: '#10b981',
    icon: '💵',
  },
]

function SuccessCard({ form, user, reservation, onReset }) {
  const date = form.date ? new Date(form.date).toLocaleDateString('fr-FR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' }) : form.date

  const generateInvoice = () => {
    const win = window.open('', '_blank', 'width=480,height=700')
    if (!win) return
    const paymentLabel = PAYMENT_METHODS.find(m => m.id === form.paymentMethod)?.label || 'Non spécifié'
    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Reçu de réservation</title>
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
  .status { display:inline-block; background:#fef3c7; border:1px solid #f59e0b; color:#92400e; font-size:11px; padding:4px 10px; border-radius:20px; font-weight:600; }
  .footer { text-align:center; font-size:11px; color:#888; margin-top:20px; }
  @media print { body { padding: 10px; } }
</style></head>
<body>
  <h1>★ LE CHEF ★</h1>
  <p class="sub">Restaurant & Café • Dieuppeul I, Dakar</p>
  <p class="sub">+221 33 824 13 33 • info@lechef-dakar.com</p>
  <div class="divider"></div>
  <p style="text-align:center;font-weight:600;font-size:14px;">REÇU DE RÉSERVATION</p>
  <p style="text-align:center;font-size:11px;color:#999;">N° ${reservation?.id || 'XXXX'} • ${new Date().toLocaleString('fr-FR')}</p>
  <div class="dashed"></div>
  <div class="row"><span class="label">Client</span><span class="value">${form.name || user?.name}</span></div>
  <div class="row"><span class="label">Téléphone</span><span class="value">${form.phone || 'N/A'}</span></div>
  <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
  <div class="row"><span class="label">Heure</span><span class="value">${form.time}</span></div>
  <div class="row"><span class="label">Personnes</span><span class="value">${form.guests} pers.</span></div>
  <div class="dashed"></div>
  <div class="row"><span class="label">Estimation par pers.</span><span class="value">${PRICE_PER_GUEST.toLocaleString()} FCFA</span></div>
  <div class="row"><span class="label">Total estimé</span><span class="value">${(form.guests * PRICE_PER_GUEST).toLocaleString()} FCFA</span></div>
  <div class="total-box">
    <p style="font-size:12px;color:#666;margin-bottom:4px;">Acompte (30%)</p>
    <p class="total-amount">${Math.round(form.guests * PRICE_PER_GUEST * DEPOSIT_RATE).toLocaleString()} FCFA</p>
    <p style="font-size:11px;color:#666;margin-top:4px;">Mode: ${paymentLabel}${form.paymentReference ? ' • Réf: ' + form.paymentReference : ''}</p>
  </div>
  <div class="dashed"></div>
  <div style="text-align:center"><span class="status">⏳ En attente de confirmation</span></div>
  ${form.notes ? `<div class="dashed"></div><p style="font-size:11px;color:#666;font-style:italic">Note: ${form.notes}</p>` : ''}
  <div class="divider"></div>
  <div class="footer">
    <p>Merci pour votre confiance !</p>
    <p>La confirmation vous sera envoyée dans les 2 heures.</p>
    <p style="margin-top:8px;color:#e01e37">★ Restaurant Le Chef ★</p>
  </div>
  <script>window.onload = () => window.print()<\/script>
</body></html>`)
    win.document.close()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="max-w-md mx-auto text-center px-4"
    >
      <div className="relative mb-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, ease: 'backOut' }}
          className="w-20 h-20 rounded-full flex items-center justify-center relative"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)' }}
        >
          <motion.div className="absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
            transition={{ duration: 1.2, repeat: 3, ease: 'easeOut' }}
            style={{ border: '1px solid rgba(16,185,129,0.4)' }} />
          <Check size={32} style={{ color: '#10b981' }} strokeWidth={2.5} />
        </motion.div>
      </div>

      <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="font-playfair text-3xl text-blanc font-bold mb-2">
        Réservation <span className="text-rouge">Envoyée !</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Votre acompte est en cours de vérification. Confirmation sous 2h.
      </motion.p>

      {/* Ticket */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="relative rounded-2xl mb-6 text-left overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #141414, #0d0d0d)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #10b981, #d4a017, #10b981)' }} />
        <div className="px-6 py-4 space-y-2.5">
          {[
            ['Date', date, '#10b981'],
            ['Heure', form.time, '#3b82f6'],
            ['Personnes', `${form.guests} pers.`, '#a855f7'],
            ['Nom', form.name || user?.name, '#f59e0b'],
            ['Acompte', `${Math.round(form.guests * PRICE_PER_GUEST * DEPOSIT_RATE).toLocaleString()} FCFA`, '#e01e37'],
            ['Paiement', PAYMENT_METHODS.find(m => m.id === form.paymentMethod)?.label || '–', '#10b981'],
          ].map(([label, value, color]) => (
            <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
              <span className="text-blanc text-xs font-semibold">{value}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#f59e0b' }} />
            <span className="text-xs" style={{ color: '#f59e0b' }}>En attente de confirmation admin</span>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={generateInvoice}
          className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(224,30,55,0.12)', border: '1px solid rgba(224,30,55,0.3)', color: '#e01e37' }}>
          Imprimer le reçu
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          Nouvelle réservation
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Reservation() {
  const [step, setStep] = useState(1) // 1 = form, 2 = payment, 3 = success
  const [form, setForm] = useState({ date:'', time:'', guests:2, name:'', phone:'', notes:'' })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reservation, setReservation] = useState(null)
  const { user } = useAuth()
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  const depositAmount = Math.round(form.guests * PRICE_PER_GUEST * DEPOSIT_RATE)

  useEffect(() => {
    if (user?.name && !form.name) setForm(f => ({ ...f, name: user.name, phone: user.phone || '' }))
  }, [user])

  useEffect(() => {
    gsap.fromTo(sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
    )
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }
  }, [])

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleWhatsApp = () => {
    const msg = `Bonjour Le Chef ! Je souhaite réserver une table.\n📅 Date: ${form.date}\n⏰ Heure: ${form.time}\n👥 Personnes: ${form.guests}\n👤 Nom: ${form.name}\n📱 Téléphone: ${form.phone}\n📝 Notes: ${form.notes || 'Aucune'}`
    window.open(`https://wa.me/221338241333?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleFormNext = (e) => {
    e.preventDefault()
    if (!user) { handleWhatsApp(); return }
    setStep(2)
    setTimeout(() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    if (!paymentMethod) { toast.error('Choisissez un mode de paiement'); return }
    if ((paymentMethod === 'wave' || paymentMethod === 'orange_money') && !paymentReference.trim()) {
      toast.error('Entrez la référence de transaction')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/reservations', {
        user_name:          form.name || user.name,
        user_phone:         form.phone || user.phone || '',
        user_email:         user.email || '',
        date:               form.date,
        time:               form.time,
        guests:             form.guests,
        notes:              form.notes,
        payment_method:     paymentMethod,
        payment_reference:  paymentReference.trim() || undefined,
      })
      setReservation(res.data.reservation)
      setForm(f => ({ ...f, paymentMethod, paymentReference: paymentReference.trim() }))
      setStep(3)
      toast.success('Réservation envoyée ! Confirmation sous 2h.')
    } catch {
      toast.error('Erreur. Réessayez ou réservez via WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (step === 3) {
    return (
      <section id="reservation" className="py-24" style={{ background: '#0a0a0a' }}>
        <SuccessCard form={form} user={user} reservation={reservation}
          onReset={() => {
            setStep(1); setPaymentMethod(''); setPaymentReference(''); setReservation(null)
            setForm({ date:'', time:'', guests:2, name: user?.name || '', phone: user?.phone || '', notes:'' })
          }}
        />
      </section>
    )
  }

  return (
    <section id="reservation" ref={sectionRef} className="py-24" style={{ background: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left image */}
          <div ref={imageRef} className="relative hidden lg:block">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
                 style={{ border: '1px solid rgba(224,30,55,0.15)' }} />
            <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              <img src="/images/ex.jpg" alt="Salle du restaurant Le Chef" className="w-full h-[580px] object-cover" />
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.3), transparent)' }} />
            </div>
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl p-4"
                 style={{ background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
              <p className="text-blanc font-semibold text-sm mb-1">Ouvert tous les jours</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>09h30 — 23h00 · DIEUPPEUL I, Dakar</p>
            </div>
          </div>

          {/* Right */}
          <div>
            {/* Step indicators */}
            <div className="flex items-center gap-3 mb-8">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                       style={{
                         background: step >= s ? '#e01e37' : 'rgba(255,255,255,0.08)',
                         color: step >= s ? '#fff' : 'rgba(255,255,255,0.3)',
                         boxShadow: step >= s ? '0 0 12px rgba(224,30,55,0.4)' : 'none',
                       }}>
                    {step > s ? <Check size={12} /> : s}
                  </div>
                  <span className="text-xs" style={{ color: step >= s ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)' }}>
                    {s === 1 ? 'Vos infos' : 'Paiement'}
                  </span>
                  {s < 2 && <div className="w-8 h-px mx-1" style={{ background: step > s ? '#e01e37' : 'rgba(255,255,255,0.1)' }} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ─── STEP 1: Form ─── */}
              {step === 1 && (
                <motion.div key="step1"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <span className="section-label">Réservation</span>
                  <h2 className="section-title mb-4">
                    Réservez <span className="text-gradient-red italic">Votre Table</span>
                  </h2>

                  {!user ? (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-xl flex items-start gap-3"
                      style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <Sparkles size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#f59e0b' }}>Réservez via WhatsApp</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          Sans compte, la demande part sur WhatsApp.{' '}
                          <Link to="/login" className="underline" style={{ color: '#e01e37' }}>Connectez-vous</Link>
                          {' '}pour réserver en ligne avec paiement d'acompte.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="mb-6 p-3 rounded-xl flex items-center gap-2"
                         style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <Check size={14} style={{ color: '#10b981' }} />
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Acompte de <strong className="text-blanc">{depositAmount.toLocaleString()} FCFA</strong> requis
                        ({form.guests} pers. × {PRICE_PER_GUEST.toLocaleString()} × 30%)
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleFormNext} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <input type="date" min={today} value={form.date}
                          onChange={e => update('date', e.target.value)} required
                          className="input-field pl-9" style={{ colorScheme: 'dark' }} />
                      </div>
                      <div className="relative">
                        <Clock size={14} className="absolute left-3 top-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <select value={form.time} onChange={e => update('time', e.target.value)} required
                          className="input-field pl-9 appearance-none">
                          <option value="">Heure</option>
                          {TIMES.map(t => <option key={t} value={t} style={{ background: '#111' }}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <p className="flex items-center gap-2 mb-3 text-xs tracking-widets uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <Users size={12} /> Nombre de personnes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {GUESTS.map(n => (
                          <motion.button key={n} type="button"
                            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                            onClick={() => update('guests', n)}
                            className="w-10 h-10 rounded-xl text-sm font-semibold transition-all"
                            style={{
                              background: form.guests === n ? '#e01e37' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${form.guests === n ? '#e01e37' : 'rgba(255,255,255,0.1)'}`,
                              color: form.guests === n ? '#fff' : 'rgba(255,255,255,0.5)',
                              boxShadow: form.guests === n ? '0 0 12px rgba(224,30,55,0.3)' : 'none',
                            }}>
                            {n}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <input type="text" placeholder="Votre nom"
                          value={form.name} onChange={e => update('name', e.target.value)}
                          required className="input-field pl-9" />
                      </div>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <input type="tel" placeholder="+221 77 xxx xx xx"
                          value={form.phone} onChange={e => update('phone', e.target.value)}
                          className="input-field pl-9" />
                      </div>
                    </div>

                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3 top-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                      <textarea placeholder="Occasion spéciale, régime alimentaire…"
                        value={form.notes} onChange={e => update('notes', e.target.value)}
                        rows={3} className="input-field pl-9 resize-none" />
                    </div>

                    {user ? (
                      <motion.button type="submit"
                        whileHover={{ scale: 1.01, boxShadow: '0 0 28px rgba(224,30,55,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm"
                        style={{ background: '#e01e37', color: '#fff' }}>
                        Continuer vers le paiement <ArrowRight size={15} />
                      </motion.button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button type="submit"
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm"
                          style={{ background: '#25D366', color: '#fff' }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          Réserver via WhatsApp
                        </motion.button>
                        <Link to="/login" className="flex-1">
                          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm w-full"
                            style={{ background: 'rgba(224,30,55,0.12)', border: '1px solid rgba(224,30,55,0.3)', color: '#e01e37' }}>
                            Se connecter <ArrowRight size={14} />
                          </motion.div>
                        </Link>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* ─── STEP 2: Payment ─── */}
              {step === 2 && (
                <motion.div key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-2 mb-6 text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                    <ChevronLeft size={16} /> Modifier ma réservation
                  </button>

                  <h2 className="font-playfair text-2xl text-blanc font-bold mb-2">
                    Paiement de <span className="text-rouge">l'Acompte</span>
                  </h2>

                  {/* Deposit summary */}
                  <div className="mb-6 p-4 rounded-2xl"
                       style={{ background: 'rgba(224,30,55,0.07)', border: '1px solid rgba(224,30,55,0.2)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Acompte requis (30%)</span>
                      <span className="font-playfair font-bold text-xl text-rouge">{depositAmount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {form.guests} pers. × {PRICE_PER_GUEST.toLocaleString()} F × 30% · {form.date} à {form.time}
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <p className="text-xs uppercase tracking-widets mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Choisissez votre mode de paiement
                    </p>

                    <div className="space-y-3">
                      {PAYMENT_METHODS.map(method => (
                        <motion.div key={method.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setPaymentMethod(method.id)}
                          className="rounded-xl p-4 cursor-pointer transition-all"
                          style={{
                            background: paymentMethod === method.id ? `${method.color}12` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${paymentMethod === method.id ? method.color + '50' : 'rgba(255,255,255,0.08)'}`,
                            boxShadow: paymentMethod === method.id ? `0 0 20px ${method.color}15` : 'none',
                          }}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                                 style={{ background: `${method.color}15` }}>
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-blanc">{method.label}</p>
                              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{method.desc}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 transition-all`}
                                 style={{
                                   borderColor: paymentMethod === method.id ? method.color : 'rgba(255,255,255,0.2)',
                                   background: paymentMethod === method.id ? method.color : 'transparent',
                                 }} />
                          </div>

                          {/* Wave / OM: show number to pay to */}
                          {paymentMethod === method.id && method.id !== 'cash' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3" style={{ borderTop: `1px solid ${method.color}20` }}>
                              <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                Envoyez <strong className="text-blanc">{depositAmount.toLocaleString()} FCFA</strong> au :
                              </p>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
                                   style={{ background: `${method.color}10`, border: `1px solid ${method.color}25` }}>
                                <Smartphone size={14} style={{ color: method.color }} />
                                <span className="font-bold text-sm text-blanc">+221 33 824 13 33</span>
                                <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>Le Chef Restaurant</span>
                              </div>
                              <input
                                value={paymentReference}
                                onChange={e => setPaymentReference(e.target.value)}
                                placeholder="Entrez la référence de transaction (ex: TX-XXXXXXXX)"
                                className="w-full px-3 py-2.5 rounded-xl text-sm text-blanc focus:outline-none"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                              />
                            </motion.div>
                          )}

                          {paymentMethod === method.id && method.id === 'cash' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3 text-xs" style={{ borderTop: `1px solid ${method.color}20`, color: 'rgba(255,255,255,0.4)' }}>
                              Préparez <strong className="text-blanc">{depositAmount.toLocaleString()} FCFA</strong> à régler à votre arrivée. Votre réservation sera validée après paiement.
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <motion.button type="submit" disabled={submitting || !paymentMethod}
                      whileHover={{ scale: 1.01, boxShadow: '0 0 28px rgba(224,30,55,0.35)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm mt-4"
                      style={{
                        background: !paymentMethod ? 'rgba(224,30,55,0.3)' : '#e01e37',
                        color: '#fff',
                        cursor: !paymentMethod ? 'not-allowed' : 'pointer',
                      }}>
                      {submitting ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                          Envoi en cours…
                        </>
                      ) : (
                        <><CreditCard size={15} /> Confirmer la réservation</>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
