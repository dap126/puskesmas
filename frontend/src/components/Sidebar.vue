<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'

const { isOpen } = useSidebar()
const activeClass = ref(
  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',
)
const inactiveClass = ref(
  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
)

const openMenus = ref<Record<string, boolean>>({
  pendaftaran: false,
  medis: false,
  farmasi: false,
  informasi: false,
})

const toggleMenu = (menu: string) => {
  openMenus.value[menu] = !openMenus.value[menu]
}
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false"
    />
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <svg
            class="w-12 h-12"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
              fill="#4C51BF"
              stroke="#4C51BF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
              fill="white"
            />
          </svg>

          <span class="mx-2 text-2xl font-semibold text-white">Puskesmas</span>
        </div>
      </div>

      <nav class="mt-10">
        <!-- Menu Group: Layanan Pendaftaran -->
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard"
        >
          <span class="mx-4">Dashboard</span>
        </router-link>
        <div>
          <button
            @click="toggleMenu('pendaftaran')"
            class="flex items-center justify-between w-full px-6 py-2 mt-4 duration-200 border-l-4"
            :class="[openMenus.pendaftaran ? activeClass : inactiveClass]"
          >
            <div class="flex items-center">
              <span class="mx-4">Layanan Pendaftaran</span>
            </div>
            <svg :class="{'rotate-180': openMenus.pendaftaran}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <div v-show="openMenus.pendaftaran" class="bg-gray-800">
            <router-link
              class="flex items-center px-6 py-2 pl-14 duration-200"
              :class="[$route.name === 'Pendaftaran-pasien' ? 'text-white' : 'text-gray-400 hover:text-white']"
              to="/pendaftaran-pasien"
            >
              <span class="text-sm">Pendaftaran Pasien</span>
            </router-link>
            <router-link
              class="flex items-center px-6 py-2 pl-14 duration-200"
              :class="[$route.name === 'Antrean' ? 'text-white' : 'text-gray-400 hover:text-white']"
              to="/antrean"
            >
              <span class="text-sm">Antrean Hari Ini</span>
            </router-link>
          </div>
        </div>

        <!-- Menu Group: Layanan Medis -->
        <div>
          <button
            @click="toggleMenu('medis')"
            class="flex items-center justify-between w-full px-6 py-2 mt-4 duration-200 border-l-4"
            :class="[openMenus.medis ? activeClass : inactiveClass]"
          >
            <div class="flex items-center">
              <span class="mx-4">Layanan Medis</span>
            </div>
            <svg :class="{'rotate-180': openMenus.medis}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <div v-show="openMenus.medis" class="bg-gray-800">
            <router-link
              class="flex items-center px-6 py-2 pl-14 duration-200"
              :class="[$route.name === 'Pemeriksaan' ? 'text-white' : 'text-gray-400 hover:text-white']"
              to="/pemeriksaan"
            >
              <span class="text-sm">Pemeriksaan Dokter</span>
            </router-link>
            <router-link
              class="flex items-center px-6 py-2 pl-14 duration-200"
              :class="[$route.name === 'Riwayat-medis' ? 'text-white' : 'text-gray-400 hover:text-white']"
              to="/riwayat-medis"
            >
              <span class="text-sm">Riwayat Rekam Medis</span>
            </router-link>
          </div>
        </div>

        <!-- Menu Group: Farmasi & Apotek -->
        <div>
          <button
            @click="toggleMenu('farmasi')"
            class="flex items-center justify-between w-full px-6 py-2 mt-4 duration-200 border-l-4"
            :class="[openMenus.farmasi ? activeClass : inactiveClass]"
          >
            <div class="flex items-center">
              <span class="mx-4">Farmasi & Apotek</span>
            </div>
            <svg :class="{'rotate-180': openMenus.farmasi}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <div v-show="openMenus.farmasi" class="bg-gray-800">
            <router-link
              class="flex items-center px-6 py-2 pl-14 duration-200"
              :class="[$route.name === 'Resep' ? 'text-white' : 'text-gray-400 hover:text-white']"
              to="/resep"
            >
              <span class="text-sm">Antrean Resep</span>
            </router-link>
            <router-link
              class="flex items-center px-6 py-2 pl-14 duration-200"
              :class="[$route.name === 'Daftar-Obat' ? 'text-white' : 'text-gray-400 hover:text-white']"
              to="/daftar-obat"
            >
              <span class="text-sm">Daftar Obat</span>
            </router-link>
          </div>
        </div>

        <!-- Menu Group: Informasi -->
        <div>
          <button
            @click="toggleMenu('informasi')"
            class="flex items-center justify-between w-full px-6 py-2 mt-4 duration-200 border-l-4"
            :class="[openMenus.informasi ? activeClass : inactiveClass]"
          >
            <div class="flex items-center">
              <span class="mx-4">Informasi</span>
            </div>
            <svg :class="{'rotate-180': openMenus.informasi}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <div v-show="openMenus.informasi" class="bg-gray-800">
            <router-link
              class="flex items-center px-6 py-2 pl-14 duration-200"
              :class="[$route.name === 'Data-Dokter' ? 'text-white' : 'text-gray-400 hover:text-white']"
              to="/data-dokter"
            >
              <span class="text-sm">Data Dokter</span>
            </router-link>
            <router-link
              class="flex items-center px-6 py-2 pl-14 duration-200"
              :class="[$route.name === 'Jadwal' ? 'text-white' : 'text-gray-400 hover:text-white']"
              to="/jadwal"
            >
              <span class="text-sm">Jadwal Poliklinik</span>
            </router-link>
          </div>
        </div>

        <!-- Menu Item: Laporan -->
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Laporan' ? activeClass : inactiveClass]"
          to="/laporan"
        >
          <span class="mx-4">Laporan</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'UIElements' ? activeClass : inactiveClass]"
          to="/ui-elements"
        >
          <span class="mx-4">UI Elements</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>
