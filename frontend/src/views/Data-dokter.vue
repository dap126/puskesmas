<script setup>
import { ref, onMounted } from 'vue'
import { dokterService, poliService } from '../services/dokter'

const showModal = ref(false)
const daftarPoli = ref([])

const pesanSukses = ref('')
const pesanError = ref('')

const form = ref({
  nama_dokter: '',
  jadwal_praktik: '',
  users_idusers: '',
  poli_id_poli: ''
})

// ambil data poli (buat dropdown)
const fetchPoli = async () => {
  try {
    daftarPoli.value = await poliService.getAllPoli()
  } catch (error) {
    pesanError.value = error.message
  }
}

// buka modal
const openAddModal = () => {
  form.value = {
    nama_dokter: '',
    jadwal_praktik: '',
    users_idusers: '',
    poli_id_poli: ''
  }
  pesanSukses.value = ''
  pesanError.value = ''
  showModal.value = true
}

// tutup modal
const closeModal = () => {
  showModal.value = false
}

// submit
const handleSubmitDokter = async () => {
  pesanSukses.value = ''
  pesanError.value = ''

  try {
    await dokterService.createDokter({
      nama_dokter: form.value.nama_dokter,
      jadwal_praktik: form.value.jadwal_praktik,
      users_idusers: Number(form.value.users_idusers),
      poli_id_poli: Number(form.value.poli_id_poli)
    })

    pesanSukses.value = 'Data dokter berhasil ditambahkan'
    closeModal()

  } catch (error) {
    pesanError.value = error.message
  }
}

onMounted(() => {
  fetchPoli()
})
</script>

<template>
  <!-- tombol -->
  <button 
    @click="openAddModal"
    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
  >
    Tambah Dokter
  </button>

  <!-- modal -->
  <div 
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
  >
    <div class="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">

      <h2 class="text-lg font-semibold mb-4">Tambah Dokter</h2>

      <div class="space-y-3">
        <input 
          v-model="form.nama_dokter"
          placeholder="Nama Dokter"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input 
          v-model="form.jadwal_praktik"
          placeholder="Jadwal Praktik"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input 
          v-model="form.users_idusers"
          type="number"
          placeholder="ID User"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <select 
          v-model="form.poli_id_poli"
          class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
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

      <div class="flex justify-end gap-2 mt-5">
        <button 
          @click="closeModal"
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Batal
        </button>

        <button 
          @click="handleSubmitDokter"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Simpan
        </button>
      </div>

      <p v-if="pesanSukses" class="text-green-600 mt-3 text-sm">
        {{ pesanSukses }}
      </p>
      <p v-if="pesanError" class="text-red-600 mt-3 text-sm">
        {{ pesanError }}
      </p>

    </div>
  </div>
</template>
