import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { productsApi, packsApi, adminApi } from '../../utils/api'
import { useTheme } from '../../context/ThemeContext'
import { ac } from '../../utils/adminTheme'
import { Plus, Edit2, Trash2, Package, X, Check, Upload, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Entrées', 'Plats', 'Grillades', 'Desserts', 'Boissons', 'Packs']
const EMPTY = { name: '', category: 'Plats', price: '', description: '', image_url: '', available: true, is_pack: false }

/* ─── Product Modal (module level) ─── */
function ProductModal({ product, onClose, onSave, isDark }) {
  const t = ac(isDark)
  const [form, setForm] = useState(product || EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(product?.image_url || null)
  const fileInputRef = useRef(null)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target.result)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await adminApi.uploadImage(formData)
      update('image_url', res.data.url)
      toast.success('Photo uploadée !')
    } catch {
      toast.error('Erreur lors de l\'upload de la photo')
      setPreviewUrl(product?.image_url || null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (form.id) {
        const api = form.is_pack ? packsApi : productsApi
        await api.update(form.id, form)
        toast.success('Mis à jour avec succès')
      } else {
        const api = form.category === 'Packs' ? packsApi : productsApi
        await api.create({ ...form, is_pack: form.category === 'Packs' })
        toast.success('Produit créé !')
      }
      onSave()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: t.modalBg, border: `1px solid ${t.modalBorder}`, boxShadow: '0 0 60px rgba(224,30,55,0.1), 0 20px 60px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
             style={{ borderBottom: `1px solid ${t.divider}` }}>
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-rouge" style={{ boxShadow: '0 0 6px #e01e37' }} />
            <h3 className="font-playfair text-lg font-bold" style={{ color: t.text }}>
              {form.id ? 'Modifier' : 'Nouveau'} Produit
            </h3>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: t.inputBg, color: t.textMuted }}>
            <X size={16} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-[10px] uppercase tracking-widets mb-2 block" style={{ color: t.textMuted }}>Nom</label>
            <input type="text" required value={form.name}
              onChange={e => update('name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }}
              placeholder="Nom du plat" />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widets mb-2 block" style={{ color: t.textMuted }}>Catégorie</label>
              <select value={form.category} onChange={e => update('category', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{ background: t.selectBg, border: `1px solid ${t.selectBorder}`, color: t.selectColor }}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: t.selectBg }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widets mb-2 block" style={{ color: t.textMuted }}>Prix (FCFA)</label>
              <input type="number" required min={0} value={form.price}
                onChange={e => update('price', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }}
                placeholder="0" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] uppercase tracking-widets mb-2 block" style={{ color: t.textMuted }}>Description</label>
            <textarea rows={3} value={form.description}
              onChange={e => update('description', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none resize-none transition-all"
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text }}
              placeholder="Description du plat..." />
          </div>

          {/* Photo upload */}
          <div>
            <label className="text-[10px] uppercase tracking-widets mb-2 block" style={{ color: t.textMuted }}>Photo</label>

            {previewUrl && (
              <div className="relative mb-3 rounded-xl overflow-hidden"
                   style={{ border: `1px solid ${t.inputBorder}` }}>
                <img src={previewUrl} alt="Aperçu"
                  className="w-full h-36 object-cover" />
                <button type="button"
                  onClick={() => { update('image_url', ''); setPreviewUrl(null) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                  <X size={12} />
                </button>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center"
                       style={{ background: 'rgba(0,0,0,0.55)' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white" />
                  </div>
                )}
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={handleFileChange} className="hidden" />

            <motion.button type="button"
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: t.inputBg,
                border: `1px dashed ${uploading ? 'rgba(224,30,55,0.4)' : t.inputBorder}`,
                color: uploading ? '#e01e37' : t.textMuted,
              }}>
              {uploading
                ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-rouge/30 border-t-rouge" /> Envoi en cours...</>
                : <><Upload size={14} /> Importer une photo locale</>}
            </motion.button>

            {form.image_url && !previewUrl && (
              <p className="text-xs mt-1.5" style={{ color: t.textFaint }}>
                Photo: {form.image_url}
              </p>
            )}
          </div>

          {/* Available toggle */}
          <div className="flex items-center gap-3 py-1">
            <div onClick={() => update('available', !form.available)}
              className="w-9 h-5 rounded-full relative cursor-pointer transition-all duration-300"
              style={{ background: form.available ? '#10b981' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)') }}>
              <motion.div animate={{ x: form.available ? 16 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow" />
            </div>
            <label className="text-sm" style={{ color: t.textMuted }}>Disponible</label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button type="submit" disabled={saving || uploading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
              style={{ background: '#e01e37', color: '#fff', opacity: saving ? 0.6 : 1 }}>
              {saving
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                : <Check size={15} />}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </motion.button>
            <motion.button type="button" onClick={onClose}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.textMuted }}>
              Annuler
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function AdminProducts() {
  const { isDark } = useTheme()
  const t = ac(isDark)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const [p, k] = await Promise.all([
        productsApi.list().catch(() => ({ data: { products: [] } })),
        packsApi.list().catch(() => ({ data: { packs: [] } })),
      ])
      const all = [
        ...(p.data?.products || []).map(x => ({ ...x, is_pack: false })),
        ...(k.data?.packs || []).map(x => ({ ...x, is_pack: true, category: 'Packs' })),
      ]
      setProducts(all)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (product) => {
    if (!confirm(`Supprimer "${product.name}" ?`)) return
    setDeleting(product.id)
    try {
      const api = product.is_pack ? packsApi : productsApi
      await api.delete(product.id)
      setProducts(prev => prev.filter(p => p.id !== product.id))
      toast.success('Supprimé')
    } catch {
      toast.error('Erreur de suppression')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 transition-colors duration-300" style={{ background: t.pageBg }}>
      <AnimatePresence>
        {modal !== null && (
          <ProductModal
            isDark={isDark}
            product={modal || undefined}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); fetchProducts() }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full" style={{ background: '#a855f7', boxShadow: '0 0 10px #a855f7' }} />
          <div>
            <h1 className="font-playfair text-2xl lg:text-3xl font-bold" style={{ color: t.text }}>
              Produits <span className="text-rouge">&</span> Packs
            </h1>
            <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>{products.length} articles en catalogue</p>
          </div>
        </div>
        <motion.button
          onClick={() => setModal(false)}
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(224,30,55,0.4)' }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: '#e01e37', color: '#fff' }}>
          <Plus size={16} /> Ajouter
        </motion.button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl overflow-hidden transition-colors duration-300"
        style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>

        <div className="hidden sm:grid grid-cols-[1fr_120px_120px_110px_100px] gap-4 px-6 py-3"
             style={{ borderBottom: `1px solid ${t.divider}` }}>
          {['Produit', 'Catégorie', 'Prix', 'Statut', 'Actions'].map(h => (
            <p key={h} className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: t.textFaint }}>{h}</p>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-7 h-7 rounded-full border-2 border-rouge/30 border-t-rouge" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: t.textFaint }}>
            <Package size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Aucun produit. Commencez par en ajouter.</p>
          </div>
        ) : (
          <AnimatePresence>
            {products.map((product, i) => (
              <motion.div key={`${product.is_pack ? 'p' : 'r'}-${product.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="grid sm:grid-cols-[1fr_120px_120px_110px_100px] gap-4 items-center px-6 py-4 transition-colors"
                style={{ borderBottom: `1px solid ${t.divider}` }}
                onMouseEnter={e => e.currentTarget.style.background = t.rowHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                {/* Product */}
                <div className="flex items-center gap-3">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      style={{ border: `1px solid ${t.inputBorder}` }} />
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                         style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                      <ImageIcon size={14} style={{ color: '#a855f7' }} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium" style={{ color: t.text }}>{product.name}</p>
                    <p className="text-xs line-clamp-1 mt-0.5" style={{ color: t.textFaint }}>{product.description}</p>
                  </div>
                </div>

                {/* Category */}
                <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide uppercase w-fit"
                      style={{
                        background: product.is_pack ? 'rgba(168,85,247,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                        border: `1px solid ${product.is_pack ? 'rgba(168,85,247,0.25)' : t.cardBorder}`,
                        color: product.is_pack ? '#a855f7' : t.textMuted,
                      }}>
                  {product.category}
                </span>

                {/* Price */}
                <p className="text-or font-bold text-sm">
                  {Number(product.price).toLocaleString()} F
                </p>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.available ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ boxShadow: product.available ? '0 0 6px #4ade80' : '0 0 6px #f87171' }} />
                  <span className="text-xs" style={{ color: t.textMuted }}>{product.available ? 'Dispo' : 'Indispo'}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setModal(product)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#3b82f6' }}>
                    <Edit2 size={13} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(product)}
                    disabled={deleting === product.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(224,30,55,0.1)', border: '1px solid rgba(224,30,55,0.2)', color: '#e01e37' }}>
                    {deleting === product.id
                      ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                          className="w-3 h-3 rounded-full border border-rouge/40 border-t-rouge" />
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
