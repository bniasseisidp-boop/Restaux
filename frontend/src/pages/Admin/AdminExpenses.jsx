import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApi } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import { ac } from '../../utils/adminTheme'
import { TrendingDown, TrendingUp, Plus, Trash2, X, Check, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Ingrédients', 'Personnel', 'Équipement', 'Loyer', 'Utilities', 'Marketing', 'Autre']
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

const EMPTY_FORM = { label: '', amount: '', category: 'Ingrédients', date: new Date().toISOString().split('T')[0], notes: '' }

function AddExpenseModal({ onClose, onSave, isDark }) {
  const t = ac(isDark)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminApi.createExpense(form)
      toast.success('Dépense ajoutée')
      onSave()
    } catch {
      toast.error('Erreur lors de l\'ajout')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md rounded-2xl"
        style={{ background: t.modalBg, border: `1px solid ${t.modalBorder}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

        <div className="flex items-center justify-between px-6 py-5"
             style={{ borderBottom: `1px solid ${t.divider}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
              <TrendingDown size={16} style={{ color: '#f97316' }} />
            </div>
            <h3 className="font-playfair text-base font-bold" style={{ color: t.text }}>Nouvelle Dépense</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: t.inputBg, color: t.textMuted }}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widets mb-1.5 block" style={{ color: t.textMuted }}>Libellé *</label>
            <input required value={form.label} onChange={e => update('label', e.target.value)}
              placeholder="Ex: Achat légumes"
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widets mb-1.5 block" style={{ color: t.textMuted }}>Montant (FCFA) *</label>
              <input required type="number" min="0" value={form.amount} onChange={e => update('amount', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widets mb-1.5 block" style={{ color: t.textMuted }}>Date *</label>
              <input required type="date" value={form.date} onChange={e => update('date', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widets mb-1.5 block" style={{ color: t.textMuted }}>Catégorie</label>
            <select value={form.category} onChange={e => update('category', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ background: t.selectBg, border: `1px solid ${t.selectBorder}`, color: t.selectColor }}>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ background: t.selectBg }}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widets mb-1.5 block" style={{ color: t.textMuted }}>Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => update('notes', e.target.value)}
              placeholder="Remarques optionnelles..."
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
          </div>

          <div className="flex gap-3 pt-1">
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
              style={{ background: '#f97316', color: '#fff', opacity: saving ? 0.6 : 1 }}>
              {saving
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                : <><Check size={15} /> Enregistrer</>}
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

export default function AdminExpenses() {
  const { isDark } = useTheme()
  const t = ac(isDark)
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [data, setData] = useState({ expenses: [], total_expenses: 0, total_revenue: 0, profit: 0 })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchExpenses = () => {
    setLoading(true)
    adminApi.expenses({ month, year })
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchExpenses() }, [month, year])

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette dépense ?')) return
    setDeleting(id)
    try {
      await adminApi.deleteExpense(id)
      setData(prev => ({
        ...prev,
        expenses: prev.expenses.filter(e => e.id !== id),
        total_expenses: prev.total_expenses - (prev.expenses.find(e => e.id === id)?.amount || 0),
      }))
      toast.success('Supprimée')
    } catch {
      toast.error('Erreur')
    } finally {
      setDeleting(null)
    }
  }

  const profit = data.profit || 0
  const isProfitable = profit >= 0

  return (
    <div className="min-h-screen p-6 lg:p-8 transition-colors duration-300" style={{ background: t.pageBg }}>
      <AnimatePresence>
        {showModal && (
          <AddExpenseModal
            isDark={isDark}
            onClose={() => setShowModal(false)}
            onSave={() => { setShowModal(false); fetchExpenses() }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ background: '#f97316', boxShadow: '0 0 10px #f97316' }} />
            <div>
              <h1 className="font-playfair text-2xl lg:text-3xl font-bold" style={{ color: t.text }}>
                Dé<span className="text-rouge">penses</span>
              </h1>
              <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>Suivi des charges du restaurant</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#f97316', color: '#fff', boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }}>
            <Plus size={15} /> Ajouter
          </motion.button>
        </div>
      </motion.div>

      {/* Month picker */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-6">
        <select value={month} onChange={e => setMonth(Number(e.target.value))}
          className="px-4 py-2 rounded-xl text-sm focus:outline-none"
          style={{ background: t.selectBg, border: `1px solid ${t.selectBorder}`, color: t.selectColor }}>
          {MONTHS.map((m, i) => <option key={m} value={i + 1} style={{ background: t.selectBg }}>{m}</option>)}
        </select>
        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))}
          className="w-24 px-4 py-2 rounded-xl text-sm focus:outline-none"
          style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }} />
      </motion.div>

      {/* Summary cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Revenus', value: data.total_revenue || 0, color: '#10b981', icon: TrendingUp },
          { label: 'Dépenses', value: data.total_expenses || 0, color: '#f97316', icon: TrendingDown },
          { label: isProfitable ? 'Bénéfice' : 'Perte', value: Math.abs(profit), color: isProfitable ? '#10b981' : '#ef4444', icon: DollarSign },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-xl p-5 transition-colors duration-300"
               style={{ background: t.cardBg, border: `1px solid ${color}22`, boxShadow: t.cardShadow }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              {label === (isProfitable ? 'Bénéfice' : 'Perte') && (
                <span className="text-[10px] px-2 py-1 rounded-full font-semibold uppercase"
                      style={{ background: `${color}15`, color }}>
                  {isProfitable ? '▲' : '▼'} {MONTHS[month - 1]}
                </span>
              )}
            </div>
            <p className="font-playfair text-2xl font-bold mb-1" style={{ color: t.text }}>
              {Number(value).toLocaleString()} <span className="text-sm font-normal">F</span>
            </p>
            <p className="text-xs uppercase tracking-wide" style={{ color: t.textMuted }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Expenses list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl overflow-hidden transition-colors duration-300"
        style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>

        <div className="flex items-center justify-between px-6 py-4"
             style={{ borderBottom: `1px solid ${t.divider}` }}>
          <h2 className="font-semibold text-sm" style={{ color: t.text }}>
            Liste des dépenses — {MONTHS[month - 1]} {year}
          </h2>
          <span className="text-xs" style={{ color: t.textFaint }}>{data.expenses?.length || 0} entrées</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-7 h-7 rounded-full border-2 border-rouge/30 border-t-rouge" />
          </div>
        ) : !data.expenses?.length ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: t.textFaint }}>
            <TrendingDown size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Aucune dépense ce mois-ci</p>
            <p className="text-xs mt-1" style={{ color: t.textFaint }}>Cliquez sur "Ajouter" pour commencer</p>
          </div>
        ) : (
          <AnimatePresence>
            {data.expenses.map((expense, i) => (
              <motion.div key={expense.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="flex items-center justify-between px-6 py-4 transition-colors"
                style={{ borderBottom: `1px solid ${t.divider}` }}
                onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                       style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <TrendingDown size={13} style={{ color: '#f97316' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: t.text }}>{expense.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
                        {expense.category}
                      </span>
                      <span className="text-[10px]" style={{ color: t.textFaint }}>
                        {new Date(expense.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-bold text-sm" style={{ color: '#f97316' }}>
                    -{Number(expense.amount).toLocaleString()} F
                  </p>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(expense.id)}
                    disabled={deleting === expense.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                    {deleting === expense.id
                      ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                          className="w-3 h-3 rounded-full border border-red-400/40 border-t-red-400" />
                      : <Trash2 size={13} />}
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
