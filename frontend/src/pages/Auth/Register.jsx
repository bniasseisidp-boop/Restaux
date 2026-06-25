import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Phone, ChefHat, ArrowRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { w: 280, h: 280, top: '5%',  right: '0%', color: 'rgba(224,30,55,0.06)',  dur: 9  },
        { w: 180, h: 180, top: '70%', left: '5%',  color: 'rgba(212,160,23,0.05)', dur: 11 },
        { w: 120, h: 120, top: '30%', left: '70%', color: 'rgba(224,30,55,0.04)',  dur: 7  },
      ].map((orb, i) => (
        <motion.div key={i}
          animate={{ y: [0, -18, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, delay: i * 1.5, ease: 'easeInOut' }}
          className="absolute rounded-full blur-3xl"
          style={{ width: orb.w, height: orb.h, top: orb.top, left: orb.left, right: orb.right, background: orb.color }}
        />
      ))}
    </div>
  )
}

function GlowInput({ type, placeholder, value, onChange, icon: Icon, rightEl, autoComplete, required = true }) {
  const [focused, setFocused] = useState(false)
  return (
    <motion.div
      animate={{ boxShadow: focused ? '0 0 0 1px rgba(224,30,55,0.5), 0 0 18px rgba(224,30,55,0.07)' : '0 0 0 1px rgba(255,255,255,0.07)' }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl overflow-hidden"
    >
      <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: focused ? '#e01e37' : 'rgba(255,255,255,0.22)' }} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-11 pr-10 py-3 text-sm text-blanc placeholder-blanc/20 focus:outline-none"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      />
      {rightEl}
    </motion.div>
  )
}

const PERKS = [
  'Suivi de vos commandes en temps réel',
  'Ticket de caisse numérique',
  'Réservation de table en ligne',
  'Offres exclusives membres',
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, isAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) navigate('/', { replace: true })
  }, [isAuth, navigate])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Bienvenue, ${user.name} !`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080808' }}>
      <FloatingOrbs />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img src="/images/pr1.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(8,8,8,0) 0%, rgba(8,8,8,0.88) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(8,8,8,0.75) 0%, transparent 55%)' }} />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-12 left-12 right-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-10 bg-rouge" />
            <span className="text-rouge/80 text-[10px] tracking-[0.3em] uppercase font-semibold">Rejoindre Le Chef</span>
          </div>
          <h2 className="font-playfair text-4xl text-blanc mb-5 leading-tight">
            Un compte,<br />tous vos avantages
          </h2>
          <div className="space-y-3">
            {PERKS.map((perk, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-rouge/20 border border-rouge/30 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-rouge" />
                </div>
                <span className="text-blanc/50 text-sm">{perk}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute top-8 left-8 flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-rouge flex items-center justify-center rounded-xl"
               style={{ boxShadow: '0 0 20px rgba(224,30,55,0.5)' }}>
            <ChefHat size={17} className="text-blanc" />
          </div>
          <span className="font-playfair text-xl text-blanc font-bold drop-shadow-lg">
            Le <span className="text-rouge">Chef</span>
          </span>
        </motion.div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-6 py-10 relative overflow-y-auto">
        {/* Mobile logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-rouge flex items-center justify-center rounded-xl"
               style={{ boxShadow: '0 0 15px rgba(224,30,55,0.4)' }}>
            <ChefHat size={17} className="text-blanc" />
          </div>
          <span className="font-playfair text-xl text-blanc font-bold">
            Le <span className="text-rouge">Chef</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-7">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="h-px w-10 bg-rouge mb-4 origin-left" />
            <h1 className="font-playfair text-3xl text-blanc font-bold mb-2">Créer un compte</h1>
            <p className="text-blanc/35 text-sm">Gratuit, rapide et sans engagement</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <GlowInput type="text" placeholder="Nom complet" value={form.name}
              onChange={e => update('name', e.target.value)} icon={User} autoComplete="name" />

            <GlowInput type="email" placeholder="Adresse email" value={form.email}
              onChange={e => update('email', e.target.value)} icon={Mail} autoComplete="email" />

            <GlowInput type="tel" placeholder="Téléphone (+221...)" value={form.phone}
              onChange={e => update('phone', e.target.value)} icon={Phone} autoComplete="tel" required={false} />

            <GlowInput type={showPass ? 'text' : 'password'} placeholder="Mot de passe (8 carac. min.)"
              value={form.password} onChange={e => update('password', e.target.value)}
              icon={Lock} autoComplete="new-password"
              rightEl={
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blanc/25 hover:text-blanc/60 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              } />

            <GlowInput type={showPass ? 'text' : 'password'} placeholder="Confirmer le mot de passe"
              value={form.password_confirmation}
              onChange={e => update('password_confirmation', e.target.value)}
              icon={Lock} autoComplete="new-password" />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(224,30,55,0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold overflow-hidden mt-1"
              style={{ background: loading ? '#c01a30' : '#e01e37', color: '#fff' }}
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                  Création…
                </>
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight size={15} />
                </>
              )}
              {!loading && (
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)' }}
                />
              )}
            </motion.button>
          </form>

          <p className="text-blanc/15 text-[10px] mt-4 text-center">
            En vous inscrivant, vous acceptez nos conditions d'utilisation.
          </p>

          <p className="text-blanc/30 text-sm mt-5 text-center">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-rouge hover:text-rouge/80 transition-colors font-medium">
              Se connecter
            </Link>
          </p>

          <p className="text-blanc/8 text-[9px] tracking-[0.3em] uppercase text-center mt-8">
            MULTI BRAIN TECH
          </p>
        </motion.div>
      </div>
    </div>
  )
}
