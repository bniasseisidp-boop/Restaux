import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Suspense, lazy, useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import LoadingScreen from './components/UI/LoadingScreen'
import WhatsAppButton from './components/UI/WhatsAppButton'
import CursorGlow from './components/UI/CursorGlow'
import ErrorBoundary from './components/UI/ErrorBoundary'

const Home            = lazy(() => import('./pages/Home'))
const Login           = lazy(() => import('./pages/Auth/Login'))
const Register        = lazy(() => import('./pages/Auth/Register'))
const UserDashboard   = lazy(() => import('./pages/Dashboard/UserDashboard'))
const AdminLayout     = lazy(() => import('./pages/Admin/AdminLayout'))
const AdminDashboard  = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminOrders     = lazy(() => import('./pages/Admin/AdminOrders'))
const AdminProducts   = lazy(() => import('./pages/Admin/AdminProducts'))
const AdminReservations = lazy(() => import('./pages/Admin/AdminReservations'))
const AdminUsers      = lazy(() => import('./pages/Admin/AdminUsers'))
const AdminExpenses   = lazy(() => import('./pages/Admin/AdminExpenses'))

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  if (appLoading) return <LoadingScreen />

  return (
    <>
      <CursorGlow />
      <WhatsAppButton />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(224,30,55,0.3)' },
          success: { iconTheme: { primary: '#e01e37', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <UserDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <ErrorBoundary>
                  <AdminLayout />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          >
            <Route index element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
            <Route path="orders"       element={<ErrorBoundary><AdminOrders /></ErrorBoundary>} />
            <Route path="products"     element={<ErrorBoundary><AdminProducts /></ErrorBoundary>} />
            <Route path="reservations" element={<ErrorBoundary><AdminReservations /></ErrorBoundary>} />
            <Route path="users"        element={<ErrorBoundary><AdminUsers /></ErrorBoundary>} />
            <Route path="expenses"     element={<ErrorBoundary><AdminExpenses /></ErrorBoundary>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
