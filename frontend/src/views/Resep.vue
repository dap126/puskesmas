<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { detailresepService, type DetailResep, obatService, type Obat } from '../services/farmasi'

// STATE
const daftarDetail = ref<DetailResep[]>([])
const daftarObat = ref<Obat[]>([])

const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const editId = ref<number | null>(null)

// FORM
const form = ref({
  resep_obat_id_resep: 0,
  obat_id_obat: '',
  jumlah_obat: 0,
  dosis: ''
})

// ================= GET DATA =================
const fetchDetail = async () => {
  try {
    const data = await detailresepService.getAllDetailResep()
    daftarDetail.value = data
  } catch (error: any) {
    console.error(error.message)
  }
}

const fetchObat = async () => {
  try {
    const data = await obatService.getAllObat()
    daftarObat.value = data
  } catch (error: any) {
    console.error(error.message)
  }
}

// ================= FILTER =================
const filteredResep = computed(() => {
  return daftarDetail.value.filter((item) => {
    const namaObat = getNamaObat(item.obat_id_obat).toLowerCase()
    return (
      namaObat.includes(search.value.toLowerCase()) ||
      String(item.resep_obat_id_resep).includes(search.value)
    )
  })
})

// ================= HELPER =================
const getNamaObat = (id: number) => {
  const obat = daftarObat.value.find(o => o.id_obat === id)
  return obat ? obat.nama_obat : '-'
}

// ================= MODAL =================
const openTambah = () => {
  editMode.value = false
  editId.value = null
  form.value = {
    resep_obat_id_resep: 0,
    obat_id_obat: '',
    jumlah_obat: 0,
    dosis: ''
  }
  showModal.value = true
}

const tutupModal = () => {
  showModal.value = false
}

// ================= SIMPAN =================
const simpanResep = async () => {
  try {
    if (editMode.value && editId.value !== null) {
      // kalau kamu punya API update, pakai di sini
      console.log('update belum dibuat')
    } else {
      await detailresepService.createDetailResep({
        ...form.value,
        obat_id_obat: Number(form.value.obat_id_obat)
      } as DetailResep)
    }

    fetchDetail()
    tutupModal()

  } catch (error: any) {
    console.error(error.message)
  }
}

// ================= EDIT =================
const editResep = (item: DetailResep) => {
  editMode.value = true
  editId.value = item.id_detail ?? null

  form.value = {
    resep_obat_id_resep: item.resep_obat_id_resep,
    obat_id_obat: String(item.obat_id_obat),
    jumlah_obat: item.jumlah_obat,
    dosis: item.dosis
  }

  showModal.value = true
}

// ================= DELETE =================
const hapusResep = async (id: number) => {
  if (confirm('Yakin ingin menghapus?')) {
    try {
      await detailresepService.deleteDetailResep(id)
      fetchDetail()
    } catch (error: any) {
      console.error(error.message)
    }
  }
}

// ================= INIT =================
onMounted(() => {
  fetchDetail()
  fetchObat()
})
</script>

<template>
<div class="p-6 bg-gray-50 min-h-screen">

  <!-- Judul -->
  <h3 class="text-3xl font-medium text-gray-700 mb-6">
    Daftar Resep
  </h3>

  <!-- Search + Button -->
  <div class="flex flex-wrap items-center justify-between gap-4 mt-4">

    <input
      v-model="search"
      type="text"
      placeholder="Cari resep atau obat..."
      class="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <button
      @click="openTambah"
      class="whitespace-nowrap px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500"
    >
      + Tambah Resep
    </button>

  </div>

  <!-- Table -->
  <div class="mt-8 overflow-hidden bg-white rounded-lg shadow">

    <table class="min-w-full">

      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3">No</th>
          <th class="px-6 py-3">Kode Detail</th>
          <th class="px-6 py-3">Kode Resep</th>
          <th class="px-6 py-3">Nama Obat</th>
          <th class="px-6 py-3">Jumlah</th>
          <th class="px-6 py-3">Dosis</th>
          <th class="px-6 py-3">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(item,index) in filteredResep"
          :key="item.id_detail"
          class="border-b"
        >

          <td class="px-6 py-4">{{ index + 1 }}</td>

          <td class="px-6 py-4">
            DTL-{{ item.id_detail }}
          </td>

          <td class="px-6 py-4">
            RSP-{{ item.resep_obat_id_resep }}
          </td>

          <td class="px-6 py-4">
            {{ getNamaObat(item.obat_id_obat) }}
          </td>

          <td class="px-6 py-4">
            <span class="px-2 py-1 text-xs font-semibold bg-blue-200 text-blue-800 rounded-full">
              {{ item.jumlah_obat }}
            </span>
          </td>

          <td class="px-6 py-4">
            {{ item.dosis }}
          </td>

          <td class="px-6 py-4 flex gap-2">

            <button
              @click="editResep(item)"
              class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-400"
            >
              Edit
            </button>

            <button
              @click="item.id_detail && hapusResep(item.id_detail)"
              class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-400"
            >
              Hapus
            </button>

          </td>

        </tr>
      </tbody>

    </table>

  </div>


  <!-- MODAL -->
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div class="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-xl">
      <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          {{ editMode ? "Edit Resep" : "Tambah Resep Baru" }}
        </h3>
        <button @click="tutupModal" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="simpanResep" class="grid grid-cols-2 gap-5">
        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">ID Resep</label>
          <input
            v-model="form.resep_obat_id_resep"
            type="number"
            placeholder="Masukkan ID Resep"
            required
            class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
          />
        </div>

        <!-- Dropdown Obat -->
        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Obat</label>
          <select
            v-model="form.obat_id_obat"
            required
            class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
          >
            <option disabled value="">Pilih Obat</option>
            <option
              v-for="o in daftarObat"
              :key="o.id_obat"
              :value="o.id_obat"
            >
              {{ o.nama_obat }}
            </option>
          </select>
        </div>

        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Jumlah Obat</label>
          <input
            v-model="form.jumlah_obat"
            type="number"
            placeholder="Masukkan Jumlah"
            required
            class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
          />
        </div>

        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Dosis</label>
          <input
            v-model="form.dosis"
            type="text"
            placeholder="Contoh: 3 x 1 hari"
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
