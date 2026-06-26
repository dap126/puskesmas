import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios'
import Swal from 'sweetalert2'

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

// Setup Axios Interceptor untuk respon
axios.interceptors.response.use(
  (response) => {
    // 201: Data berhasil dimasukkan
    if (response.status === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data berhasil dimasukkan',
        confirmButtonColor: '#3085d6',
      })
    }
    return response
  },
  (error) => {
    // Abaikan request yang sengaja dibatalkan
    if (axios.isCancel(error)) return Promise.reject(error)

    const status = error.response?.status
    
    // Custom Error Pop-ups based on Status Code
    if (status === 400) {
      // Data (panggil tabelnya) tidak sesuai dengan format
      const table = error.response?.data?.table || 'yang kamu masukkan'
      Swal.fire({
        icon: 'warning',
        title: 'Format Salah',
        text: `Data ${table} tidak sesuai dengan format`,
        confirmButtonColor: '#f8bb86',
      })
    } else if (status === 403) {
      // Kamu tidak memiliki akses (panggil rolenya yg berhak)
      let requiredRoles = error.response?.data?.requiredRoles || []
      
      // Jika admin bukan satu-satunya role, sembunyikan kata 'admin' dari pesan
      if (requiredRoles.length > 1) {
        requiredRoles = requiredRoles.filter((r: string) => r.toLowerCase() !== 'admin')
      }
      
      const requiredRolesStr = requiredRoles.length > 0 ? requiredRoles.join(' / ') : 'role yang berwenang'
      
      let textMessage = `Kamu tidak memiliki akses. Fitur ini hanya untuk ${requiredRolesStr}.`
      
      // Jika backend mengirim pesan spesifik untuk bisnis logika (misal: "Resep sudah ditebus")
      if (requiredRoles.length === 0 && (error.response?.data?.message || error.response?.data?.error)) {
        textMessage = error.response.data.message || error.response.data.error
      }

      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: textMessage,
        confirmButtonColor: '#d33',
      })
    } else if (status === 401) {
      // Sesi kamu habis / Kamu belum login.
      Swal.fire({
        icon: 'error',
        title: 'Sesi Habis',
        text: 'Sesi kamu habis / Kamu belum login. Silakan login kembali.',
        confirmButtonColor: '#d33',
      }).then(() => {
        forceLogout('Sesi Anda telah berakhir. Silakan login kembali.')
      })
      return Promise.reject(error)
    } else if (status === 429) {
      // Terlalu banyak permintaan!
      Swal.fire({
        icon: 'warning',
        title: 'Terlalu Banyak Permintaan',
        text: 'Terlalu banyak permintaan! Mohon tunggu sebentar',
        confirmButtonColor: '#f8bb86',
      })
    } else if (status && ![401, 403, 400, 429].includes(status)) {
      // Error lain dari server (misal 500)
      const errMsg = error.response?.data?.message || error.response?.data?.error || error.message
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: errMsg,
        confirmButtonColor: '#d33',
      })
    }

    // Server benar-benar mati: tidak ada response DAN error adalah network error
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

