<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Daftar Antrean</h2>
      <button 
        @click="showResetDialog = true" 
        :disabled="antrean.length === 0"
        class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
        </svg>
        Reset Antrean
      </button>
    </div>

    <!-- Alert Sukses -->
    <div v-if="pesanSukses" class="mb-4">
      <p class="text-emerald-600 text-sm font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
        {{ pesanSukses }}
      </p>
    </div>

    <!-- Info Ringkas -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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
          <tr v-for="(item, index) in antrean" :key="item.idantrian" class="border-t">
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3 font-semibold">{{ item.no_antrean }}</td>
            <td class="p-3">{{ item.nama_pasien }}</td>
            <td class="p-3">{{ item.nama_poli }}</td>

            <!-- Status -->
            <td class="p-3">
              <span :class="{
                'text-yellow-600 font-semibold': item.status === 'Menunggu',
                'text-green-600 font-semibold': item.status === 'Selesai'
              }">
                {{ item.status }}
              </span>
            </td>

            <!-- Aksi -->
            <td class="p-3">
              <div class="flex items-center gap-2">
                <button v-if="item.status !== 'Selesai' && item.status !== 'selesai'" @click="selesai(item)"
                  class="w-8 h-8 bg-green-500 hover:bg-green-600 cursor-pointer text-white rounded-lg flex items-center justify-center"
                  title="Tandai Selesai">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                    stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>
                <button v-if="item.status === 'Selesai' || item.status === 'selesai'" @click="undoAntrean(item)"
                  class="w-8 h-8 bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white rounded-lg flex items-center justify-center"
                  title="Undo ke Menunggu">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
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

    <!-- Confirmation Dialog Reset -->
    <div v-if="showResetDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-red-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-gray-800">Reset Antrean</h2>
        </div>
        <p class="text-gray-600 mb-6">Apakah Anda yakin ingin <strong>menghapus semua antrean hari ini</strong>? Tindakan ini tidak dapat dibatalkan.</p>
        <div class="flex justify-end gap-3">
          <button class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition" @click="showResetDialog = false">
            Batal
          </button>
          <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition" @click="resetAntrean">
            Reset Semua
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { antreanService, type Antrean } from '../services/pasien'

const router = useRouter()
const antrean = ref<any[]>([])
const showResetDialog = ref(false)
const pesanSukses = ref('')

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

async function resetAntrean() {
  try {
    const result = await antreanService.resetAntrean()
    pesanSukses.value = result.message || 'Antrean berhasil direset'
    showResetDialog.value = false
    fetchAntrean()
  } catch (error) {
    console.error('Gagal mereset antrean:', error)
    showResetDialog.value = false
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
