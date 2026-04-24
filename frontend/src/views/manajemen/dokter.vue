<script setup>
import { ref, onMounted } from 'vue'
import { dokterService, poliService } from '../../services/dokter'

const daftarPoli = ref([])
const listDokter = ref([])

const pesanSukses = ref('')
const pesanError = ref('')

const showModal = ref(false)

const form = ref({
  nama_dokter: '',
  nip: '',
  no_hp: '',
  hari_praktik: '',
  jam_mulai: '',
  jam_selesai: '',
  poli_id_poli: ''
})

// Delete Dialog State
const showConfirmDialog = ref(false)
const deleteId = ref(null)

const fetchPoli = async () => {
  try {
    daftarPoli.value = await poliService.getAllPoli()
  } catch (error) {
    pesanError.value = error.message
  }
}

const fetchDokter = async () => {
  try {
    listDokter.value = await dokterService.getAllDokter()
  } catch (error) {
    console.error(error)
  }
}

const openAddModal = () => {
  form.value = {
    nama_dokter: '',
    nip: '',
    no_hp: '',
    hari_praktik: '',
    jam_mulai: '',
    jam_selesai: '',
    poli_id_poli: ''
  }
  pesanSukses.value = ''
  pesanError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSubmitDokter = async () => {
  pesanSukses.value = ''
  pesanError.value = ''

  try {
    await dokterService.createDokter({
      nama_dokter: form.value.nama_dokter,
      nip: form.value.nip,
      no_hp: form.value.no_hp,
      jadwal_praktik: `${form.value.hari_praktik}, ${form.value.jam_mulai} - ${form.value.jam_selesai}`,
      users_idusers: null,
      poli_id_poli: Number(form.value.poli_id_poli)
    })

    pesanSukses.value = 'Data dokter berhasil ditambahkan'
    fetchDokter()
    setTimeout(() => {
      closeModal()
    }, 1500)
  } catch (error) {
    pesanError.value = error.message
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
  if (!deleteId.value) return
  try {
    await dokterService.deleteDokter(deleteId.value)
    showConfirmDialog.value = false
    fetchDokter()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchPoli()
  fetchDokter()
})
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">Manajemen Dokter</h3>
        <button @click="openAddModal" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Tambah Dokter
        </button>
      </div>

      <!-- Alert Sukses -->
      <div v-if="pesanSukses" class="mb-4">
        <p class="text-emerald-600 text-sm font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
          {{ pesanSukses }}
        </p>
      </div>

      <!-- Alert Error -->
      <div v-if="pesanError" class="mb-4">
        <p class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
          {{ pesanError }}
        </p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-4 font-semibold text-gray-600">No</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Nama Dokter</th>
                <th class="px-5 py-4 font-semibold text-gray-600">NIP</th>
                <th class="px-5 py-4 font-semibold text-gray-600">No. HP</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Poli</th>
                <th class="px-5 py-4 font-semibold text-gray-600">Jadwal Praktik</th>
                <th class="px-5 py-4 font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in listDokter" :key="doc.id_dokter" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
                <td class="px-5 py-4 text-gray-600">{{ index + 1 }}</td>
                <td class="px-5 py-4 text-gray-800 font-medium">{{ doc.nama_dokter }}</td>
                <td class="px-5 py-4 text-gray-600">{{ doc.nip }}</td>
                <td class="px-5 py-4 text-gray-600 text-sm">{{ doc.no_hp || '-' }}</td>
                <td class="px-5 py-4 text-gray-600">{{ doc.nama_poli || '-' }}</td>
                <td class="px-5 py-4 text-gray-600 text-sm">{{ doc.jadwal_praktik }}</td>
                <td class="px-5 py-4 align-middle">
                  <div class="flex justify-center gap-2">
                    <button class="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 shadow-sm transition" title="Edit Dokter">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Zm0 0L19.5 7.15M6.832 19.82l-1.897-1.13" />
                      </svg>
                    </button>
                    <button @click="openConfirmDialog(doc.id_dokter)" class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus Dokter">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="listDokter.length === 0">
                <td colspan="7" class="py-12 text-center text-gray-400">
                  Belum ada data dokter terdaftar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <div v-if="showConfirmDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Konfirmasi Penghapusan</h2>
          <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus data dokter ini?</p>
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

      <!-- Modal Tambah Dokter -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-xl">
          <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              Tambah Dokter
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmitDokter" class="grid grid-cols-2 gap-5">
            <div class="flex flex-col col-span-2">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Nama Dokter</label>
              <input 
                v-model="form.nama_dokter"
                placeholder="Masukkan Nama Dokter"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              />
            </div>
            
            <div class="flex flex-col col-span-2">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Jadwal Praktik</label>
              <div class="flex gap-2">
                <select 
                  v-model="form.hari_praktik"
                  required
                  class="w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 transition focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none bg-white"
                >
                  <option disabled value="">Pilih Hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                  <option value="Minggu">Minggu</option>
                </select>
                
                <input 
                  v-model="form.jam_mulai"
                  type="time"
                  required
                  class="w-1/4 px-4 py-2.5 rounded-lg border border-gray-300 transition focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
                />
                <span class="self-center text-gray-500 font-medium">-</span>
                <input 
                  v-model="form.jam_selesai"
                  type="time"
                  required
                  class="w-1/4 px-4 py-2.5 rounded-lg border border-gray-300 transition focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
                />
              </div>
            </div>
            
            <div class="flex flex-col col-span-2">
              <label class="mb-1.5 font-semibold text-gray-700 text-sm">Poli</label>
              <select 
                v-model="form.poli_id_poli"
                required
                class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none bg-white"
              >
                <option disabled value="">Pilih Poli</option>
                <option 
                  v-for="poli in daftarPoli"
                  :key="poli.id_poli"
                  :value="poli.id_poli"
                >
                  {{ poli.nama_poli }}
                </option>
              </select>
            </div>

            <div v-if="pesanSukses || pesanError" class="col-span-2 mt-2">
              <p v-if="pesanSukses" class="text-emerald-600 text-sm font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                {{ pesanSukses }}
              </p>
              <p v-if="pesanError" class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                {{ pesanError }}
              </p>
            </div>

            <div class="col-span-2 flex justify-end gap-3 mt-2 pt-5 border-t border-gray-100">
              <button 
                type="button" 
                @click="closeModal" 
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
