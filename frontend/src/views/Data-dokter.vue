<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Import interface dan service dari folder services
import { dokterService } from '../services/dokter'

const listDokter = ref<any[]>([])
const showConfirmDialog = ref(false)
const selectedDokterId = ref<number | null>(null)

async function muatData() {
  try {
    // Memanggil fungsi dari file dokter.ts di folder services
    listDokter.value = await dokterService.getAllDokter()
  }
  catch (error) {
    console.error('Gagal mengambil data:', error)
    // Mock data jika API belum siap agar tidak kosong melompong
    listDokter.value = [
      { id_dokter: 1, nama_dokter: 'dr. Strange', jadwal_praktik: 'Malam Hari', users_idusers: 1, poli_id_poli: 1 },
    ]
  }
}

function openConfirmDialog(id: number) {
  selectedDokterId.value = id
  showConfirmDialog.value = true
}

async function confirmDelete() {
  if (selectedDokterId.value !== null) {
    await dokterService.deleteDokter(selectedDokterId.value)
    muatData() // Refresh tabel
    showConfirmDialog.value = false
    selectedDokterId.value = null
  }
}

function cancelDelete() {
  showConfirmDialog.value = false
  selectedDokterId.value = null
}

onMounted(() => {
  muatData()
})
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          Manajemen Data Dokter
        </h1>
        <button class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition">
          + Tambah Dokter
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-4 border-b font-semibold text-gray-700">
                Nama
              </th>
              <th class="p-4 border-b font-semibold text-gray-700">
                Jadwal
              </th>
              <th class="p-4 border-b font-semibold text-gray-700 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in listDokter" :key="doc.id_dokter" class="hover:bg-gray-50 transition">
              <td class="p-4 border-b">
                {{ doc.nama_dokter }}
              </td>
              <td class="p-4 border-b text-sm text-gray-600">
                {{ doc.jadwal_praktik }}
              </td>
              <td class="p-4 border-b text-center">
                <button class="text-blue-600 hover:underline mr-3">
                  Edit
                </button>
                <button class="text-red-500 hover:underline" @click="openConfirmDialog(doc.id_dokter!)">
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="listDokter.length === 0">
              <td colspan="3" class="p-8 text-center text-gray-400">
                Data tidak ditemukan atau sedang memuat...
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Confirmation Dialog -->
      <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm">
          <h2 class="text-lg font-bold text-gray-800 mb-4">
            Konfirmasi Penghapusan
          </h2>
          <p class="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus data dokter ini?
          </p>
          <div class="flex justify-end gap-3">
            <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition" @click="cancelDelete">
              Batal
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition" @click="confirmDelete">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
