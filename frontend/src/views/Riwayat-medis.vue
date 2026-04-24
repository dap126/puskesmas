<script setup>
import { ref, computed, onMounted } from 'vue'
import { medisService } from '../services/medis'

// State untuk tabel & filter
const rawRiwayat = ref([])
const search = ref('')
const tanggal = ref('')

// State untuk modal detail
const modal = ref(false)
const detail = ref({})



// Fetch Data
const fetchRiwayat = async () => {
  try {
    const data = await medisService.getAllMedis()
    rawRiwayat.value = data.map(item => {
      // Format tanggal
      const tgl = new Date(item.tgl_periksa)
      const formattedDate = !isNaN(tgl.getTime()) 
        ? tgl.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) 
        : item.tgl_periksa;

      return {
        id: item.id_rm,
        tanggal: formattedDate,
        rawTanggal: tgl,
        pasien: item.pasien_idpasien || '-',
        dokter: item.dokter_id_dokter || '-',
        keluhan: item.keluhan,
        diagnosa: item.diagnosa,
        tinggi_badan: item.tinggi_badan,
        berat_badan: item.berat_badan,
        tekanan_darah: item.tekanan_darah
      }
    })
  } catch (error) {
    console.error(error)
  }
}

// Filtered Data
const riwayat = computed(() => {
  return rawRiwayat.value.filter(item => {
    const matchName = item.pasien.toString().toLowerCase().includes(search.value.toLowerCase())
    
    let matchDate = true
    if (tanggal.value) {
      const filterDate = new Date(tanggal.value).toDateString()
      const itemDate = new Date(item.rawTanggal).toDateString()
      matchDate = filterDate === itemDate
    }

    return matchName && matchDate
  })
})

const lihatDetail = (item) => {
  detail.value = item
  modal.value = true
}



onMounted(() => {
  fetchRiwayat()
})
</script>

<template>
<div class="p-6 bg-gray-100 min-h-screen">

  <!-- HEADER -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Riwayat Medis</h1>
    <p class="text-gray-500">Data riwayat pemeriksaan pasien</p>
  </div>

  <!-- FILTER -->
  <div class="flex flex-wrap items-center gap-4 p-4 mb-6 bg-white shadow rounded-xl justify-between">
    
    <div class="flex flex-wrap items-center gap-4">
      <input
        v-model="search"
        type="text"
        placeholder="Cari nama pasien..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="date"
        v-model="tanggal"
        class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  <!-- TABLE -->
  <div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="w-full text-sm text-left">
      <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
        <tr>
          <th class="p-4">Tanggal</th>
          <th class="p-4">Pasien</th>
          <th class="p-4">Dokter</th>
          <th class="p-4">Keluhan</th>
          <th class="p-4">Diagnosa</th>
          <th class="p-4">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in riwayat"
          :key="item.id"
          class="border-t hover:bg-gray-50"
        >
          <td class="p-4">{{ item.tanggal }}</td>
          <td class="p-4 font-medium">{{ item.pasien }}</td>
          <td class="p-4">{{ item.dokter }}</td>
          <td class="p-4 text-gray-600">{{ item.keluhan }}</td>
          <td class="p-4 text-gray-700">{{ item.diagnosa }}</td>
          <td class="p-4">
            <button
              @click="lihatDetail(item)"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Detail
            </button>
          </td>
        </tr>
        <tr v-if="riwayat.length === 0">
          <td colspan="6" class="p-8 text-center text-gray-400">
            Data tidak ditemukan...
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MODAL DETAIL -->
  <div
    v-if="modal"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
      <h2 class="text-xl font-bold mb-4">Detail Pemeriksaan</h2>
      
      <div class="space-y-3 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div class="grid grid-cols-2 gap-2 border-b pb-2">
          <p class="text-gray-500">Pasien</p>
          <p class="font-semibold text-right">{{ detail.pasien }}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 border-b pb-2">
          <p class="text-gray-500">Dokter</p>
          <p class="font-semibold text-right">{{ detail.dokter }}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 border-b pb-2">
          <p class="text-gray-500">Tanggal</p>
          <p class="font-semibold text-right">{{ detail.tanggal }}</p>
        </div>
        <div class="grid grid-cols-3 gap-2 border-b pb-2 text-center">
          <div>
            <p class="text-gray-500 text-xs">Tinggi</p>
            <p class="font-semibold">{{ detail.tinggi_badan }} cm</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs">Berat</p>
            <p class="font-semibold">{{ detail.berat_badan }} kg</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs">Tensi</p>
            <p class="font-semibold">{{ detail.tekanan_darah }}</p>
          </div>
        </div>
        <div>
          <p class="text-gray-500 mb-1">Keluhan</p>
          <p class="text-gray-800 bg-white p-2 rounded border">{{ detail.keluhan }}</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">Diagnosa</p>
          <p class="text-gray-800 bg-white p-2 rounded border">{{ detail.diagnosa }}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="modal=false"
          class="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>



</div>
</template>