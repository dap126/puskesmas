<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-bold mb-4">Daftar Antrean</h2>

    <!-- Info Ringkas -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-100 p-4 rounded-lg shadow">
        <p class="text-sm">Total</p>
        <p class="text-xl font-bold">{{ antrean.length }}</p>
      </div>
      <div class="bg-yellow-100 p-4 rounded-lg shadow">
        <p class="text-sm">Menunggu</p>
        <p class="text-xl font-bold">{{ totalMenunggu }}</p>
      </div>
      <div class="bg-green-100 p-4 rounded-lg shadow">
        <p class="text-sm">Selesai</p>
        <p class="text-xl font-bold">{{ totalSelesai }}</p>
      </div>
    </div>

    <!-- Tabel Antrian -->
    <table class="w-full bg-white shadow rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-left">No</th>
          <th class="p-3 text-left">No Antrian</th>
          <th class="p-3 text-left">Nama Pasien</th>
          <th class="p-3 text-left">Poli</th>
          <th class="p-3 text-left">Status</th>
          <th class="p-3 text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(item, index) in antrean" 
          :key="item.idantrian"
          class="border-t"
        >
          <td class="p-3">{{ index + 1 }}</td>
          <td class="p-3 font-semibold">{{ item.no_antrean }}</td>
          <td class="p-3">{{ item.nama_pasien }}</td>
          <td class="p-3">{{ item.nama_poli }}</td>

          <!-- Status -->
          <td class="p-3">
            <span
              :class="{
                'text-yellow-600 font-semibold': item.status === 'Menunggu',
                'text-green-600 font-semibold': item.status === 'Selesai'
              }"
            >
              {{ item.status }}
            </span>
          </td>

          <!-- Aksi -->
          <td class="p-3">
            <div class="flex items-center gap-2">
              <button v-if="item.status !== 'Selesai' && item.status !== 'selesai'" @click="selesai(item)" class="w-8 h-8 bg-green-500 hover:bg-green-600 cursor-pointer text-white rounded-lg flex items-center justify-center" title="Tandai Selesai">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
              <button v-if="item.status === 'Selesai' || item.status === 'selesai'" @click="undoAntrean(item)" class="w-8 h-8 bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white rounded-lg flex items-center justify-center" title="Undo ke Menunggu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </button>
            </div>
          </td>
        </tr>

        <!-- Jika kosong -->
        <tr v-if="antrean.length === 0">
          <td colspan="6" class="text-center p-4 text-gray-500">
            Tidak ada antrian hari ini
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { antreanService, type Antrean } from '../services/pasien'

const router = useRouter()
const antrean = ref<any[]>([])

const totalMenunggu = computed(() => {
  return antrean.value.filter(a => a.status === 'Menunggu').length
})

const totalSelesai = computed(() => {
  return antrean.value.filter(a => a.status === 'Selesai').length
})

async function fetchAntrean() {
  try {
    antrean.value = await antreanService.getAllAntrean()
  } catch (error) {
    console.error('Gagal mengambil data antrean:', error)
  }
}

async function selesai(item: any) {
  try {
    await antreanService.updateStatus(item.idantrean, 'selesai')
    item.status = 'Selesai'
  } catch (error) {
    console.error(error)
  }
}

async function undoAntrean(item: any) {
  try {
    await antreanService.updateStatus(item.idantrean, 'menunggu')
    item.status = 'Menunggu'
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchAntrean()
})
</script>

<style scoped>
table th {
  font-weight: bold;
}
</style>
