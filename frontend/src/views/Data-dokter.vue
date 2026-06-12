<script setup>
import { computed, onMounted, ref } from 'vue'
import { dokterService, poliService } from '../services/dokter'

const daftarPoli = ref([])
const listDokter = ref([])

async function fetchPoli() {
  try {
    daftarPoli.value = await poliService.getAllPoli()
  }
  catch (error) {
    console.error('Gagal mengambil data poli', error)
  }
}

async function fetchDokter() {
  try {
    listDokter.value = await dokterService.getAllDokter()
  }
  catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchPoli()
  fetchDokter()
})

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(listDokter.value.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return listDokter.value.slice(start, start + itemsPerPage)
})

function prevPage() {
  if (currentPage.value > 1)
    currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value)
    currentPage.value++
}
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Data Dokter
        </h3>
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
                  Nama Dokter
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  NIP
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  No Telepon
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in paginatedData" :key="doc.id_dokter" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 text-gray-600">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-5 py-4 text-gray-800 font-medium">
                  {{ doc.nama_dokter }}
                </td>
                <td class="px-5 py-4 text-gray-600">
                  {{ doc.nip || '-' }}
                </td>
                <td class="px-5 py-4 text-gray-600 text-sm">
                  {{ doc.no_telepon || '-' }}
                </td>
              </tr>
              <tr v-if="listDokter.length === 0">
                <td colspan="4" class="py-12 text-center text-gray-400">
                  Data tidak ditemukan atau sedang memuat...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
          <p class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, listDokter.length) }} dari {{ listDokter.length }} data
          </p>
          <UPagination v-model:page="currentPage" active-color="primary" :total="listDokter.length" />
        </div>
      </div>
    </div>
  </div>
</template>
