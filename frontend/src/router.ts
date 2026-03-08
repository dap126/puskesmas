import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import UIElements from './views/UIElements.vue'
import Login from './views/Login.vue'
import Pasien from './views/Pendaftaran-pasien.vue'
import Antrean from './views/Antrean.vue'
import Dokter from './views/Data-dokter.vue'
import Jadwal from './views/Jadwal.vue'
import Pemeriksaan from './views/Pemeriksaan.vue'
import Resep from './views/Resep.vue'
import DaftarObat from './views/Daftar-obat.vue'
import Riwayat from './views/Riwayat-medis.vue'
import Laporan from './views/Laporan.vue'

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
    path: '/ui-elements',
    name: 'UIElements',
    component: UIElements,
  },
  {
    path: '/pendaftaran-pasien',
    name: 'Pendaftaran-pasien',
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
