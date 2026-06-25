<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const dataObat = ref([]);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/laporan/obat', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    dataObat.value = response.data.data.map(item => {
      let statusStok = 'Aman';
      if (item.stok < 10) statusStok = 'Kritis';
      else if (item.stok < 50) statusStok = 'Rendah';

      return {
        nama: item.nama_obat,
        jenis: item.kategori || item.satuan, // Use database kategori or satuan as jenis
        stok: item.stok,
        kategori: statusStok
      };
    });
  } catch (error) {
    console.error('Error fetching data obat:', error);
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in mt-4">
    
    <div class="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
      <h4 class="text-lg font-bold text-gray-800 m-0">
        Laporan Stok Obat
      </h4>
    </div>

    <!-- Tabel Obat -->
    <div>
      <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-gray-200">
            <tr>
              <th class="pb-2 pr-2 font-semibold text-gray-700 text-left">Nama Obat</th>
              <th class="pb-2 px-2 font-semibold text-gray-700 text-center">Stok</th>
              <th class="pb-2 pl-2 font-semibold text-gray-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="(item, index) in dataObat" 
              :key="index"
              class="hover:bg-gray-100 transition-colors"
            >
              <td class="py-2 pr-2">
                <div class="font-medium text-gray-800">{{ item.nama }}</div>
                <div class="text-xs text-gray-400">{{ item.jenis }}</div>
              </td>
              <td class="py-2 px-2 text-center font-semibold">
                {{ item.stok }}
              </td>
              <td class="py-2 pl-2">
                <span 
                  class="px-2 py-1 rounded-lg text-xs font-semibold"
                  :class="{
                    'bg-red-100 text-red-700': item.kategori === 'Kritis',
                    'bg-yellow-100 text-yellow-700': item.kategori === 'Rendah',
                    'bg-green-100 text-green-700': item.kategori === 'Aman'
                  }"
                >
                  {{ item.kategori }}
                </span>
              </td>
            </tr>
            <tr v-if="dataObat.length === 0">
              <td colspan="3" class="px-5 py-8 text-center text-gray-400">
                Belum ada data obat.
              </td>
            </tr>
          </tbody>
        </table>
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
