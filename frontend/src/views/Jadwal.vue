<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Poli, poliService } from '../services/poli'
import { type Dokter, dokterService } from '../services/dokter'

const listPoli = ref<Poli[]>([])
const allDokter = ref<Dokter[]>([])
const loading = ref(true)

async function loadInitialData() {
  try {
    loading.value = true
    // Mengambil data Poli dan Dokter secara bersamaan
    const [dataPoli, dataDokter] = await Promise.all([
      poliService.getAllPoli(),
      dokterService.getAllDokter(),
    ])

    listPoli.value = dataPoli
    allDokter.value = dataDokter
  }
  catch (error) {
    console.error('Gagal memuat data jadwal:', error)
    // Mock Data untuk preview jika API belum jalan
    listPoli.value = [
      { id_poli: 1, nama_poli: 'Poli Umum' },
      { id_poli: 2, nama_poli: 'Poli Gigi' },
    ]
    allDokter.value = [
      { id_dokter: 1, nama_dokter: 'dr. Linda Agistina', jadwal_praktik: 'Senin - Rabu (08:00 - 12:00)', poli_id_poli: 1, users_idusers: 1 },
      { id_dokter: 2, nama_dokter: 'dr. Handani', jadwal_praktik: 'Kamis - Sabtu (13:00 - 17:00)', poli_id_poli: 2, users_idusers: 2 },
    ]
  }
  finally {
    loading.value = false
  }
}

// Fungsi filter dokter berdasarkan ID Poli
function getDokterByPoli(poliId: number) {
  return allDokter.value.filter((d: Dokter) => d.poli_id_poli === poliId)
}

onMounted(() => {
  loadInitialData()
})
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">
          Jadwal Praktik Poli
        </h1>
        <p class="text-gray-600">
          Daftar poli dan jadwal operasional dokter
        </p>
      </header>

      <div v-if="loading" class="text-center py-10">
        <p class="animate-pulse text-blue-600">
          Memuat data jadwal...
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in listPoli"
          :key="item.id_poli"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
        >
          <div class="bg-blue-600 p-4">
            <h2 class="text-white font-bold text-lg uppercase flex items-center">
              <span class="mr-2">🏥</span> {{ item.nama_poli }}
            </h2>
          </div>

          <div class="p-4">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Dokter Bertugas:
            </h3>

            <div class="space-y-4">
              <div v-for="doc in getDokterByPoli(item.id_poli)" :key="doc.id_dokter" class="border-l-4 border-emerald-500 pl-3">
                <p class="font-medium text-gray-800">
                  {{ doc.nama_dokter }}
                </p>
                <p class="text-sm text-gray-500 flex items-center mt-1">
                  <span class="mr-1">🕒</span> {{ doc.jadwal_praktik }}
                </p>
              </div>
            </div>

            <div v-if="getDokterByPoli(item.id_poli).length === 0" class="text-sm text-gray-400 italic">
              Belum ada jadwal dokter tersedia.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
