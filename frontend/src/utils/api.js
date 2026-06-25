import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lechef_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lechef_token')
      localStorage.removeItem('lechef_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

export const productsApi = {
  list: () => api.get('/products'),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
}

export const packsApi = {
  list: () => api.get('/packs'),
  get: (id) => api.get(`/packs/${id}`),
  create: (data) => api.post('/admin/packs', data),
  update: (id, data) => api.put(`/admin/packs/${id}`, data),
  delete: (id) => api.delete(`/admin/packs/${id}`),
}

export const ordersApi = {
  list: () => api.get('/orders'),
  get: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  myOrders: () => api.get('/orders/mine'),
}

export const reservationsApi = {
  list: () => api.get('/reservations'),
  create: (data) => api.post('/reservations', data),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, { status }),
  myReservations: () => api.get('/reservations/mine'),
}

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  orders: (params) => api.get('/admin/orders', { params }),
  reservations: (params) => api.get('/admin/reservations', { params }),
  users: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  createOrder: (data) => api.post('/admin/orders', data),
  uploadImage: (formData) => api.post('/admin/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  expenses: (params) => api.get('/admin/expenses', { params }),
  createExpense: (data) => api.post('/admin/expenses', data),
  deleteExpense: (id) => api.delete(`/admin/expenses/${id}`),
  confirmPayment: (id) => api.patch(`/admin/reservations/${id}/payment`),
}

export const contactApi = {
  send: (data) => api.post('/contact', data),
}
