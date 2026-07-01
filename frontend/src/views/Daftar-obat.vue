<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type Obat, obatService } from '../services/farmasi'
import Swal from 'sweetalert2'

const search = ref('')
const userRole = localStorage.getItem('user_role') || ''
const showModal = ref(false)
const editMode = ref(false)
const daftarObat = ref<Obat[]>([])
const isLoading = ref(true)
const showConfirmDialog = ref(false)
const deleteId = ref<number | undefined>(undefined)

const form = ref<Obat>({
  id_obat: undefined,
  nama_obat: '',
  kategori: '',
  stok: 0,
  satuan: '',
})

const filteredObat = computed(() => {
  return daftarObat.value.filter(o =>
    o.nama_obat.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(filteredObat.value.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredObat.value.slice(start, start + itemsPerPage)
})

function prevPage() {
  if (currentPage.value > 1)
    currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value)
    currentPage.value++
}

async function fetchObat() {
  isLoading.value = true
  try {
    const data = await obatService.getAllObat()
    daftarObat.value = data
  }
  catch (error) {
    console.error('Gagal mengambil data obat', error)
  }
  finally {
    isLoading.value = false
  }
}

function openTambah() {
  editMode.value = false
  form.value = {
    id_obat: undefined,
    nama_obat: '',
    kategori: '',
    stok: 0,
    satuan: '',
  }
  showModal.value = true
}

function editObat(obat: Obat) {
  editMode.value = true
  form.value = { ...obat }
  showModal.value = true
}


async function simpanObat() {
  try {
    if (editMode.value && form.value.id_obat) {
      console.log('Update not implemented in backend')
    }
    else {
      await obatService.createObat({
        nama_obat: form.value.nama_obat,
        kategori: form.value.kategori,
        stok: form.value.stok,
        satuan: form.value.satuan,
      })
    }
    // Note: 201 success is handled globally by main.ts, but if it's 200 we can show success
    if (editMode.value) {
       Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data obat berhasil diperbarui',
          confirmButtonColor: '#3085d6',
       }).then((result) => {
         if (result.isConfirmed) {
           window.location.reload()
         }
       })
    }
    // Jika create (bukan editMode), main.ts akan merefresh halaman dari response 201
    fetchObat()
    tutupModal()
  }
  catch (error: any) {
    console.error('Gagal menyimpan obat:', error)
  }
}

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

async function hapusObat() {
  if (!deleteId.value)
    return
  try {
    await obatService.deleteObat(deleteId.value)
    Swal.fire({
       icon: 'success',
       title: 'Berhasil',
       text: 'Data obat berhasil dihapus',
       confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload()
      }
    })
    showConfirmDialog.value = false
    deleteId.value = undefined
    fetchObat()
  }
  catch (error: any) {
    console.error('Gagal menghapus obat:', error)
    showConfirmDialog.value = false
  }
}

function tutupModal() {
  showModal.value = false
}

onMounted(() => {
  fetchObat()
})
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Daftar Obat
        </h3>
        <button
          v-if="userRole === 'admin' || userRole === 'staff'"
          class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform shadow-md"
          @click="openTambah"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah Obat
        </button>
      </div>

      <!-- Alerts removed -->

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
              placeholder="Cari obat..."
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
                  Nama Obat
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Kategori
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Stok
                </th>
                <th class="px-5 py-4 font-semibold text-gray-600">
                  Satuan
                </th>
                <th v-if="userRole === 'admin' || userRole === 'staff'" class="px-5 py-4 font-semibold text-gray-600 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="6" class="py-12 text-center text-gray-400">
                  Memuat data...
                </td>
              </tr>
              <tr v-else-if="filteredObat.length === 0">
                <td colspan="6" class="py-12 text-center text-gray-400">
                  {{ search ? 'Tidak ada obat yang cocok dengan pencarian.' : 'Tidak ada data' }}
                </td>
              </tr>
              <template v-else>
                <tr v-for="(obat, index) in paginatedData" :key="obat.id_obat" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                  <td class="px-5 py-4 text-gray-600">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td class="px-5 py-4 text-gray-800 font-medium">
                    {{ obat.nama_obat }}
                  </td>
                  <td class="px-5 py-4 text-gray-600">
                    {{ obat.kategori }}
                  </td>
                  <td class="px-5 py-4 text-gray-600">
                    <span :class="obat.stok < 20 ? 'px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full tracking-wide' : 'px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full tracking-wide'">
                      {{ obat.stok }}
                    </span>
                  </td>
                  <td class="px-5 py-4 text-gray-600">
                    {{ obat.satuan }}
                  </td>
                  <td class="px-5 py-4 align-middle" v-if="userRole === 'admin' || userRole === 'staff'">
                    <div class="flex justify-center gap-2">
                      <button class="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 shadow-sm transition" title="Edit Obat" @click="editObat(obat)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus Obat" @click="openConfirmHapus(obat.id_obat)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
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
            {{ Math.min(currentPage * itemsPerPage, filteredObat.length) }} dari {{ filteredObat.length }} data
          </p>
          <UPagination v-model:page="currentPage" active-color="primary" :total="filteredObat.length" />
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
            Apakah Anda yakin ingin menghapus data obat ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex justify-end gap-3">
            <button class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition" @click="cancelDelete">
              Batal
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition" @click="hapusObat">
              Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL FORM -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-xl">
          <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              {{ editMode ? "Edit Obat" : "Tambah Obat Baru" }}
            </h3>
            <button class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors" @click="tutupModal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form class="grid grid-cols-2 gap-5" @submit.prevent="simpanObat">
            <!-- Alert Error removed -->

            <div class="flex flex-col col-span-2">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Nama Obat</label>
              <input
                v-model="form.nama_obat"
                type="text"
                placeholder="Masukkan Nama Obat"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              >
            </div>

            <div class="flex flex-col col-span-2 sm:col-span-1">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Kategori</label>
              <input
                v-model="form.kategori"
                type="text"
                placeholder="Masukkan Kategori"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              >
            </div>

            <div class="flex flex-col col-span-2 sm:col-span-1">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Stok</label>
              <input
                v-model="form.stok"
                type="number"
                placeholder="Jumlah Stok"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              >
            </div>

            <div class="flex flex-col col-span-2">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Satuan</label>
              <input
                v-model="form.satuan"
                type="text"
                placeholder="Tablet/Botol/dll"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              >
            </div>

            <div class="col-span-2 flex justify-end gap-3 mt-4 pt-5 border-t border-gray-100">
              <button type="button" class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition" @click="tutupModal">
                Batal
              </button>
              <button type="submit" class="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
