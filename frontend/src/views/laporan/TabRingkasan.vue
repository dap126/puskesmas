<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['navigate']);

const summary = ref({
  total_kunjungan: 0,
  penyakit_tertinggi: '-',
  jumlah_penyakit: 0,
  obat_limit: 0
});

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    // Fetch Ringkasan Umum (Kunjungan dsb)
    const resRingkasan = await axios.get('http://localhost:3000/api/laporan/ringkasan', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dataRingkasan = resRingkasan.data.data;
    
    // Fetch Obat for counting low stock
    const resObat = await axios.get('http://localhost:3000/api/laporan/obat', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const obatLimit = resObat.data.data.filter(o => o.stok < 10).length;

    // Fetch Penyakit for top disease
    const resPenyakit = await axios.get('http://localhost:3000/api/laporan/penyakit', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const penyakitTertinggi = resPenyakit.data.data.length > 0 ? resPenyakit.data.data[0] : null;

    summary.value = {
      total_kunjungan: dataRingkasan.total_kunjungan,
      penyakit_tertinggi: penyakitTertinggi ? penyakitTertinggi.nama_penyakit : '-',
      jumlah_penyakit: penyakitTertinggi ? penyakitTertinggi.jumlah : 0,
      obat_limit: obatLimit
    };
  } catch (err) {
    console.error('Error fetching ringkasan data:', err);
  }
});
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Kunjungan Keseluruhan
          </h3>
          <p class="mt-2 text-3xl font-bold text-gray-800">
            {{ summary.total_kunjungan }} <span class="text-sm font-medium text-gray-500">Pasien</span>
          </p>
        </div>
        <button class="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left flex items-center transition" @click="emit('navigate', 'kunjungan')">
          Lihat Detail Laporan &rarr;
        </button>
      </div>

      <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Penyakit Tertinggi
          </h3>
          <p class="mt-2 text-xl font-bold text-red-600">
            {{ summary.penyakit_tertinggi }}
          </p>
          <p class="text-sm text-gray-500 mt-1 font-medium">
            Ditemukan pada {{ summary.jumlah_penyakit }} pasien
          </p>
        </div>
        <button class="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left flex items-center transition" @click="emit('navigate', 'penyakit')">
          Lihat Analisis Penyakit &rarr;
        </button>
      </div>

      <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Peringatan Stok Obat
          </h3>
          <p class="mt-2 text-3xl font-bold text-yellow-600">
            {{ summary.obat_limit }} <span class="text-sm font-medium text-gray-500">Jenis Obat</span>
          </p>
          <p class="text-sm text-gray-500 mt-1 font-medium">
            Stok di bawah batas aman ( &lt; 10 pcs )
          </p>
        </div>
        <button class="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left flex items-center transition" @click="emit('navigate', 'obat')">
          Cek Stok Farmasi &rarr;
        </button>
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
