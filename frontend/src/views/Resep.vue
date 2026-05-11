<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type DetailResep, type Obat, detailresepService, obatService } from '../services/farmasi'

// STATE
const daftarDetail = ref<DetailResep[]>([])
const daftarObat = ref<Obat[]>([])
const search = ref('')
const showConfirmDialog = ref(false)
const deleteId = ref<number | undefined>(undefined)

// ================= GET DATA =================
async function fetchDetail() {
  try {
    const data = await detailresepService.getAllDetailResep()
    daftarDetail.value = data
  }
  catch (error: any) {
    console.error(error.message)
  }
}

async function fetchObat() {
  try {
    const data = await obatService.getAllObat()
    daftarObat.value = data
  }
  catch (error: any) {
    console.error(error.message)
  }
}

// ================= FILTER =================
const filteredResep = computed(() => {
  return daftarDetail.value.filter((item) => {
    const namaObat = getNamaObat(item.obat_id_obat).toLowerCase()
    return (
      namaObat.includes(search.value.toLowerCase())
      || String(item.resep_obat_id_resep).includes(search.value)
    )
  })
})

function getNamaObat(id: number) {
  const obat = daftarObat.value.find(o => o.id_obat === id)
  return obat ? obat.nama_obat : '-'
}

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(filteredResep.value.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredResep.value.slice(start, start + itemsPerPage)
})

function prevPage() {
  if (currentPage.value > 1)
    currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value)
    currentPage.value++
}

// ================= DELETE =================
function openConfirmHapus(id: number | undefined) {
  if (!id)
    return
  deleteId.value = id
  showConfirmDialog.value = true
}

function cancelDelete() {
  showConfirmDialog.value = false
  deleteId.value = undefined
}

async function hapusResep() {
  if (!deleteId.value)
    return
  try {
    await detailresepService.deleteDetailResep(deleteId.value)
    showConfirmDialog.value = false
    deleteId.value = undefined
    fetchDetail()
  }
  catch (error: any) {
    console.error(error.message)
    showConfirmDialog.value = false
  }
}

// ================= INIT =================
onMounted(() => {
  fetchDetail()
  fetchObat()
})
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Daftar Resep
        </h3>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <!-- Search Bar -->
        <div class="mb-5">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Cari resep atau obat..."
              class="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 transition focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
            >
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-4 font-semibold text-gray-600">
                  No
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  No Resep
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Nama Obat
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Jumlah
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Dosis
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedData" :key="item.id_detail" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 text-gray-600">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-5 py-4 text-gray-800 font-semibold">
                  RSP-{{ item.resep_obat_id_resep }}
                </td>
                <td class="px-5 py-4 text-gray-800 font-medium">
                  {{ item.nama_obat }}
                </td>
                <td class="px-5 py-4 text-gray-600">
                  <span class="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full tracking-wide">
                    {{ item.jumlah_obat }}
                  </span>
                </td>
                <td class="px-5 py-4 text-gray-600">
                  {{ item.dosis }}
                </td>
                <td class="px-5 py-4 align-middle">
                  <div class="flex justify-center gap-2">
                    <button class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus Resep" @click="openConfirmHapus(item.id_detail)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredResep.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-400">
                  Belum ada data resep terdaftar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
          <p class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, filteredResep.length) }} dari {{ filteredResep.length }} data
          </p>
          <UPagination v-model:page="currentPage" active-color="primary" :total="filteredResep.length" />
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <div v-if="showConfirmDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-red-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 class="text-lg font-bold text-gray-800">
              Konfirmasi Penghapusan
            </h2>
          </div>
          <p class="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus data resep ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex justify-end gap-3">
            <button class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition" @click="cancelDelete">
              Batal
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition" @click="hapusResep">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
