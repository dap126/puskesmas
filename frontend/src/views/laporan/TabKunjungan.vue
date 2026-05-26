<script setup>
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in mt-4">
    <h4 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">
      Laporan Detail Kunjungan Pasien
    </h4>
    <div class="h-64 border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 font-medium rounded-xl">
      Area Tabel Kunjungan Pasien
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
