<script setup>
import { ref } from 'vue'
import TabRingkasan from './laporan/TabRingkasan.vue'
import TabKunjungan from './laporan/TabKunjungan.vue'
import TabPenyakit from './laporan/TabPenyakit.vue'
import TabObat from './laporan/TabObat.vue'

const activeTab = ref('ringkasan')

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

      <!-- Tab Contents -->
      <TabRingkasan v-if="activeTab === 'ringkasan'" @navigate="activeTab = $event" />
      <TabKunjungan v-if="activeTab === 'kunjungan'" />
      <TabPenyakit v-if="activeTab === 'penyakit'" />
      <TabObat v-if="activeTab === 'obat'" />
    </div>
  </div>
</template>
