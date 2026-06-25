import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ChefHat, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

function FloatingOrbs() {
  const orbs = [
    { w: 300, h: 300, top: '-10%', left: '-5%',  color: 'rgba(224,30,55,0.07)',  delay: 0,   dur: 8  },
    { w: 200, h: 200, top: '60%',  left: '80%',  color: 'rgba(224,30,55,0.05)',  delay: 2,   dur: 10 },
    { w: 150, h: 150, top: '40%',  left: '5%',   color: 'rgba(212,160,23,0.05)', delay: 1,   dur: 12 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
          className="absolute rounded-full blur-3xl"
          style={{ width: orb.w, height: orb.h, top: orb.top, left: orb.left, background: orb.color }}
        />
      ))}
    </div>
  )
}

function GlowInput({ type, placeholder, value, onChange, icon: Icon, rightEl, autoComplete }) {
  const [focused, setFocused] = useState(false)
  return (
    <motion.div
      animate={{ boxShadow: focused ? '0 0 0 1px rgba(224,30,55,0.5), 0 0 20px rgba(224,30,55,0.08)' : '0 0 0 1px rgba(255,255,255,0.07)' }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-px transition-all duration-300"
           style={{ background: focused ? 'linear-gradient(180deg, transparent, #e01e37, transparent)' : 'transparent' }} />
      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: focused ? '#e01e37' : 'rgba(255,255,255,0.25)' }} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-11 pr-10 py-3.5 text-sm text-blanc placeholder-blanc/20 focus:outline-none"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      />
      {rightEl}
    </motion.div>
  )
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) navigate('/', { replace: true })
  }, [isAuth, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form)
      toast.success(`Bienvenue, ${user.name} !`)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080808' }}>
      <FloatingOrbs />

      {/* Left: image panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img src="/images/ex.jpg" alt="" className="w-full h-full object-cover" />
        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(8,8,8,0) 0%, rgba(8,8,8,0.85) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(8,8,8,0.7) 0%, transparent 60%)' }} />

        {/* Content overlay */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-12 left-12 right-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-10 bg-rouge" />
            <span className="text-rouge/80 text-[10px] tracking-[0.3em] uppercase font-semibold">Restaurant & Café</span>
          </div>
          <h2 className="font-playfair text-4xl text-blanc mb-3 leading-tight">
            Bon retour<br />parmi nous
          </h2>
          <p className="text-blanc/40 text-sm leading-relaxed max-w-xs">
            Connectez-vous pour suivre vos commandes et réservations.
          </p>
        </motion.div>

        {/* Logo top-left on image */}
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
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-6 py-16 relative">
        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden flex items-center gap-3 mb-12"
        >
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
          {/* Heading */}
          <div className="mb-8">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="h-px w-10 bg-rouge mb-4 origin-left" />
            <h1 className="font-playfair text-3xl text-blanc font-bold mb-2">Connexion</h1>
            <p className="text-blanc/35 text-sm">Accédez à votre espace personnel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <GlowInput
              type="email"
              placeholder="Adresse email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              icon={Mail}
              autoComplete="email"
            />

            <GlowInput
              type={showPass ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              icon={Lock}
              autoComplete="current-password"
              rightEl={
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blanc/25 hover:text-blanc/60 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(224,30,55,0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold overflow-hidden mt-2"
              style={{ background: loading ? '#c01a30' : '#e01e37', color: '#fff' }}
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={15} />
                </>
              )}
              {/* Shimmer */}
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-blanc/20 text-[10px] tracking-widest">OU</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/221338241333?text=Bonjour%2C%20je%20souhaite%20commander."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(37,211,102,0.15)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'rgba(37,211,102,0.08)',
              border: '1px solid rgba(37,211,102,0.2)',
              color: '#25D366',
            }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Commander sans compte via WhatsApp
          </motion.a>

          <p className="text-blanc/25 text-sm mt-6 text-center">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-rouge hover:text-rouge/80 transition-colors font-medium">
              S'inscrire gratuitement
            </Link>
          </p>

          <p className="text-blanc/8 text-[9px] tracking-[0.3em] uppercase text-center mt-10">
            MULTI BRAIN TECH
          </p>
        </motion.div>
      </div>
    </div>
  )
}
