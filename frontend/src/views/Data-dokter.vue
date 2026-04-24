<script setup>
import { ref, onMounted } from 'vue'
import { dokterService, poliService } from '../services/dokter'

const daftarPoli = ref([])
const listDokter = ref([])

const fetchPoli = async () => {
  try {
    daftarPoli.value = await poliService.getAllPoli()
  } catch (error) {
    console.error('Gagal mengambil data poli', error)
  }
}

const fetchDokter = async () => {
  try {
    listDokter.value = await dokterService.getAllDokter()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchPoli()
  fetchDokter()
})
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          Data Dokter
        </h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-5 py-4 font-semibold text-gray-600">No</th>
              <th class="px-5 py-4 font-semibold text-gray-600">Nama Dokter</th>
              <th class="px-5 py-4 font-semibold text-gray-600">Poli</th>
              <th class="px-5 py-4 font-semibold text-gray-600">Jadwal Praktik</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in listDokter" :key="doc.id_dokter" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
              <td class="px-5 py-4 text-gray-600">{{ index + 1 }}</td>
              <td class="px-5 py-4 text-gray-800 font-medium">{{ doc.nama_dokter }}</td>
              <td class="px-5 py-4 text-gray-600">{{ doc.nama_poli || '-' }}</td>
              <td class="px-5 py-4 text-gray-600 text-sm">{{ doc.jadwal_praktik }}</td>
            </tr>
            <tr v-if="listDokter.length === 0">
              <td colspan="4" class="py-12 text-center text-gray-400">
                Data tidak ditemukan atau sedang memuat...
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
