<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { detailresepService, type DetailResep, obatService, type Obat } from '../services/farmasi'

// STATE
const daftarDetail = ref<DetailResep[]>([])
const daftarObat = ref<Obat[]>([])

const search = ref('')

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

const getNamaObat = (id: number) => {
  const obat = daftarObat.value.find(o => o.id_obat === id)
  return obat ? obat.nama_obat : '-'
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

  </div>

  <!-- Table -->
  <div class="mt-8 overflow-hidden bg-white rounded-lg shadow">

    <table class="min-w-full">

      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3">No</th>
          <th class="px-6 py-3">No Resep</th>
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
            RSP-{{ item.resep_obat_id_resep }}
          </td>

          <td class="px-6 py-4">
            {{ item.nama_obat }}
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
              @click="item.id_detail && hapusResep(item.id_detail)"
              class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-400"
            >
              Hapus
            </button>

          </td>

        </tr>
        <tr v-if="filteredResep.length === 0" class="text-sm text-gray-400 italic">
          <td colspan="6" class="text-center py-5">Belum ada data resep</td>
        </tr>
      </tbody>

    </table>

  </div>

</div>
</template>
