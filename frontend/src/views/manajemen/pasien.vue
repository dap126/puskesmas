<script>
import { computed, onMounted, ref } from 'vue'
import { pasienService, antreanService } from '../../services/pasien'
import { medisService } from '../../services/medis'
import Swal from 'sweetalert2'

export default {
  setup() {
    const activeTab = ref('pasien')
    const pasienList = ref([])
    const antreanList = ref([])
    const medisList = ref([])
    const showModal = ref(false)
    const currentPasienId = ref(null)
    const isLoading = ref(true)

    const form = ref({
      nama_pasien: '',
      no_telepon: '',
      alamat: '',
    })

    const fetchAllData = async () => {
      isLoading.value = true
      try {
        const [pData, aData, mData] = await Promise.all([
          pasienService.getAllPasien(),
          antreanService.getSeluruhAntrean(),
          medisService.getAllMedis()
        ])
        pasienList.value = pData.map(p => ({
          ...p,
          no_telepon: p.no_telepon || '-',
        }))
        antreanList.value = aData
        medisList.value = mData
      }
      catch (error) {
        console.error(error.message)
      }
      finally {
        isLoading.value = false
      }
    }

    const getPasienName = (id) => {
      const p = pasienList.value.find(p => p.idpasien === Number(id))
      return p ? p.nama_pasien : 'Unknown'
    }

    const editPasien = (pasien) => {
      currentPasienId.value = pasien.idpasien
      form.value = {
        nama_pasien: pasien.nama_pasien,
        no_telepon: pasien.no_telepon || '',
        alamat: pasien.alamat,
      }
      showModal.value = true
    }

    const closeForm = () => {
      showModal.value = false
    }

    const submitForm = async () => {
      try {
        await pasienService.updatePasien(currentPasienId.value, form.value)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data pasien berhasil diupdate',
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            closeForm()
            fetchAllData()
          }
        })
      }
      catch (error) {
        console.error('Gagal update pasien:', error.message)
      }
    }

    const confirmDelete = (type, id) => {
      Swal.fire({
        title: 'Konfirmasi Penghapusan',
        text: `Apakah Anda yakin ingin menghapus data ${type} ini permanen?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            if (type === 'pasien') {
              await pasienService.deletePasien(id)
            } else if (type === 'antrean') {
              await antreanService.deleteAntrean(id)
            } else if (type === 'riwayat') {
              await medisService.deleteMedis(id)
            }
            
            Swal.fire('Terhapus!', `Data ${type} berhasil dihapus.`, 'success')
            fetchAllData()
          } catch (error) {
            const errorMessage = error.response?.data?.error || `Gagal menghapus data ${type}.`
            Swal.fire('Gagal!', errorMessage, 'error')
          }
        }
      })
    }

    const confirmResetSemuaAntrean = () => {
      Swal.fire({
        title: 'Konfirmasi Reset',
        text: 'Apakah Anda yakin ingin menghapus SELURUH daftar antrean tanpa terkecuali? Tindakan ini tidak dapat dibatalkan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Reset Semua!',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await antreanService.resetSemuaAntrean()
            Swal.fire('Berhasil!', res.message || 'Seluruh antrean berhasil direset.', 'success')
            fetchAllData()
          } catch (error) {
            const errorMessage = error.response?.data?.error || 'Gagal mereset semua antrean.'
            Swal.fire('Gagal!', errorMessage, 'error')
          }
        }
      })
    }

    onMounted(() => {
      fetchAllData()
    })

    const currentPage = ref(1)
    const itemsPerPage = 10

    const activeList = computed(() => {
      if (activeTab.value === 'pasien') return pasienList.value
      if (activeTab.value === 'antrean') return antreanList.value
      if (activeTab.value === 'riwayat') return medisList.value
      return []
    })

    const totalPages = computed(() => Math.ceil(activeList.value.length / itemsPerPage))
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      return activeList.value.slice(start, start + itemsPerPage)
    })

    return {
      activeTab,
      pasienList,
      antreanList,
      medisList,
      showModal,
      form,
      editPasien,
      closeForm,
      submitForm,
      confirmDelete,
      confirmResetSemuaAntrean,
      getPasienName,
      currentPage,
      itemsPerPage,
      totalPages,
      paginatedData,
      activeList,
      isLoading
    }
  },
}
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">Manajemen Pasien</h3>
      </div>

      <!-- Navbar Tabs -->
      <div class="flex justify-between items-center border-b border-gray-200 mb-6">
        <div class="flex space-x-4">
          <button
            :class="activeTab === 'pasien' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-3 border-b-2 font-medium text-sm transition-colors"
            @click="activeTab = 'pasien'; currentPage = 1"
          >
            Data Pasien
          </button>
          <button
            :class="activeTab === 'antrean' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-3 border-b-2 font-medium text-sm transition-colors"
            @click="activeTab = 'antrean'; currentPage = 1"
          >
            Antrean
          </button>
          <button
            :class="activeTab === 'riwayat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="whitespace-nowrap py-3 border-b-2 font-medium text-sm transition-colors"
            @click="activeTab = 'riwayat'; currentPage = 1"
          >
            Riwayat Medis Pasien
          </button>
        </div>
        
        <button
          v-if="activeTab === 'antrean'"
          class="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-sm text-sm disabled:opacity-50"
          :disabled="antreanList.length === 0"
          @click="confirmResetSemuaAntrean"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
          </svg>
          Hapus Semua Antrean
        </button>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="overflow-x-auto">
          <!-- TAB PASIEN -->
          <table v-if="activeTab === 'pasien'" class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-4 font-semibold text-gray-600">No</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Nama Pasien</th>
                <th class="px-5 py-4 font-semibold text-gray-600">No Telpon</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Alamat</th>
                <th class="px-5 py-4 font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="5" class="py-12 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
              <tr v-else-if="paginatedData.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-400">
                  Belum ada data pasien terdaftar.
                </td>
              </tr>
              <template v-else>
                <tr v-for="(pasien, index) in paginatedData" :key="pasien.idpasien" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                  <td class="px-5 py-4 text-gray-600">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td class="px-5 py-4 text-gray-800 font-medium">{{ pasien.nama_pasien }}</td>
                  <td class="px-5 py-4 text-gray-600 text-sm">{{ pasien.no_telepon || '-' }}</td>
                  <td class="px-5 py-4 text-gray-600">{{ pasien.alamat || '-' }}</td>
                  <td class="px-5 py-4 align-middle">
                    <div class="flex justify-center gap-2">
                      <button @click="editPasien(pasien)" class="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 shadow-sm transition" title="Edit Pasien">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Zm0 0L19.5 7.15M6.832 19.82l-1.897-1.13" />
                        </svg>
                      </button>
                      <button @click="confirmDelete('pasien', pasien.idpasien)" class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus Pasien">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <!-- TAB ANTREAN -->
          <table v-if="activeTab === 'antrean'" class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-4 font-semibold text-gray-600">No Antrean</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Nama Pasien</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Tanggal</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Status</th>
                <th class="px-5 py-4 font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="5" class="py-12 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
              <tr v-else-if="paginatedData.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-400">
                  Belum ada data antrean terdaftar.
                </td>
              </tr>
              <template v-else>
                <tr v-for="(antrean) in paginatedData" :key="antrean.idantrean" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                  <td class="px-5 py-4 text-gray-800 font-medium">{{ antrean.no_antrean }}</td>
                  <td class="px-5 py-4 text-gray-800">{{ getPasienName(antrean.pasien_idpasien) }}</td>
                  <td class="px-5 py-4 text-gray-600 text-sm">{{ antrean.tgl_antrean ? new Date(antrean.tgl_antrean).toLocaleDateString('id-ID') : '-' }}</td>
                  <td class="px-5 py-4 text-gray-600 text-sm">
                    <span v-if="antrean.status === 'Menunggu' || antrean.status === 'menunggu'" class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>
                    <span v-else-if="antrean.status === 'Selesai' || antrean.status === 'selesai'" class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>
                    <span v-else class="text-gray-400">{{ antrean.status || '-' }}</span>
                  </td>
                  <td class="px-5 py-4 align-middle">
                    <div class="flex justify-center gap-2">
                      <button @click="confirmDelete('antrean', antrean.idantrean)" class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus Permanen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <!-- TAB RIWAYAT MEDIS -->
          <table v-if="activeTab === 'riwayat'" class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-4 font-semibold text-gray-600">No RM</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Nama Pasien</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Keluhan</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Diagnosa</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Tanggal</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Status Resep</th>
                <th class="px-5 py-4 font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="7" class="py-12 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
              <tr v-else-if="paginatedData.length === 0">
                <td colspan="7" class="py-12 text-center text-gray-400">
                  Belum ada data riwayat medis terdaftar.
                </td>
              </tr>
              <template v-else>
                <tr v-for="(rm) in paginatedData" :key="rm.id_rm" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                  <td class="px-5 py-4 text-gray-800 font-medium">RM-{{ String(rm.id_rm).padStart(4, '0') }}</td>
                  <td class="px-5 py-4 text-gray-800">{{ getPasienName(rm.pasien_idpasien) }}</td>
                  <td class="px-5 py-4 text-gray-600 text-sm">{{ rm.keluhan || '-' }}</td>
                  <td class="px-5 py-4 text-gray-600 text-sm">{{ rm.diagnosa || '-' }}</td>
                  <td class="px-5 py-4 text-gray-600 text-sm">{{ rm.tgl_periksa ? new Date(rm.tgl_periksa).toLocaleDateString('id-ID') : '-' }}</td>
                  <td class="px-5 py-4 text-gray-600 text-sm">
                    <span v-if="rm.status_tebus === 'belum'" class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Belum</span>
                    <span v-else-if="rm.status_tebus === 'sudah' || rm.status_tebus === 'selesai'" class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>
                    <span v-else-if="rm.status_tebus === 'batal'" class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Batal</span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-5 py-4 align-middle">
                    <div class="flex justify-center gap-2">
                      <button @click="confirmDelete('riwayat', rm.id_rm)" class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus Permanen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
          <p class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - 
            {{ Math.min(currentPage * itemsPerPage, activeList.length) }} dari {{ activeList.length }} data
          </p>
          <UPagination v-model:page="currentPage" active-color="primary" :total="activeList.length" />
        </div>
      </div>

      <!-- Modal Edit Pasien -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-xl">
          <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              Edit Pasien
            </h3>
            <button @click="closeForm" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-5">
            <div class="flex flex-col col-span-2">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Nama Pasien</label>
              <input 
                v-model="form.nama_pasien"
                placeholder="Masukkan Nama Pasien"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              />
            </div>
            
            <div class="flex flex-col col-span-2">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Nomor Telpon</label>
              <input 
                v-model="form.no_telepon"
                placeholder="Masukkan Nomor Telpon"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              />
            </div>
            
            <div class="flex flex-col col-span-2">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Alamat</label>
              <input 
                v-model="form.alamat"
                placeholder="Masukkan Alamat Pasien"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              />
            </div>

            <div class="col-span-2 flex justify-end gap-3 mt-2 pt-5 border-t border-gray-100">
              <button 
                type="button" 
                @click="closeForm" 
                class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button 
                type="submit" 
                class="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>