<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Antrian Hari Ini</h2>

    <!-- Info Ringkas -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-100 p-4 rounded-lg shadow">
        <p class="text-sm">Total</p>
        <p class="text-xl font-bold">{{ antrian.length }}</p>
      </div>
      <div class="bg-yellow-100 p-4 rounded-lg shadow">
        <p class="text-sm">Menunggu</p>
        <p class="text-xl font-bold">{{ totalMenunggu }}</p>
      </div>
      <div class="bg-green-100 p-4 rounded-lg shadow">
        <p class="text-sm">Selesai</p>
        <p class="text-xl font-bold">{{ totalSelesai }}</p>
      </div>
    </div>

    <!-- Tabel Antrian -->
    <table class="w-full bg-white shadow rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-left">No</th>
          <th class="p-3 text-left">No Antrian</th>
          <th class="p-3 text-left">Nama Pasien</th>
          <th class="p-3 text-left">Poli</th>
          <th class="p-3 text-left">Status</th>
          <th class="p-3 text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(item, index) in antrian" 
          :key="item.idantrian"
          class="border-t"
        >
          <td class="p-3">{{ index + 1 }}</td>
          <td class="p-3 font-semibold">{{ item.no_antrean }}</td>
          <td class="p-3">{{ item.nama_pasien }}</td>
          <td class="p-3">{{ item.nama_poli }}</td>

          <!-- Status -->
          <td class="p-3">
            <span
              :class="{
                'text-yellow-600 font-semibold': item.status === 'menunggu',
                'text-blue-600 font-semibold': item.status === 'dipanggil',
                'text-green-600 font-semibold': item.status === 'selesai'
              }"
            >
              {{ item.status }}
            </span>
          </td>

          <!-- Aksi -->
          <td class="p-3 space-x-2">
            <button
              @click="panggil(item)"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Panggil
            </button>
            <button
              @click="selesai(item)"
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Selesai
            </button>
          </td>
        </tr>

        <!-- Jika kosong -->
        <tr v-if="antrian.length === 0">
          <td colspan="6" class="text-center p-4 text-gray-500">
            Tidak ada antrian hari ini
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Antrean",

  data() {
    return {
      antrian: [
        {
          idantrian: 1,
          no_antrean: "A001",
          nama_pasien: "Budi",
          nama_poli: "Umum",
          status: "menunggu"
        },
        {
          idantrian: 2,
          no_antrean: "A002",
          nama_pasien: "Siti",
          nama_poli: "Gigi",
          status: "dipanggil"
        },
        {
          idantrian: 3,
          no_antrean: "A003",
          nama_pasien: "Andi",
          nama_poli: "Anak",
          status: "selesai"
        }
      ]
    }
  },

  computed: {
    totalMenunggu() {
      return this.antrian.filter(a => a.status === "menunggu").length
    },
    totalSelesai() {
      return this.antrian.filter(a => a.status === "selesai").length
    }
  },

  methods: {
    panggil(item) {
      item.status = "dipanggil"
    },
    selesai(item) {
      item.status = "selesai"
    }
  }
}
</script>

<style scoped>
table th {
  font-weight: bold;
}
</style>
