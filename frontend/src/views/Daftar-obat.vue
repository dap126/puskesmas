<template>
<div class="p-6 bg-gray-50 min-h-screen">

  <!-- Judul -->
  <h3 class="text-3xl font-medium text-gray-700">
    Daftar Obat
  </h3>

  <!-- Search + Button -->
  <div class="flex flex-wrap items-center justify-between gap-4 mt-4">

    <input
      v-model="search"
      type="text"
      placeholder="Cari obat..."
      class="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <button
      @click="openTambah"
      class="whitespace-nowrap px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500"
    >
      + Tambah Obat
    </button>

  </div>


  <!-- Table -->
  <div class="mt-8 overflow-hidden bg-white rounded-lg shadow">

    <table class="min-w-full">

      <thead class="bg-gray-100">
        <tr>

          <th class="px-6 py-3 text-left">No</th>
          <th class="px-6 py-3 text-left">Nama Obat</th>
          <th class="px-6 py-3 text-left">Kategori</th>
          <th class="px-6 py-3 text-left">Stok</th>
          <th class="px-6 py-3 text-left">Satuan</th>
          <th class="px-6 py-3 text-left">Aksi</th>

        </tr>
      </thead>

      <tbody>

        <tr
          v-for="(obat,index) in filteredObat"
          :key="obat.id_obat"
          class="border-b"
        >

          <td class="px-6 py-4">
            {{ index + 1 }}
          </td>

          <td class="px-6 py-4">
            {{ obat.nama_obat }}
          </td>

          <td class="px-6 py-4">
            {{ obat.kategori }}
          </td>

          <td class="px-6 py-4">

            <span
              :class="obat.stok < 20 
              ? 'px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full'
              : 'px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full'"
            >
              {{ obat.stok }}
            </span>

          </td>

          <td class="px-6 py-4">
            {{ obat.satuan }}
          </td>

          <td class="px-6 py-4 flex gap-2">

            <button
              @click="editObat(obat)"
              class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-400"
            >
              Edit
            </button>

            <button
              @click="hapusObat(obat.id_obat)"
              class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-400"
            >
              Hapus
            </button>

          </td>

        </tr>

      </tbody>

    </table>

  </div>



  <!-- MODAL FORM -->
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div class="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-xl">
      <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          {{ editMode ? "Edit Obat" : "Tambah Obat Baru" }}
        </h3>
        <button @click="tutupModal" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="simpanObat" class="grid grid-cols-2 gap-5">
        <!-- Alert Error di dalam Modal -->
        <div v-if="pesanError" class="col-span-2">
          <p class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
            {{ pesanError }}
          </p>
        </div>

        <div class="flex flex-col col-span-2">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Nama Obat</label>
          <input
            v-model="form.nama_obat"
            type="text"
            placeholder="Masukkan Nama Obat"
            required
            class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
          />
        </div>

        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Kategori</label>
          <input
            v-model="form.kategori"
            type="text"
            placeholder="Masukkan Kategori"
            required
            class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
          />
        </div>

        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Stok</label>
          <input
            v-model="form.stok"
            type="number"
            placeholder="Jumlah Stok"
            required
            class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
          />
        </div>

        <div class="flex flex-col col-span-2">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Satuan</label>
          <input
            v-model="form.satuan"
            type="text"
            placeholder="Tablet/Botol/dll"
            required
            class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
          />
        </div>

        <div class="col-span-2 flex justify-end gap-3 mt-4 pt-5 border-t border-gray-100">
          <button type="button" @click="tutupModal" class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">Batal</button>
          <button type="submit" class="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">Simpan</button>
        </div>
      </form>
    </div>
  </div>

</div>
</template>



<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { obatService, type Obat } from '../services/farmasi'

const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const daftarObat = ref<Obat[]>([])
const pesanError = ref('')

const form = ref<Obat>({
  id_obat: undefined,
  nama_obat: '',
  kategori: '',
  stok: 0,
  satuan: ''
})

const filteredObat = computed(() => {
  return daftarObat.value.filter(o =>
    o.nama_obat.toLowerCase().includes(search.value.toLowerCase())
  )
})

async function fetchObat() {
  try {
    const data = await obatService.getAllObat()
    daftarObat.value = data
  } catch (error) {
    console.error('Gagal mengambil data obat', error)
  }
}

function openTambah() {
  editMode.value = false
  form.value = {
    id_obat: undefined,
    nama_obat: '',
    kategori: '',
    stok: 0,
    satuan: ''
  }
  pesanError.value = ''
  showModal.value = true
}

function editObat(obat: Obat) {
  editMode.value = true
  form.value = { ...obat }
  pesanError.value = ''
  showModal.value = true
}

async function simpanObat() {
  pesanError.value = ''
  try {
    if (editMode.value && form.value.id_obat) {
      // Not implemented in backend yet, just placeholder
      console.log('Update not implemented in backend')
    } else {
      await obatService.createObat({
        nama_obat: form.value.nama_obat,
        kategori: form.value.kategori,
        stok: form.value.stok,
        satuan: form.value.satuan
      })
    }
    fetchObat()
    tutupModal()
  } catch (error: any) {
    console.error('Gagal menyimpan obat:', error)
    pesanError.value = error.message || 'Gagal menyimpan obat. Silakan coba lagi.'
  }
}

async function hapusObat(id: number | undefined) {
  if (!id) return
  if (confirm('Yakin ingin menghapus obat ini?')) {
    try {
      await obatService.deleteObat(id)
      fetchObat()
    } catch (error) {
      console.error('Gagal menghapus obat:', error)
    }
  }
}

function tutupModal() {
  showModal.value = false
}

onMounted(() => {
  fetchObat()
})
</script>
