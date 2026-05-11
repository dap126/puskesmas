<script setup>
import { computed, onMounted, ref } from 'vue'
import { medisService } from '../services/medis'

// State untuk tabel & filter
const rawRiwayat = ref([])
const search = ref('')
const tanggal = ref('')

// State untuk modal detail
const modal = ref(false)
const detail = ref({})

// Fetch Data
async function fetchRiwayat() {
  try {
    const data = await medisService.getAllMedis()
    rawRiwayat.value = data.map((item) => {
      // Format tanggal
      const tgl = new Date(item.tgl_periksa)
      const formattedDate = !isNaN(tgl.getTime())
        ? tgl.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
        : item.tgl_periksa

      return {
        id: item.id_rm,
        tanggal: formattedDate,
        rawTanggal: tgl,
        pasien: item.nama_pasien || '-',
        dokter: item.nama_dokter || '-',
        keluhan: item.keluhan,
        diagnosa: item.diagnosa,
        tinggi_badan: item.tinggi_badan,
        berat_badan: item.berat_badan,
        tekanan_darah: item.tekanan_darah,
      }
    })
  }
  catch (error) {
    console.error(error)
  }
}

// Filtered Data
const riwayat = computed(() => {
  return rawRiwayat.value.filter((item) => {
    const matchName = item.pasien.toString().toLowerCase().includes(search.value.toLowerCase())

    let matchDate = true
    if (tanggal.value) {
      const filterDate = new Date(tanggal.value).toDateString()
      const itemDate = new Date(item.rawTanggal).toDateString()
      matchDate = filterDate === itemDate
    }

    return matchName && matchDate
  })
})

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(riwayat.value.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return riwayat.value.slice(start, start + itemsPerPage)
})

function prevPage() {
  if (currentPage.value > 1)
    currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value)
    currentPage.value++
}

function lihatDetail(item) {
  detail.value = item
  modal.value = true
}

onMounted(() => {
  fetchRiwayat()
})
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Riwayat Medis
        </h3>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <!-- FILTER -->
        <div class="flex flex-wrap items-center gap-4 mb-5">
          <div class="relative w-full sm:w-80">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Cari nama pasien..."
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 transition focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
            >
          </div>

          <div class="relative w-full sm:w-auto">
            <input
              v-model="tanggal"
              type="date"
              class="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg transition focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
            >
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Tanggal
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Nama Pasien
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Nama Dokter
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Keluhan
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Diagnosa
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 text-gray-600">
                  {{ item.tanggal }}
                </td>
                <td class="px-5 py-4 text-gray-800 font-medium">
                  {{ item.pasien }}
                </td>
                <td class="px-5 py-4 text-gray-600">
                  {{ item.dokter }}
                </td>
                <td class="px-5 py-4 text-gray-600">
                  {{ item.keluhan }}
                </td>
                <td class="px-5 py-4 text-gray-600">
                  {{ item.diagnosa }}
                </td>
                <td class="px-5 py-4 align-middle">
                  <div class="flex justify-center">
                    <button class="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 shadow-sm transition flex items-center gap-1.5 px-3" title="Lihat Detail" @click="lihatDetail(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span class="text-sm font-medium">Detail</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="riwayat.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-400">
                  Data tidak ditemukan...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
          <p class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, riwayat.length) }} dari {{ riwayat.length }} data
          </p>
          <UPagination v-model:page="currentPage" active-color="primary" :total="riwayat.length" />
        </div>
      </div>

      <!-- MODAL DETAIL -->
      <div v-if="modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
          <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
            <h2 class="text-xl font-bold text-gray-800">
              Detail Pemeriksaan
            </h2>
            <button class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors" @click="modal = false">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-3 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div class="grid grid-cols-2 gap-2 border-b pb-2">
              <p class="text-gray-500">
                Nama Pasien
              </p>
              <p class="font-semibold text-right text-gray-800">
                {{ detail.pasien }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-2 border-b pb-2">
              <p class="text-gray-500">
                Nama Dokter
              </p>
              <p class="font-semibold text-right text-gray-800">
                {{ detail.dokter }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-2 border-b pb-2">
              <p class="text-gray-500">
                Tanggal
              </p>
              <p class="font-semibold text-right text-gray-800">
                {{ detail.tanggal }}
              </p>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2 text-center">
              <div>
                <p class="text-gray-500 text-xs">
                  Tinggi
                </p>
                <p class="font-semibold text-gray-800">
                  {{ detail.tinggi_badan }} cm
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">
                  Berat
                </p>
                <p class="font-semibold text-gray-800">
                  {{ detail.berat_badan }} kg
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">
                  Tensi
                </p>
                <p class="font-semibold text-gray-800">
                  {{ detail.tekanan_darah }}
                </p>
              </div>
            </div>
            <div>
              <p class="text-gray-500 mb-1">
                Keluhan
              </p>
              <p class="text-gray-800 bg-white p-2 rounded border border-gray-200">
                {{ detail.keluhan }}
              </p>
            </div>
            <div>
              <p class="text-gray-500 mb-1">
                Diagnosa
              </p>
              <p class="text-gray-800 bg-white p-2 rounded border border-gray-200">
                {{ detail.diagnosa }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
              @click="modal = false"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
