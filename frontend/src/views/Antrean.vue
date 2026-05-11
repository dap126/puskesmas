<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { antreanService } from '../services/pasien'

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

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(antrean.value.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return antrean.value.slice(start, start + itemsPerPage)
})

function prevPage() {
  if (currentPage.value > 1)
    currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value)
    currentPage.value++
}

async function fetchAntrean() {
  try {
    antrean.value = await antreanService.getAllAntrean()
  }
  catch (error) {
    console.error('Gagal mengambil data antrean:', error)
  }
}

async function selesai(item: any) {
  try {
    await antreanService.updateStatus(item.idantrean, 'selesai')
    item.status = 'Selesai'
  }
  catch (error) {
    console.error(error)
  }
}

async function undoAntrean(item: any) {
  try {
    await antreanService.updateStatus(item.idantrean, 'menunggu')
    item.status = 'Menunggu'
  }
  catch (error) {
    console.error(error)
  }
}

async function resetAntrean() {
  try {
    const result = await antreanService.resetAntrean()
    pesanSukses.value = result.message || 'Antrean berhasil direset'
    showResetDialog.value = false
    fetchAntrean()
  }
  catch (error) {
    console.error('Gagal mereset antrean:', error)
    showResetDialog.value = false
  }
}

onMounted(() => {
  fetchAntrean()
})
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Daftar Antrean
        </h3>
        <button
          :disabled="antrean.length === 0"
          class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition transform shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          @click="showResetDialog = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
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
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p class="text-sm font-semibold text-blue-800">
            Total Antrean
          </p>
          <p class="text-2xl font-bold text-blue-600">
            {{ antrean.length }}
          </p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <p class="text-sm font-semibold text-yellow-800">
            Menunggu
          </p>
          <p class="text-2xl font-bold text-yellow-600">
            {{ totalMenunggu }}
          </p>
        </div>
        <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p class="text-sm font-semibold text-emerald-800">
            Selesai
          </p>
          <p class="text-2xl font-bold text-emerald-600">
            {{ totalSelesai }}
          </p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-4 font-semibold text-gray-600">
                  No
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  No Antrean
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Nama Pasien
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Poli
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Status
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedData" :key="item.idantrian" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 text-gray-600">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-5 py-4 text-gray-800 font-semibold">
                  {{ item.no_antrean }}
                </td>
                <td class="px-5 py-4 text-gray-800 font-medium">
                  {{ item.nama_pasien }}
                </td>
                <td class="px-5 py-4 text-gray-600">
                  {{ item.nama_poli }}
                </td>
                <td class="px-5 py-4">
                  <span
                    :class="{
                      'text-yellow-600 font-semibold bg-yellow-100 px-3 py-1 rounded-full text-xs uppercase tracking-wide': item.status === 'Menunggu' || item.status === 'menunggu',
                      'text-emerald-600 font-semibold bg-emerald-100 px-3 py-1 rounded-full text-xs uppercase tracking-wide': item.status === 'Selesai' || item.status === 'selesai',
                    }"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-5 py-4 align-middle">
                  <div class="flex justify-center gap-2">
                    <button
                      v-if="item.status !== 'Selesai' && item.status !== 'selesai'" class="bg-emerald-500 text-white p-1.5 rounded hover:bg-emerald-600 shadow-sm transition"
                      title="Tandai Selesai" @click="selesai(item)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </button>
                    <button
                      v-if="item.status === 'Selesai' || item.status === 'selesai'" class="bg-yellow-500 text-white p-1.5 rounded hover:bg-yellow-600 shadow-sm transition"
                      title="Undo ke Menunggu" @click="undoAntrean(item)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="antrean.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-400">
                  Tidak ada antrean hari ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
          <p class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, antrean.length) }} dari {{ antrean.length }} data
          </p>
          <UPagination v-model:page="currentPage" active-color="primary" :total="antrean.length" />
        </div>
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
            <h2 class="text-lg font-bold text-gray-800">
              Reset Antrean
            </h2>
          </div>
          <p class="text-gray-600 mb-6">
            Apakah Anda yakin ingin <strong>menghapus semua antrean hari ini</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
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
  </div>
</template>

<style scoped>
table th {
  font-weight: bold;
}
</style>
