<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'
import { useRoute } from 'vue-router'

const userRole = localStorage.getItem('user_role')
const { isOpen } = useSidebar()
const route = useRoute()
const isMinimized = ref(false)

const openMenus = ref<Record<string, boolean>>({
  pendaftaran: false,
  medis: false,
  farmasi: false,
  informasi: false,
  manajemen: false,
})

const toggleMenu = (menu: string) => {
  openMenus.value[menu] = !openMenus.value[menu]
}

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
  if (isMinimized.value) {
    for (const key in openMenus.value) {
      openMenus.value[key] = false
    }
  }
}
</script>

<template>
  <div class="flex">
    <!-- Backdrop for mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 transition-opacity bg-black/50 lg:hidden"
      @click="isOpen = false"
    ></div>

    <!-- Mobile Menu Button (Visible only on small screens when sidebar is hidden) -->
    <button v-if="!isOpen" type="button" @click="isOpen = true" class="fixed top-4 left-4 z-30 p-2 text-gray-500 bg-white rounded-md shadow-sm lg:hidden focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    </button>

    <!-- Sidebar Wrapper -->
    <aside
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full',
        isMinimized ? 'w-16' : 'w-64',
        'lg:translate-x-0 lg:static fixed'
      ]"
      class="inset-y-0 left-0 z-50 flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 transform shadow-sm"
    >
      <!-- Header Area -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 min-h-[64px]">
        <h3 v-if="!isMinimized" class="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap overflow-hidden transition-all">Puskesmas</h3>
        
        <!-- Toggle Button for Desktop -->
        <div class="hidden lg:block ml-auto">
          <button type="button" @click="toggleMinimize" class="p-1.5 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors" title="Toggle Sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <!-- Close Button for Mobile -->
        <div class="block lg:hidden ml-auto">
          <button type="button" @click="isOpen = false" class="p-1.5 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div> 

      <!-- Navigation Content -->
      <div class="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-visible custom-scrollbar">
        <ul class="space-y-1">
          
          <!-- DASHBOARD -->
          <li class="relative group">
            <router-link to="/dashboard"
              :class="route.name === 'Dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              class="flex items-center p-2 rounded-lg transition-colors group-hover:bg-blue-50/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5" :class="route.name === 'Dashboard' ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-900'">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span v-if="!isMinimized" class="ml-3 whitespace-nowrap font-medium">Dashboard</span>
            </router-link>
            <!-- Tooltip / Flyout for Minimized -->
            <div v-if="isMinimized" class="absolute left-full top-0 ml-2 z-50 invisible group-hover:visible bg-gray-800 text-white text-sm rounded py-1 px-3 shadow-lg whitespace-nowrap">
              <span>Dashboard</span>
            </div>
          </li>

          <!-- LAYANAN PENDAFTARAN (Dropdown Component) -->
          <li class="relative group">
            <button @click="toggleMenu('pendaftaran')"
              :class="(openMenus.pendaftaran && !isMinimized) ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              class="flex items-center w-full p-2 rounded-lg transition-colors focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0Zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0Z" />
              </svg>
              <span v-if="!isMinimized" class="ml-3 font-medium whitespace-nowrap">Pendaftaran</span>
              <svg v-if="!isMinimized" :class="{'rotate-180': openMenus.pendaftaran}" class="w-4 h-4 ml-auto transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Accordion items -->
            <ul v-if="!isMinimized && openMenus.pendaftaran" class="mt-1 space-y-1 px-2 pt-1 border-l-2 border-gray-100 ml-3">
              <li>
                <router-link to="/pasien" :class="route.name === 'Pasien' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Data Pasien
                </router-link>
              </li>
              <li>
                <router-link to="/antrean" :class="route.name === 'Antrean' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Daftar Antrean
                </router-link>
              </li>
            </ul>

            <!-- Flyout items for Minimized -->
            <ul v-if="isMinimized" class="absolute left-full top-0 ml-1 mt-0 bg-white border border-gray-200 shadow-xl rounded-md py-2 w-48 invisible group-hover:visible z-50 opacity-0 group-hover:opacity-100 transition-all">
              <li class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pendaftaran</li>
              <li>
                <router-link to="/pasien" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                  Data Pasien
                </router-link>
              </li>
              <li>
                <router-link to="/antrean" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                  Daftar Antrean
                </router-link>
              </li>
            </ul>
          </li>

          <!-- LAYANAN MEDIS -->
          <li class="relative group">
            <button @click="toggleMenu('medis')"
              :class="(openMenus.medis && !isMinimized) ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              class="flex items-center w-full p-2 rounded-lg transition-colors focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span v-if="!isMinimized" class="ml-3 font-medium whitespace-nowrap">Medis</span>
              <svg v-if="!isMinimized" :class="{'rotate-180': openMenus.medis}" class="w-4 h-4 ml-auto transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul v-if="!isMinimized && openMenus.medis" class="mt-1 space-y-1 px-2 pt-1 border-l-2 border-gray-100 ml-3">
              <li>
                <router-link to="/pemeriksaan" :class="route.name === 'Pemeriksaan' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Pemeriksaan
                </router-link>
              </li>
              <li>
                <router-link to="/riwayat-medis" :class="route.name === 'Riwayat-medis' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Riwayat Medis
                </router-link>
              </li>
            </ul>
            <ul v-if="isMinimized" class="absolute left-full top-0 ml-1 mt-0 bg-white border border-gray-200 shadow-xl rounded-md py-2 w-48 invisible group-hover:visible z-50 opacity-0 group-hover:opacity-100 transition-all">
               <li class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Medis</li>
               <li>
                <router-link to="/pemeriksaan" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Pemeriksaan Dokter</router-link>
              </li>
              <li>
                <router-link to="/riwayat-medis" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Riwayat Medis</router-link>
              </li>
            </ul>
          </li>

          <!-- FARMASI & APOTEK -->
          <li class="relative group">
            <button @click="toggleMenu('farmasi')"
              :class="(openMenus.farmasi && !isMinimized) ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              class="flex items-center w-full p-2 rounded-lg transition-colors focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="flex-shrink-0 w-5 h-5 text-gray-500">
                <path fill-rule="evenodd" d="M19.53 2.348a3.75 3.75 0 1 0-5.303 5.304a3.75 3.75 0 0 0 5.303-5.304M15.288 3.41a2.25 2.25 0 1 1 3.182 3.182a2.25 2.25 0 0 1-3.182-3.182m-5.076 2.377a5.25 5.25 0 1 0-7.424 7.425a5.25 5.25 0 0 0 7.424-7.425M3.848 6.848a3.75 3.75 0 0 1 6.327 1.902h-7.35a3.73 3.73 0 0 1 1.023-1.902M2.825 10.25h7.35a3.75 3.75 0 0 1-7.35 0m18.611 1.314a4.49 4.49 0 0 0-6.347 0l-3.524 3.524a4.488 4.488 0 1 0 6.346 6.347l3.524-3.524a4.49 4.49 0 0 0 0-6.347m-5.287 1.06a2.988 2.988 0 1 1 4.226 4.227L19 18.224l-.026-.008a4.5 4.5 0 0 1-.583-.236c-.5-.241-1.2-.672-1.95-1.421c-.75-.75-1.181-1.452-1.422-1.951a4.5 4.5 0 0 1-.236-.583L14.775 14zm-2.53 2.53l.05.105c.307.637.832 1.48 1.712 2.36s1.723 1.405 2.36 1.712l.104.05l-.994.994a2.988 2.988 0 1 1-4.226-4.226z" clip-rule="evenodd" />
              </svg> 
              <span v-if="!isMinimized" class="ml-3 font-medium whitespace-nowrap">Farmasi</span>
              <svg v-if="!isMinimized" :class="{'rotate-180': openMenus.farmasi}" class="w-4 h-4 ml-auto transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul v-if="!isMinimized && openMenus.farmasi" class="mt-1 space-y-1 px-2 pt-1 border-l-2 border-gray-100 ml-3">
              <li>
                <router-link to="/resep" :class="route.name === 'Resep' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Daftar Resep
                </router-link>
              </li>
              <li>
                <router-link to="/daftar-obat" :class="route.name === 'Daftar-obat' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Daftar Obat
                </router-link>
              </li>
            </ul>
             <ul v-if="isMinimized" class="absolute left-full top-0 ml-1 mt-0 bg-white border border-gray-200 shadow-xl rounded-md py-2 w-48 invisible group-hover:visible z-50 opacity-0 group-hover:opacity-100 transition-all">
               <li class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Farmasi & Apotek</li>
               <li>
                <router-link to="/resep" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Antrean Resep</router-link>
              </li>
              <li>
                <router-link to="/daftar-obat" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Daftar Obat</router-link>
              </li>
            </ul>
          </li>

          <!-- INFORMASI -->
          <li class="relative group">
            <button @click="toggleMenu('informasi')"
              :class="(openMenus.informasi && !isMinimized) ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              class="flex items-center w-full p-2 rounded-lg transition-colors focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h.01M12 12h.01v4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span v-if="!isMinimized" class="ml-3 font-medium whitespace-nowrap">Informasi</span>
              <svg v-if="!isMinimized" :class="{'rotate-180': openMenus.informasi}" class="w-4 h-4 ml-auto transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul v-if="!isMinimized && openMenus.informasi" class="mt-1 space-y-1 px-2 pt-1 border-l-2 border-gray-100 ml-3">
              <li>
                <router-link to="/data-dokter" :class="route.name === 'Data-dokter' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Data Dokter
                </router-link>
              </li>
              <li>
                <router-link to="/jadwal" :class="route.name === 'Jadwal' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Jadwal Poliklinik
                </router-link>
              </li>
            </ul>
            <ul v-if="isMinimized" class="absolute left-full top-0 ml-1 mt-0 bg-white border border-gray-200 shadow-xl rounded-md py-2 w-48 invisible group-hover:visible z-50 opacity-0 group-hover:opacity-100 transition-all">
               <li class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Informasi</li>
               <li>
                <router-link to="/data-dokter" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Data Dokter</router-link>
              </li>
              <li>
                <router-link to="/jadwal" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Jadwal Poliklinik</router-link>
              </li>
            </ul>
          </li>

        </ul>
        
        <hr class="my-4 border-gray-200" />
        
        <ul class="space-y-1">
          <!-- LAPORAN -->
          <li class="relative group">
            <router-link to="/laporan"
              :class="route.name === 'Laporan' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              class="flex items-center p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5" :class="route.name === 'Laporan' ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-900'">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span v-if="!isMinimized" class="ml-3 whitespace-nowrap font-medium">Laporan</span>
            </router-link>
            <div v-if="isMinimized" class="absolute left-full top-0 ml-2 z-50 invisible group-hover:visible bg-gray-800 text-white text-sm rounded py-1 px-3 shadow-lg whitespace-nowrap">
              <span>Laporan</span>
            </div>
          </li>

          <!-- MANAJEMEN (Dropdown) -->
          <li class="relative group" v-if="userRole === 'admin'">
            <button @click="toggleMenu('manajemen')"
              :class="(openMenus.manajemen && !isMinimized) ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              class="flex items-center w-full p-2 rounded-lg transition-colors focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span v-if="!isMinimized" class="ml-3 font-medium whitespace-nowrap">Manajemen</span>
              <svg v-if="!isMinimized" :class="{'rotate-180': openMenus.manajemen}" class="w-4 h-4 ml-auto transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- Accordion items -->
            <ul v-if="!isMinimized && openMenus.manajemen" class="mt-1 space-y-1 px-2 pt-1 border-l-2 border-gray-100 ml-3">
              <li>
                <router-link to="/manajemen/user" :class="route.name === 'Manajemen-user-page' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Kelola User
                </router-link>
              </li>
              <li>
                <router-link to="/manajemen/dokter" :class="route.name === 'Manajemen-dokter-page' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'" class="flex items-center py-2 px-3 rounded-md text-sm transition-colors">
                  Kelola Dokter
                </router-link>
              </li>
            </ul>
            <!-- Flyout items for Minimized -->
            <ul v-if="isMinimized" class="absolute left-full top-0 ml-1 mt-0 bg-white border border-gray-200 shadow-xl rounded-md py-2 w-48 invisible group-hover:visible z-50 opacity-0 group-hover:opacity-100 transition-all">
              <li class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Manajemen</li>
              <li>
                <router-link to="/manajemen/user" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Kelola User</router-link>
              </li>
              <li>
                <router-link to="/manajemen/dokter" class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Kelola Dokter</router-link>
              </li>
            </ul>
          </li>

          <!-- UI ELEMENTS -->
          <li class="relative group">
            <router-link to="/ui-elements"
              :class="route.name === 'UIElements' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              class="flex items-center p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5" :class="route.name === 'UIElements' ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-900'">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
              <span v-if="!isMinimized" class="ml-3 whitespace-nowrap font-medium">UI Elements</span>
            </router-link>
            <div v-if="isMinimized" class="absolute left-full top-0 ml-2 z-50 invisible group-hover:visible bg-gray-800 text-white text-sm rounded py-1 px-3 shadow-lg whitespace-nowrap">
              <span>UI Elements</span>
            </div>
          </li>
        </ul>
      </div>

    </aside>
  </div>
</template>

<style scoped>
/* Optional: Custom scrollbar to make it look cleaner */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
}
</style>
