<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type Dokter, type Poli, dokterService, poliService } from '../services/dokter'

const listPoli = ref<Poli[]>([])
const allDokter = ref<Dokter[]>([])
const loading = ref(true)

async function loadInitialData() {
  try {
    loading.value = true
    const [dataPoli, dataDokter] = await Promise.all([
      poliService.getAllPoli(),
      dokterService.getAllDokter(),
    ])

    listPoli.value = dataPoli
    allDokter.value = dataDokter
  }
  catch (error) {
    console.error('Gagal memuat data jadwal:', error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadInitialData()
})

const groupedJadwal = computed(() => {
  return listPoli.value.map(poli => {
    return {
      nama_poli: poli.nama_poli,
      dokter: allDokter.value.filter(doc => doc.nama_poli === poli.nama_poli)
    }
  })
})
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Jadwal Praktik Poli
        </h3>
      </div>

      <div v-if="loading" class="text-center py-10">
        <p class="animate-pulse text-blue-600">
          Memuat data jadwal...
        </p>
      </div>

      <div v-else class="space-y-6">
        <div v-for="(group, index) in groupedJadwal" :key="index" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 class="text-xl font-bold text-indigo-700 mb-4 border-b border-gray-100 pb-3 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
            {{ group.nama_poli }}
          </h4>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="px-5 py-3 font-semibold text-gray-700 w-1/3">Nama Dokter</th>
                  <th class="px-5 py-3 font-semibold text-gray-700">Waktu Praktik</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="doc in group.dokter" :key="doc.id_dokter" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                  <td class="px-5 py-4 text-gray-800 font-semibold">{{ doc.nama_dokter }}</td>
                  <td class="px-5 py-4 text-gray-600">{{ doc.jadwal_praktik || 'Belum ada jadwal' }}</td>
                </tr>
                <tr v-if="group.dokter.length === 0">
                  <td colspan="2" class="py-8 text-center text-gray-400 italic">
                    Belum ada dokter yang bertugas di poli ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
