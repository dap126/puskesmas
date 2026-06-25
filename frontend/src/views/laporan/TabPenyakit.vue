<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const ringkasan = ref({
  penyakit_tertinggi: '-',
  jumlah_penyakit: 0
});

const dataPenyakit = ref([]);

// Warna-warni statis untuk bar chart
const chartColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#64748b', '#f97316', '#718096'
];

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/laporan/penyakit', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const penyakitData = response.data.data;
    if (penyakitData.length > 0) {
      ringkasan.value = {
        penyakit_tertinggi: penyakitData[0].nama_penyakit,
        jumlah_penyakit: penyakitData[0].jumlah
      };
      
      dataPenyakit.value = penyakitData.map((item, index) => ({
        nama: item.nama_penyakit,
        jumlah: item.jumlah,
        warna: chartColors[index % chartColors.length]
      }));
    }
  } catch (error) {
    console.error('Error fetching data penyakit:', error);
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in mt-4">
    <h4 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">
      Statistik 10 Penyakit Terbanyak
    </h4>
    
    <!-- Grafik Stats -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
      <!-- Card Penyakit Tertinggi -->
      <div class="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col justify-center items-center">
        <p class="text-xs font-semibold text-red-600 uppercase tracking-wider">Penyakit Terbanyak</p>
        <p class="mt-2 text-4xl font-bold text-red-800 text-center">{{ ringkasan.penyakit_tertinggi }}</p>
        <p class="text-xs text-red-500 mt-1">{{ ringkasan.jumlah_penyakit }} Pasien</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <!-- Grafik Batang Penyakit -->
      <div>
        <h5 class="text-sm font-bold text-gray-700 mb-3">Detail Penyakit Berdasarkan Jumlah Kasus</h5>
        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div 
            v-for="(item, index) in dataPenyakit" 
            :key="index"
            class="mb-3 last:mb-0"
          >
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm text-gray-600 font-medium">{{ item.nama }}</span>
              <span class="text-xs text-gray-500 font-semibold">{{ item.jumlah }} pasien</span>
            </div>
            <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-700 ease-out"
                :style="{ 
                  width: (item.jumlah / dataPenyakit[0].jumlah) * 100 + '%', 
                  backgroundColor: item.warna 
                }"
              ></div>
            </div>
          </div>
          <tr v-if="dataPenyakit.length === 0">
            <td colspan="4" class="px-5 py-8 text-center text-gray-400 justify-content-center">
              Belum ada data penyakit.
            </td>
          </tr>
        </div>
      </div>
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
