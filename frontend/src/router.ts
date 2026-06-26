import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Swal from 'sweetalert2'

import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import Pasien from './views/Pasien.vue'
import Antrean from './views/Antrean.vue'
import Dokter from './views/Data-dokter.vue'
import Jadwal from './views/Jadwal.vue'
import Pemeriksaan from './views/Pemeriksaan.vue'
import Resep from './views/Resep.vue'
import DaftarObat from './views/Daftar-obat.vue'
import Riwayat from './views/Riwayat-medis.vue'
import Laporan from './views/Laporan.vue'
import ManajemenUserPage from './views/manajemen/user.vue'
import ManajemenDokterPage from './views/manajemen/dokter.vue'
import ManajemenPasienPage from './views/manajemen/pasien.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/pasien',
    name: 'Pasien',
    component: Pasien,
  },
  {
    path: '/antrean',
    name: 'Antrean',
    component: Antrean,
  },
  {
    path: '/data-dokter',
    name: 'Data-dokter',
    component: Dokter,
  },
  {
    path: '/jadwal',
    name: 'Jadwal',
    component: Jadwal,
  },
  {
    path: '/pemeriksaan',
    name: 'Pemeriksaan',
    component: Pemeriksaan,
  },
  {
    path: '/resep',
    name: 'Resep',
    component: Resep,
  },
  {
    path: '/daftar-obat',
    name: 'Daftar-obat',
    component: DaftarObat,
  },
  {
    path: '/riwayat-medis',
    name: 'Riwayat-medis',
    component: Riwayat,
  },
  {
    path: '/laporan',
    name: 'Laporan',
    component: Laporan,
  },
  {
    path: '/manajemen/user',
    name: 'Manajemen-user-page',
    component: ManajemenUserPage,
    meta: { requiresRole: 'admin' },
  },
  {
    path: '/manajemen/dokter',
    name: 'Manajemen-dokter-page',
    component: ManajemenDokterPage,
    meta: { requiresRole: 'admin' },
  },
  {
    path: '/manajemen/pasien',
    name: 'Manajemen-pasien-page',
    component: ManajemenPasienPage,
    meta: { requiresRole: 'admin' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// FRONTEND MIDDLEWARE (Satpam Pintu Depan UI)
router.beforeEach((to, from, next) => {
  // Mengecek apakah ada Token JWT di penyimpanan browser
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('user_role')

  if (to.name !== 'Login' && !token)
    return next({ name: 'Login' })

  if (to.name === 'Login' && token)
    return next({ name: 'Dashboard' })

  // Pengecekan Hak Akses (Role)
  if (to.meta.requiresRole) {
    if (userRole !== to.meta.requiresRole) {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: `Kamu tidak memiliki akses. Fitur ini hanya untuk ${String(to.meta.requiresRole)}.`,
        confirmButtonColor: '#d33',
      })
      if (from.path && from.path !== '/')
        return next(from.path)
      else
        return next('/dashboard')
    }
  }

  next()
})

export default router
