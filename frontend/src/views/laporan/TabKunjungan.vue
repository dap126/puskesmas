<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const dataKunjungan = ref([]);
const isLoading = ref(true);
const errorMsg = ref('');

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/laporan/kunjungan', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const raw = response.data?.data ?? [];
    dataKunjungan.value = raw.map((item, index) => ({
      id: index + 1,
      tanggal: item.tgl_antrean
        ? new Date(item.tgl_antrean).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-',
      no_antrean: item.no_antrean ?? '-',
      nama_pasien: item.nama_pasien ?? '-',
      poli: item.nama_poli ?? '-',
      nama_dokter: item.nama_dokter ?? '-',
      diagnosa: item.diagnosa ?? '-',
      status: item.status ?? '-'
    }));
  } catch (error) {
    console.error('Error fetching data kunjungan:', error);
    errorMsg.value = 'Gagal memuat data kunjungan. ' + (error.response?.data?.error ?? error.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in mt-4">
    
    <div class="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
      <h4 class="text-lg font-bold text-gray-800 m-0">
        Laporan Detail Kunjungan Pasien
      </h4>
      <button class="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors border border-indigo-100">
        Unduh Laporan
      </button>
    </div>

    <!-- Error -->
    <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
      {{ errorMsg }}
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table class="w-full text-sm text-left text-gray-600">
        
        <thead class="bg-gray-50 text-gray-700 font-semibold">
          <tr>
            <th class="px-5 py-3.5 border-b border-gray-200 w-12 text-center">No</th>
            <th class="px-5 py-3.5 border-b border-gray-200">Tanggal</th>
            <th class="px-5 py-3.5 border-b border-gray-200">No. Antrean</th>
            <th class="px-5 py-3.5 border-b border-gray-200">Nama Pasien</th>
            <th class="px-5 py-3.5 border-b border-gray-200">Poli Tujuan</th>
            <th class="px-5 py-3.5 border-b border-gray-200">Dokter</th>
            <th class="px-5 py-3.5 border-b border-gray-200">Diagnosa</th>
            <th class="px-5 py-3.5 border-b border-gray-200">Status</th>
          </tr>
        </thead>
        
        <tbody>
          <!-- Loading -->
          <tr v-if="isLoading">
            <td colspan="8" class="px-5 py-8 text-center text-gray-400">
              Memuat data...
            </td>
          </tr>

          <template v-else>
            <tr 
              v-for="(item, index) in dataKunjungan" 
              :key="item.id" 
              class="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-5 py-3 text-center text-gray-500">{{ index + 1 }}</td>
              <td class="px-5 py-3">{{ item.tanggal }}</td>
              <td class="px-5 py-3 font-medium text-gray-800">{{ item.no_antrean }}</td>
              <td class="px-5 py-3 font-medium">{{ item.nama_pasien }}</td>
              <td class="px-5 py-3 text-gray-500">{{ item.poli }}</td>
              <td class="px-5 py-3 text-gray-600">{{ item.nama_dokter }}</td>
              <td class="px-5 py-3 text-gray-500 max-w-xs truncate" :title="item.diagnosa">{{ item.diagnosa }}</td>
              <td class="px-5 py-3">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-700': item.status === 'Selesai',
                    'bg-yellow-100 text-yellow-700': item.status === 'Menunggu',
                    'bg-red-100 text-red-700': item.status === 'Batal'
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>

            <tr v-if="dataKunjungan.length === 0">
              <td colspan="8" class="px-5 py-8 text-center text-gray-400">
                Belum ada data kunjungan pasien.
              </td>
            </tr>
          </template>
        </tbody>

      </table>
    </div>
    
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
