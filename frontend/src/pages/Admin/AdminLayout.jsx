import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ac } from '../../utils/adminTheme'
import {
  LayoutDashboard, ShoppingBag, Package, Calendar, Users,
  LogOut, Menu, ChefHat, Home, ChevronRight, TrendingDown
} from 'lucide-react'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard',        end: true,  color: '#e01e37' },
  { to: '/admin/orders',       icon: ShoppingBag,     label: 'Commandes',        end: false, color: '#3b82f6' },
  { to: '/admin/products',     icon: Package,         label: 'Produits & Packs', end: false, color: '#a855f7' },
  { to: '/admin/reservations', icon: Calendar,        label: 'Réservations',     end: false, color: '#10b981' },
  { to: '/admin/users',        icon: Users,           label: 'Utilisateurs',     end: false, color: '#f59e0b' },
  { to: '/admin/expenses',     icon: TrendingDown,    label: 'Dépenses',         end: false, color: '#f97316' },
]

/* ─── Sidebar at MODULE level to prevent Framer Motion layoutId crash ─── */
function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, user, onLogout, isMobile = false, isDark }) {
  const showText = !collapsed || isMobile
  const t = ac(isDark)

  return (
    <motion.aside
      animate={{ width: isMobile ? 260 : collapsed ? 72 : 260 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full overflow-hidden flex-shrink-0"
      style={{ background: t.sidebarBg, borderRight: `1px solid ${t.sidebarBorder}` }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(224,30,55,0.5), transparent)' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-20 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(224,30,55,0.08) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0"
           style={{ borderBottom: `1px solid ${t.divider}` }}>
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-9 h-9 rounded-xl bg-rouge flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: '0 0 18px rgba(224,30,55,0.4)' }}>
          <ChefHat size={18} className="text-blanc" />
        </motion.div>

        {showText && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }} className="flex-1 min-w-0">
            <p className="font-playfair text-lg font-bold leading-none" style={{ color: t.text }}>Le Chef</p>
            <p className="text-[9px] tracking-[0.4em] uppercase mt-0.5" style={{ color: 'rgba(224,30,55,0.6)' }}>Admin Panel</p>
          </motion.div>
        )}

        {!isMobile && (
          <motion.button onClick={() => setCollapsed(c => !c)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)', border: `1px solid ${t.divider}` }}>
            <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
              <ChevronRight size={13} style={{ color: t.textMuted }} />
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <div className="px-2 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end, color }, i) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}>
              {({ isActive }) => (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ x: showText ? 3 : 0 }}
                  className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors"
                  style={{
                    background: isActive ? `${color}14` : 'transparent',
                    border: isActive ? `1px solid ${color}30` : '1px solid transparent',
                  }}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                         style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                  )}

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                       style={{
                         background: isActive ? `${color}20` : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
                         color: isActive ? color : t.textMuted,
                       }}>
                    <Icon size={15} />
                  </div>

                  {showText && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
                      className="text-sm font-medium flex-1 truncate"
                      style={{ color: isActive ? t.text : t.textMuted }}>
                      {label}
                    </motion.span>
                  )}

                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                       style={{ background: `${color}07` }} />
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 flex-shrink-0 space-y-1" style={{ borderTop: `1px solid ${t.divider}` }}>
        {showText && user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
            className="flex items-center gap-3 p-2.5 mb-2 rounded-xl"
            style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', border: `1px solid ${t.divider}` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                 style={{ background: 'rgba(224,30,55,0.15)', border: '1px solid rgba(224,30,55,0.25)', color: '#e01e37' }}>
              {(user.name || 'A')[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: t.text }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: t.textFaint }}>{user.email}</p>
            </div>
          </motion.div>
        )}

        <NavLink to="/" onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-xs"
          style={{ color: t.textMuted }}>
          <Home size={14} />
          {showText && <span>Voir le site</span>}
        </NavLink>

        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-xs"
          style={{ color: 'rgba(224,30,55,0.6)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#e01e37'; e.currentTarget.style.background = 'rgba(224,30,55,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(224,30,55,0.6)'; e.currentTarget.style.background = 'transparent' }}>
          <LogOut size={14} />
          {showText && <span>Déconnexion</span>}
        </button>
      </div>
    </motion.aside>
  )
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const t = ac(isDark)

  const handleLogout = async () => {
    await logout()
    toast.success('À bientôt !')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex" style={{ background: t.pageBg }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0" style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 40 }}>
        <Sidebar
          collapsed={collapsed} setCollapsed={setCollapsed}
          mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
          user={user} onLogout={handleLogout} isDark={isDark}
        />
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="drawer" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed left-0 top-0 h-full w-[260px] z-50 lg:hidden">
            <Sidebar collapsed={false} setCollapsed={setCollapsed}
              mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
              user={user} onLogout={handleLogout} isMobile isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 flex-shrink-0"
             style={{ background: isDark ? '#0f0f0f' : '#ffffff', borderBottom: `1px solid ${t.divider}` }}>
          <button onClick={() => setMobileOpen(true)} style={{ color: t.textMuted }}><Menu size={20} /></button>
          <span className="font-playfair font-bold" style={{ color: t.text }}>Le <span className="text-rouge">Chef</span></span>
        </div>

        <main className="flex-1 overflow-auto">
          <motion.div key={location.pathname}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="h-full">
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
