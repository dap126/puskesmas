<script setup>
import { ref } from 'vue'

// State untuk mengatur tab mana yang sedang aktif
// Pilihan: 'ringkasan', 'kunjungan', 'penyakit', 'obat'
const activeTab = ref('ringkasan')

// (Nanti kita akan tambahkan fungsi fetch API untuk masing-masing tab di sini)
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Laporan Puskesmas
        </h3>
      </div>

      <div class="border-b border-gray-100 mb-6 pb-2">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200" :class="[activeTab === 'ringkasan' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            @click="activeTab = 'ringkasan'"
          >
            Ringkasan
          </button>

          <button
            class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200" :class="[activeTab === 'kunjungan' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            @click="activeTab = 'kunjungan'"
          >
            Kunjungan Pasien
          </button>

          <button
            class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200" :class="[activeTab === 'penyakit' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            @click="activeTab = 'penyakit'"
          >
            Analisis Penyakit
          </button>

          <button
            class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200" :class="[activeTab === 'obat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            @click="activeTab = 'obat'"
          >
            Stok Obat
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'ringkasan'" class="space-y-6 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Kunjungan Bulan Ini
              </h3>
              <p class="mt-2 text-3xl font-bold text-gray-800">
                342 <span class="text-sm font-medium text-gray-500">Pasien</span>
              </p>
            </div>
            <button class="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left flex items-center transition" @click="activeTab = 'kunjungan'">
              Lihat Detail Laporan &rarr;
            </button>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Penyakit Tertinggi (Minggu Ini)
              </h3>
              <p class="mt-2 text-xl font-bold text-red-600">
                ISPA (Infeksi Saluran Pernapasan)
              </p>
              <p class="text-sm text-gray-500 mt-1 font-medium">
                Ditemukan pada 45 pasien
              </p>
            </div>
            <button class="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left flex items-center transition" @click="activeTab = 'penyakit'">
              Lihat Analisis Penyakit &rarr;
            </button>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Peringatan Stok Obat
              </h3>
              <p class="mt-2 text-3xl font-bold text-yellow-600">
                8 <span class="text-sm font-medium text-gray-500">Jenis Obat</span>
              </p>
              <p class="text-sm text-gray-500 mt-1 font-medium">
                Stok di bawah batas aman ( < 10 pcs )
              </p>
            </div>
            <button class="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left flex items-center transition" @click="activeTab = 'obat'">
              Cek Stok Farmasi &rarr;
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'kunjungan'" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in mt-4">
        <h4 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">
          Laporan Detail Kunjungan Pasien
        </h4>
        <div class="h-64 border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 font-medium rounded-xl">
          Area Tabel Kunjungan Pasien
        </div>
      </div>

      <div v-if="activeTab === 'penyakit'" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in mt-4">
        <h4 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">
          Statistik 10 Penyakit Terbanyak
        </h4>
        <div class="h-64 border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 font-medium rounded-xl">
          Area Grafik Penyakit (ApexCharts)
        </div>
      </div>

      <div v-if="activeTab === 'obat'" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in mt-4">
        <h4 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">
          Laporan Stok & Pengeluaran Obat
        </h4>
        <div class="h-64 border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 font-medium rounded-xl">
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
