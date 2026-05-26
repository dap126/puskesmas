<script setup>
const emit = defineEmits(['navigate'])
</script>

<template>
  <div class="space-y-6 animate-fade-in">
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
        <button class="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 text-left flex items-center transition" @click="emit('navigate', 'kunjungan')">
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
            8 <span class="text-sm font-medium text-gray-500">Jenis Obat</span>
          </p>
          <p class="text-sm text-gray-500 mt-1 font-medium">
            Stok di bawah batas aman ( < 10 pcs )
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
