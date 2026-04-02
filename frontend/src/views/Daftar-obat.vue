<template>
<div>

  <!-- Judul -->
  <h3 class="text-3xl font-medium text-gray-700">
    Daftar Obat
  </h3>

  <!-- Search + Button -->
  <div class="flex justify-between mt-4">

    <input
      v-model="search"
      type="text"
      placeholder="Cari obat..."
      class="px-4 py-2 border rounded-lg focus:outline-none focus:ring"
    />

    <button
      @click="openTambah"
      class="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
    >
      + Tambah Obat
    </button>

  </div>


  <!-- Table -->
  <div class="mt-8 overflow-hidden bg-white rounded-lg shadow">

    <table class="min-w-full">

      <thead class="bg-gray-100">
        <tr>

          <th class="px-6 py-3 text-left text-gray-600">No</th>
          <th class="px-6 py-3 text-left text-gray-600">Nama Obat</th>
          <th class="px-6 py-3 text-left text-gray-600">Kategori</th>
          <th class="px-6 py-3 text-left text-gray-600">Stok</th>
          <th class="px-6 py-3 text-left text-gray-600">Satuan</th>
          <th class="px-6 py-3 text-left text-gray-600">Aksi</th>

        </tr>
      </thead>

      <tbody>

        <tr
          v-for="(obat,index) in filteredObat"
          :key="obat.id_obat"
          class="border-b"
        >

          <td class="px-6 py-4">
            {{ index + 1 }}
          </td>

          <td class="px-6 py-4">
            {{ obat.nama_obat }}
          </td>

          <td class="px-6 py-4">
            {{ obat.kategori }}
          </td>

          <td class="px-6 py-4">

            <span
              :class="obat.stok < 20 
              ? 'px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full'
              : 'px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full'"
            >
              {{ obat.stok }}
            </span>

          </td>

          <td class="px-6 py-4">
            {{ obat.satuan }}
          </td>

          <td class="px-6 py-4 flex gap-2">

            <button
              @click="editObat(obat)"
              class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-400"
            >
              Edit
            </button>

            <button
              @click="hapusObat(obat.id_obat)"
              class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-400"
            >
              Hapus
            </button>

          </td>

        </tr>

      </tbody>

    </table>

  </div>



  <!-- MODAL FORM -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
  >

    <div class="w-96 p-6 bg-white rounded-lg shadow-lg">

      <h3 class="mb-4 text-xl font-semibold">

        {{ editMode ? "Edit Obat" : "Tambah Obat" }}

      </h3>


      <input
        v-model="form.nama_obat"
        type="text"
        placeholder="Nama Obat"
        class="w-full px-3 py-2 mb-3 border rounded"
      />

      <input
        v-model="form.kategori"
        type="text"
        placeholder="Kategori"
        class="w-full px-3 py-2 mb-3 border rounded"
      />

      <input
        v-model="form.stok"
        type="number"
        placeholder="Stok"
        class="w-full px-3 py-2 mb-3 border rounded"
      />

      <input
        v-model="form.satuan"
        type="text"
        placeholder="Satuan (Tablet/Botol)"
        class="w-full px-3 py-2 mb-4 border rounded"
      />


      <div class="flex justify-end gap-2">

        <button
          @click="tutupModal"
          class="px-4 py-2 bg-gray-300 rounded"
        >
          Batal
        </button>

        <button
          @click="simpanObat"
          class="px-4 py-2 text-white bg-indigo-600 rounded"
        >
          Simpan
        </button>

      </div>

    </div>

  </div>

</div>
</template>



<script>

export default {

data(){

return{

search:"",

showModal:false,

editMode:false,

form:{
id_obat:null,
nama_obat:"",
kategori:"",
stok:"",
satuan:""
},

daftarObat:[

{
id_obat:1,
nama_obat:"Paracetamol",
kategori:"Antipiretik",
stok:120,
satuan:"Tablet"
},

{
id_obat:2,
nama_obat:"Amoxicillin",
kategori:"Antibiotik",
stok:80,
satuan:"Kapsul"
},

{
id_obat:3,
nama_obat:"OBH Combi",
kategori:"Obat Batuk",
stok:50,
satuan:"Botol"
}

]

}

},



computed:{

filteredObat(){

return this.daftarObat.filter(o =>
o.nama_obat.toLowerCase().includes(this.search.toLowerCase())
)

}

},



methods:{



openTambah(){

this.editMode=false

this.form={
id_obat:null,
nama_obat:"",
kategori:"",
stok:"",
satuan:""
}

this.showModal=true

},



editObat(obat){

this.editMode=true

this.form={...obat}

this.showModal=true

},



simpanObat(){

if(this.editMode){

const index=this.daftarObat.findIndex(o=>o.id_obat===this.form.id_obat)

this.daftarObat[index]={...this.form}

}

else{

this.form.id_obat=Date.now()

this.daftarObat.push({...this.form})

}

this.tutupModal()

},



hapusObat(id){

this.daftarObat=this.daftarObat.filter(o=>o.id_obat!==id)

},



tutupModal(){

this.showModal=false

}

}

}

</script>