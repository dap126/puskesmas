<template>
<div class="p-6 bg-gray-100 min-h-screen">

  <!-- HEADER -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Riwayat Medis</h1>
    <p class="text-gray-500">Data riwayat pemeriksaan pasien</p>
  </div>

  <!-- FILTER -->
  <div class="flex flex-wrap items-center gap-4 p-4 mb-6 bg-white shadow rounded-xl">

    <input
      v-model="search"
      type="text"
      placeholder="Cari nama pasien..."
      class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      type="date"
      v-model="tanggal"
      class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      class="w-full px-5 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm sm:w-auto whitespace-nowrap hover:bg-blue-500"
    >
      Cari
    </button>

  </div>

  <!-- TABLE -->
  <div class="bg-white rounded-xl shadow overflow-hidden">

    <table class="w-full text-sm text-left">
      <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
        <tr>
          <th class="p-4">Tanggal</th>
          <th class="p-4">Pasien</th>
          <th class="p-4">Dokter</th>
          <th class="p-4">Keluhan</th>
          <th class="p-4">Diagnosa</th>
          <th class="p-4">Aksi</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="item in riwayat"
          :key="item.id"
          class="border-t hover:bg-gray-50"
        >

          <td class="p-4">{{ item.tanggal }}</td>
          <td class="p-4 font-medium">{{ item.pasien }}</td>
          <td class="p-4">{{ item.dokter }}</td>
          <td class="p-4 text-gray-600">{{ item.keluhan }}</td>
          <td class="p-4 text-gray-700">{{ item.diagnosa }}</td>

          <td class="p-4">
            <button
              @click="lihatDetail(item)"
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Detail
            </button>
          </td>

        </tr>

      </tbody>
    </table>

  </div>


  <!-- MODAL DETAIL -->
  <div
    v-if="modal"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
  >

    <div class="bg-white w-96 rounded-xl shadow-lg p-6">

      <h2 class="text-xl font-bold mb-4">Detail Pemeriksaan</h2>

      <div class="space-y-2 text-sm">

        <p><b>Pasien:</b> {{ detail.pasien }}</p>
        <p><b>Dokter:</b> {{ detail.dokter }}</p>
        <p><b>Tanggal:</b> {{ detail.tanggal }}</p>

        <p><b>Keluhan:</b></p>
        <p class="text-gray-600">{{ detail.keluhan }}</p>

        <p><b>Diagnosa:</b></p>
        <p class="text-gray-600">{{ detail.diagnosa }}</p>

      </div>

      <div class="mt-6 text-right">
        <button
          @click="modal=false"
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          Tutup
        </button>
      </div>

    </div>

  </div>

</div>
</template>


<script>
export default {

data() {
return {

search: "",
tanggal: "",

modal:false,

detail:{},

// dummy data sementara (frontend dulu)
riwayat:[
{
id:1,
tanggal:"2025-01-12",
pasien:"Budi Santoso",
dokter:"dr. Andi",
keluhan:"Demam tinggi",
diagnosa:"Flu"
},

{
id:2,
tanggal:"2025-02-01",
pasien:"Siti Aminah",
dokter:"dr. Rina",
keluhan:"Batuk",
diagnosa:"ISPA"
},

{
id:3,
tanggal:"2025-02-10",
pasien:"Ahmad",
dokter:"dr. Budi",
keluhan:"Pusing",
diagnosa:"Hipertensi"
}

]

}
},

methods:{

lihatDetail(data){

this.detail=data
this.modal=true

}

}

}
</script>