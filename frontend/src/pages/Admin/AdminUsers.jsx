import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApi } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import { ac } from '../../utils/adminTheme'
import { User, Shield, ShoppingBag, Calendar, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const { isDark } = useTheme()
  const t = ac(isDark)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    adminApi.users()
      .then(r => setUsers(Array.isArray(r.data?.users) ? r.data.users : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (user) => {
    if (!confirm(`Supprimer le compte de "${user.name}" ? Cette action est irréversible.`)) return
    setDeleting(user.id)
    try {
      await adminApi.deleteUser(user.id)
      setUsers(prev => prev.filter(u => u.id !== user.id))
      toast.success('Utilisateur supprimé')
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen p-6 lg:p-8 transition-colors duration-300" style={{ background: t.pageBg }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 rounded-full" style={{ background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
          <div>
            <h1 className="font-playfair text-2xl lg:text-3xl font-bold" style={{ color: t.text }}>
              Utili<span className="text-rouge">sateurs</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>{users.length} comptes enregistrés</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative mb-6 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.textMuted }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
          style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }}
        />
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl overflow-hidden transition-colors duration-300"
        style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>

        <div className="hidden sm:grid grid-cols-[1fr_1fr_100px_90px_90px_60px] gap-4 px-6 py-3"
             style={{ borderBottom: `1px solid ${t.divider}` }}>
          {['Utilisateur', 'Email', 'Rôle', 'Cmdes', 'Rés.', ''].map(h => (
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
            <User size={36} className="mb-3 opacity-30" />
            <p className="text-sm">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((user, i) => {
              const isAdmin = user.role === 'admin'
              const initials = user.name
                ? user.name.split(' ').map(w => w[0] || '').filter(Boolean).slice(0, 2).join('').toUpperCase()
                : '?'
              return (
                <motion.div key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="grid sm:grid-cols-[1fr_1fr_100px_90px_90px_60px] gap-4 items-center px-6 py-4 transition-colors"
                  style={{ borderBottom: `1px solid ${t.divider}` }}
                  onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Avatar + name */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                         style={{
                           background: isAdmin ? 'rgba(224,30,55,0.15)' : 'rgba(59,130,246,0.15)',
                           border: `1px solid ${isAdmin ? 'rgba(224,30,55,0.3)' : 'rgba(59,130,246,0.3)'}`,
                           color: isAdmin ? '#e01e37' : '#3b82f6',
                         }}>
                      {initials}
                    </div>
                    <span className="text-sm font-medium" style={{ color: t.text }}>{user.name}</span>
                  </div>

                  {/* Email */}
                  <p className="text-sm truncate" style={{ color: t.textMuted }}>{user.email}</p>

                  {/* Role */}
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase w-fit"
                        style={{
                          background: isAdmin ? 'rgba(224,30,55,0.12)' : 'rgba(59,130,246,0.12)',
                          border: `1px solid ${isAdmin ? 'rgba(224,30,55,0.3)' : 'rgba(59,130,246,0.3)'}`,
                          color: isAdmin ? '#e01e37' : '#3b82f6',
                        }}>
                    {isAdmin ? <Shield size={9} /> : <User size={9} />}
                    {isAdmin ? 'Admin' : 'Client'}
                  </span>

                  {/* Orders */}
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag size={12} style={{ color: t.textFaint }} />
                    <span className="text-sm" style={{ color: t.textMuted }}>{user.orders_count || 0}</span>
                  </div>

                  {/* Reservations */}
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} style={{ color: t.textFaint }} />
                    <span className="text-sm" style={{ color: t.textMuted }}>{user.reservations_count || 0}</span>
                  </div>

                  {/* Delete */}
                  {!isAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(user)}
                      disabled={deleting === user.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
                      title="Supprimer cet utilisateur">
                      {deleting === user.id
                        ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                            className="w-3 h-3 rounded-full border border-red-400/40 border-t-red-400" />
                        : <Trash2 size={13} />}
                    </motion.button>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
