<script setup>
import { ref } from 'vue';

// State untuk mengatur tab mana yang sedang aktif
// Pilihan: 'ringkasan', 'kunjungan', 'penyakit', 'obat'
const activeTab = ref('ringkasan');

// (Nanti kita akan tambahkan fungsi fetch API untuk masing-masing tab di sini)
</script>

<template>
    <div class="bg-white rounded-xl shadow p-6 mb-6">
      <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Laporan Puskesmas</h1>

        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button 
              @click="activeTab = 'ringkasan'"
              :class="[activeTab === 'ringkasan' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200']"
            >
              Ringkasan
            </button>

            <button 
              @click="activeTab = 'kunjungan'"
              :class="[activeTab === 'kunjungan' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200']"
            >
              Kunjungan Pasien
            </button>

            <button 
              @click="activeTab = 'penyakit'"
              :class="[activeTab === 'penyakit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200']"
            >
              Analisis Penyakit
            </button>

            <button 
              @click="activeTab = 'obat'"
              :class="[activeTab === 'obat' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200']"
            >
              Stok Obat
            </button>
          </nav>
        </div>

        <div v-if="activeTab === 'ringkasan'" class="space-y-6 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
            <div class="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Kunjungan Bulan Ini</h3>
                <p class="mt-2 text-3xl font-bold text-gray-900">342 <span class="text-sm font-normal text-gray-500">Pasien</span></p>
              </div>
          <button @click="activeTab = 'kunjungan'" class="mt-4 text-sm text-blue-600 hover:text-blue-800 text-left flex items-center">
            Lihat Detail Laporan &rarr;
          </button>
        </div>

        <div class="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Penyakit Tertinggi (Minggu Ini)</h3>
            <p class="mt-2 text-xl font-bold text-gray-900 text-red-600">ISPA (Infeksi Saluran Pernapasan)</p>
            <p class="text-sm text-gray-500 mt-1">Ditemukan pada 45 pasien</p>
          </div>
          <button @click="activeTab = 'penyakit'" class="mt-4 text-sm text-blue-600 hover:text-blue-800 text-left flex items-center">
            Lihat Analisis Penyakit &rarr;
          </button>
        </div>

        <div class="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Peringatan Stok Obat</h3>
            <p class="mt-2 text-3xl font-bold text-yellow-600">8 <span class="text-sm font-normal text-gray-500">Jenis Obat</span></p>
            <p class="text-sm text-gray-500 mt-1">Stok di bawah batas aman ( < 10 pcs )</p>
          </div>
          <button @click="activeTab = 'obat'" class="mt-4 text-sm text-blue-600 hover:text-blue-800 text-left flex items-center">
            Cek Stok Farmasi &rarr;
          </button>
        </div>

      </div>
      
    </div>

    <div v-if="activeTab === 'kunjungan'" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <h2 class="text-xl font-bold mb-4">Laporan Detail Kunjungan Pasien</h2>
      <div class="h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded">
        Area Tabel Kunjungan Pasien
      </div>
    </div>

    <div v-if="activeTab === 'penyakit'" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <h2 class="text-xl font-bold mb-4">Statistik 10 Penyakit Terbanyak</h2>
      <div class="h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded">
        Area Grafik Penyakit (ApexCharts)
      </div>
    </div>

    <div v-if="activeTab === 'obat'" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
      <h2 class="text-xl font-bold mb-4">Laporan Stok & Pengeluaran Obat</h2>
      <div class="h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded">
        Area Tabel Stok Obat
      </div>
    </div>

  </div>
    </div>
</template>

<style scoped>
/* Sedikit animasi agar perpindahan tab terasa mulus */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>