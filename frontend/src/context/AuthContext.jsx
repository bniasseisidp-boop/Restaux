import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('lechef_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('lechef_token')
    if (!token) { setLoading(false); return }
    try {
      const { data } = await authApi.me()
      setUser(data.user)
      localStorage.setItem('lechef_user', JSON.stringify(data.user))
    } catch {
      localStorage.removeItem('lechef_token')
      localStorage.removeItem('lechef_user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMe() }, [fetchMe])

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials)
    localStorage.setItem('lechef_token', data.token)
    localStorage.setItem('lechef_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (userData) => {
    const { data } = await authApi.register(userData)
    localStorage.setItem('lechef_token', data.token)
    localStorage.setItem('lechef_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    localStorage.removeItem('lechef_token')
    localStorage.removeItem('lechef_user')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'
  const isAuth = !!user

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
