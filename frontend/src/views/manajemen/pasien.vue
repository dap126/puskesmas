<script>
import { computed, onMounted, ref } from 'vue'
import { pasienService } from '../../services/pasien'
import Swal from 'sweetalert2'

export default {
  setup() {
    const pasienList = ref([])
    const showModal = ref(false)
    const currentPasienId = ref(null)

    const form = ref({
      nama_pasien: '',
      no_telepon: '',
      alamat: '',
    })

    // Delete Dialog State
    const showConfirmDialog = ref(false)
    const deleteId = ref(null)

    const fetchPasien = async () => {
      try {
        const data = await pasienService.getAllPasien()
        pasienList.value = data.map(p => ({
          ...p,
          no_telpon: p.no_telpon || '-',
        }))
      }
      catch (error) {
        console.error(error.message)
      }
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
            window.location.reload()
          }
        })
      }
      catch (error) {
        console.error('Gagal update pasien:', error.message)
      }
    }

    const openConfirmDialog = (id) => {
      deleteId.value = id
      showConfirmDialog.value = true
    }

    const cancelDelete = () => {
      showConfirmDialog.value = false
      deleteId.value = null
    }

    const confirmDelete = async () => {
      if (!deleteId.value)
        return

      try {
        await pasienService.deletePasien(deleteId.value)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data pasien berhasil dihapus',
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
          }
        })
      }
      catch (error) {
        console.error('Gagal menghapus pasien:', error.message)
        showConfirmDialog.value = false
      }
    }

    onMounted(() => {
      fetchPasien()
    })

    const currentPage = ref(1)
    const itemsPerPage = 10

    const totalPages = computed(() => Math.ceil(pasienList.value.length / itemsPerPage))
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      return pasienList.value.slice(start, start + itemsPerPage)
    })

    const prevPage = () => {
      if (currentPage.value > 1)
        currentPage.value--
    }
    const nextPage = () => {
      if (currentPage.value < totalPages.value)
        currentPage.value++
    }

    return {
      pasienList,
      showModal,
      form,
      showConfirmDialog,
      deleteId,
      editPasien,
      closeForm,
      submitForm,
      openConfirmDialog,
      cancelDelete,
      confirmDelete,
      fetchPasien,
      currentPage,
      itemsPerPage,
      totalPages,
      paginatedData,
      prevPage,
      nextPage,
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

      <!-- Alerts removed -->

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
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
                    <button @click="openConfirmDialog(pasien.idpasien)" class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus Pasien">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="pasienList.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-400">
                  Belum ada data pasien terdaftar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
          <p class="text-sm text-gray-600">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - 
            {{ Math.min(currentPage * itemsPerPage, pasienList.length) }} dari {{ pasienList.length }} data
          </p>
          <UPagination v-model:page="currentPage" active-color="primary" :total="pasienList.length" />
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <div v-if="showConfirmDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Konfirmasi Penghapusan</h2>
          <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus data pasien ini?</p>
          <div class="flex justify-end gap-3">
            <button class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition" @click="cancelDelete">
              Batal
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition" @click="confirmDelete">
              Hapus
            </button>
          </div>
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

            <!-- Alerts removed -->

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
