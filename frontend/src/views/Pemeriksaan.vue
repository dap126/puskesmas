<template>
<div class="p-6 bg-gray-100 min-h-screen">

  <h1 class="text-2xl font-bold mb-6 text-gray-800">
    Pemeriksaan Pasien
  </h1>

  <!-- INFORMASI PASIEN -->
  <div class="bg-white rounded-xl shadow p-6 mb-6">

    <h2 class="text-lg font-semibold mb-4 text-gray-700">
      Informasi Pasien
    </h2>

    <div class="grid grid-cols-3 gap-4">

      <div>
        <label class="text-sm text-gray-600">Nama Pasien</label>
        <input
          type="text"
          class="w-full border rounded-lg p-2 mt-1 bg-gray-100"
          :value="pasien.nama"
          readonly
        >
      </div>

      <div>
        <label class="text-sm text-gray-600">NIK</label>
        <input
          type="text"
          class="w-full border rounded-lg p-2 mt-1 bg-gray-100"
          :value="pasien.nik"
          readonly
        >
      </div>

      <div>
        <label class="text-sm text-gray-600">Jenis Kelamin</label>
        <input
          type="text"
          class="w-full border rounded-lg p-2 mt-1 bg-gray-100"
          :value="pasien.jk"
          readonly
        >
      </div>

    </div>
  </div>


  <!-- FORM PEMERIKSAAN -->
  <div class="bg-white rounded-xl shadow p-6 mb-6">

    <h2 class="text-lg font-semibold mb-4 text-gray-700">
      Form Pemeriksaan
    </h2>

    <div class="grid grid-cols-3 gap-4">

      <div class="col-span-3">
        <label class="text-sm text-gray-600">Keluhan</label>
        <textarea
          class="w-full border rounded-lg p-2 mt-1"
          v-model="form.keluhan"
        ></textarea>
      </div>

      <div>
        <label class="text-sm text-gray-600">Tinggi Badan (cm)</label>
        <input
          type="number"
          class="w-full border rounded-lg p-2 mt-1"
          v-model="form.tinggi_badan"
        >
      </div>

      <div>
        <label class="text-sm text-gray-600">Berat Badan (kg)</label>
        <input
          type="number"
          class="w-full border rounded-lg p-2 mt-1"
          v-model="form.berat_badan"
        >
      </div>

      <div>
        <label class="text-sm text-gray-600">Tekanan Darah</label>
        <input
          class="w-full border rounded-lg p-2 mt-1"
          v-model="form.tekanan_darah"
        >
      </div>

      <div class="col-span-3">
        <label class="text-sm text-gray-600">Diagnosa</label>
        <textarea
          class="w-full border rounded-lg p-2 mt-1"
          v-model="form.diagnosa"
        ></textarea>
      </div>

    </div>
  </div>


  <!-- RESEP OBAT -->
  <div class="bg-white rounded-xl shadow p-6 mb-6">

    <h2 class="text-lg font-semibold mb-4 text-gray-700">
      Resep Obat
    </h2>

    <table class="w-full border">

      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Obat</th>
          <th class="p-2 text-left">Jumlah</th>
          <th class="p-2 text-left">Dosis</th>
          <th class="p-2 text-left">Aksi</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="(item,index) in resep"
          :key="index"
          class="border-t"
        >

          <td class="p-2">
            <select
              class="w-full border rounded-lg p-2"
              v-model="item.obat"
            >
              <option disabled value="">Pilih Obat</option>
              <option
                v-for="o in obatList"
                :key="o.id"
                :value="o.id"
              >
                {{ o.nama }}
              </option>
            </select>
          </td>

          <td class="p-2">
            <input
              type="number"
              class="w-full border rounded-lg p-2"
              v-model="item.jumlah"
            >
          </td>

          <td class="p-2">
            <input
              class="w-full border rounded-lg p-2"
              v-model="item.dosis"
            >
          </td>

          <td class="p-2">
            <button
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              @click="hapusObat(index)"
            >
              Hapus
            </button>
          </td>

        </tr>

      </tbody>

    </table>

    <button
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      @click="tambahObat"
    >
      + Tambah Obat
    </button>

  </div>


  <!-- BUTTON SIMPAN -->
  <div class="flex justify-end">

    <button
      class="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
      @click="simpan"
    >
      Simpan Pemeriksaan
    </button>

  </div>

</div>
</template>



<script>
export default {

data(){
  return{

    pasien:{
      nama:"Ahmad Fauzi",
      nik:"720112xxx",
      jk:"L"
    },

    form:{
      keluhan:"",
      tinggi_badan:"",
      berat_badan:"",
      tekanan_darah:"",
      diagnosa:""
    },

    resep:[],

    obatList:[
      {id:1,nama:"Paracetamol"},
      {id:2,nama:"Amoxicillin"},
      {id:3,nama:"Vitamin C"}
    ]

  }
},

methods:{

  tambahObat(){
    this.resep.push({
      obat:"",
      jumlah:"",
      dosis:""
    })
  },

  hapusObat(index){
    this.resep.splice(index,1)
  },

  simpan(){
    console.log(this.form)
    console.log(this.resep)
  }

}
}
</script>