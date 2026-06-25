import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Menu, X, User, LogOut, ChefHat, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV_LINKS = [
  { href: '#about', label: 'À Propos' },
  { href: '#menu', label: 'Menu' },
  { href: '#packs', label: 'Packs' },
  { href: '#pricing', label: 'Tarifs' },
  { href: '#reservation', label: 'Réservation' },
  { href: '#location', label: 'Localisation' },
]

const scrollTo = (id) => {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navRef = useRef(null)
  const { user, logout, isAdmin } = useAuth()
  const { isDark, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 2.5 }
    )
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-noir-900/95 backdrop-blur-md border-b border-rouge/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-rouge flex items-center justify-center">
              <ChefHat size={18} className="text-blanc" />
            </div>
            <div>
              <span className="font-playfair text-xl font-bold tracking-wider"
                    style={{ color: isDark ? '#ffffff' : '#1a1611' }}>
                Le <span className="text-rouge">Chef</span>
              </span>
              <p className="text-[9px] tracking-[0.4em] uppercase leading-none"
                 style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,22,17,0.4)' }}>
                Restaurant & Café
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="nav-link text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,22,17,0.7)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-rouge/20 border border-rouge/30 flex items-center justify-center">
                    <User size={15} className="text-rouge" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-12 w-48 shadow-2xl rounded-sm overflow-hidden"
                    style={{
                      background: isDark ? '#1a1a1a' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}
                    >
                      <p className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#1a1611' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,22,17,0.45)' }}>{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,22,17,0.65)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = isDark ? '#fff' : '#1a1611' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,22,17,0.65)' }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ChefHat size={14} /> Panel Admin
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,22,17,0.65)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = isDark ? '#fff' : '#1a1611' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,22,17,0.65)' }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={14} /> Mon compte
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: '#d91830' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(217,24,48,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={14} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm transition-colors"
                  style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,22,17,0.65)' }}
                >
                  Connexion
                </Link>
                <Link to="/register" className="btn-rouge py-2 px-5 text-xs">
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{
                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                style={{ opacity: isDark ? 1 : 0, transform: isDark ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(90deg)' }}
              >
                <Sun size={15} style={{ color: '#d4a017' }} />
              </span>
              <span
                className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                style={{ opacity: isDark ? 0 : 1, transform: isDark ? 'scale(0) rotate(-90deg)' : 'scale(1) rotate(0deg)' }}
              >
                <Moon size={15} style={{ color: '#d91830' }} />
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden transition-colors"
              style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,22,17,0.7)' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu fixed inset-y-0 right-0 w-80 bg-noir-800 z-50 border-l border-white/5 flex flex-col pt-20 px-6 ${
          mobileOpen ? 'open' : ''
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-5 right-5 text-blanc/50 hover:text-blanc"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6 mt-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => { scrollTo(link.href); setMobileOpen(false) }}
              className="text-left text-blanc/70 hover:text-blanc font-medium text-lg border-b border-white/5 pb-4 transition-colors"
            >
              {link.label}
            </button>
          ))}
          {!user && (
            <div className="flex flex-col gap-3 mt-4">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-center justify-center">Connexion</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-rouge text-center justify-center">S'inscrire</Link>
            </div>
          )}
        </div>

        <div className="mt-auto pb-8">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 mb-4 text-sm transition-colors"
            style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26,22,17,0.5)' }}
          >
            {isDark ? <Sun size={15} style={{ color: '#d4a017' }} /> : <Moon size={15} style={{ color: '#d91830' }} />}
            {isDark ? 'Thème clair' : 'Thème sombre'}
          </button>
          <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26,22,17,0.3)' }}>+221 33 824 13 33</p>
          <p className="text-xs mt-1" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26,22,17,0.3)' }}>Dieuppeul I — Dakar</p>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
