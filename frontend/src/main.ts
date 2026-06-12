import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios'

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'
import UPagination from './components/UPagination.vue'

const app = createApp(App)

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.component('UPagination', UPagination)

// Setup Axios Interceptor for Auth (kirim token di setiap request)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token)
    config.headers.Authorization = `Bearer ${token}`

  return config
})

// Flag untuk mencegah logout ganda
let isLoggingOut = false

function forceLogout(reason: string) {
  if (isLoggingOut) return
  isLoggingOut = true

  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('user_role')

  // Simpan pesan untuk ditampilkan di halaman Login
  sessionStorage.setItem('logout_reason', reason)

  // Gunakan window.location untuk redirect yang lebih andal
  window.location.href = '/'
}

// Setup Axios Interceptor untuk auto-logout
axios.interceptors.response.use(
  response => response,
  (error) => {
    // Abaikan request yang sengaja dibatalkan
    if (axios.isCancel(error)) return Promise.reject(error)

    const isLoggedIn = !!localStorage.getItem('token')
    if (!isLoggedIn) return Promise.reject(error)

    // Token expired / tidak valid (401)
    if (error.response?.status === 401) {
      forceLogout('Sesi Anda telah berakhir. Silakan login kembali.')
      return Promise.reject(error)
    }

    // Server benar-benar mati: tidak ada response DAN error adalah network error
    // (ERR_NETWORK, ERR_CONNECTION_REFUSED, ERR_CONNECTION_RESET, dll)
    const networkErrorCodes = ['ERR_NETWORK', 'ERR_CONNECTION_REFUSED', 'ERR_CONNECTION_RESET', 'ECONNREFUSED']
    if (!error.response && networkErrorCodes.includes(error.code)) {
      forceLogout('Server tidak dapat dijangkau. Sesi Anda telah diakhiri otomatis. Silakan login kembali setelah server aktif.')
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

app.use(router)

app.mount('#app')

