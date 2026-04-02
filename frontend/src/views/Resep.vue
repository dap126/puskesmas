<template>
<div>

  <!-- Judul -->
  <h3 class="text-3xl font-medium text-gray-700">
    Antrean Resep
  </h3>

  <!-- Search + Button -->
  <div class="flex justify-between mt-4">

    <input
      v-model="search"
      type="text"
      placeholder="Cari resep atau obat..."
      class="px-4 py-2 border rounded-lg focus:outline-none focus:ring"
    />

    <button
      @click="openTambah"
      class="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
    >
      + Tambah Resep
    </button>

  </div>

  <!-- Table -->
  <div class="mt-8 overflow-hidden bg-white rounded-lg shadow">

    <table class="min-w-full">

      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3">No</th>
          <th class="px-6 py-3">Kode Detail</th>
          <th class="px-6 py-3">Kode Resep</th>
          <th class="px-6 py-3">Nama Obat</th>
          <th class="px-6 py-3">Jumlah</th>
          <th class="px-6 py-3">Dosis</th>
          <th class="px-6 py-3">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(item,index) in filteredResep"
          :key="item.id_detail"
          class="border-b"
        >

          <td class="px-6 py-4">{{ index + 1 }}</td>

          <td class="px-6 py-4">
            DTL-{{ item.id_detail }}
          </td>

          <td class="px-6 py-4">
            RSP-{{ item.resep_obat_id_resep }}
          </td>

          <td class="px-6 py-4">
            {{ getNamaObat(item.obat_id_obat) }}
          </td>

          <td class="px-6 py-4">
            <span class="px-2 py-1 text-xs font-semibold bg-blue-200 text-blue-800 rounded-full">
              {{ item.jumlah_obat }}
            </span>
          </td>

          <td class="px-6 py-4">
            {{ item.dosis }}
          </td>

          <td class="px-6 py-4 flex gap-2">

            <button
              @click="editResep(item)"
              class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-400"
            >
              Edit
            </button>

            <button
              @click="hapusResep(item.id_detail)"
              class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-400"
            >
              Hapus
            </button>

          </td>

        </tr>
      </tbody>

    </table>

  </div>


  <!-- MODAL -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
  >

    <div class="w-96 p-6 bg-white rounded-lg shadow">

      <h3 class="mb-4 text-xl font-semibold">
        {{ editMode ? "Edit Resep" : "Tambah Resep" }}
      </h3>

      <input
        v-model="form.resep_obat_id_resep"
        type="number"
        placeholder="ID Resep"
        class="w-full px-3 py-2 mb-3 border rounded"
      />

      <!-- Dropdown Obat -->
      <select
        v-model="form.obat_id_obat"
        class="w-full px-3 py-2 mb-3 border rounded"
      >
        <option disabled value="">Pilih Obat</option>
        <option
          v-for="o in daftarObat"
          :key="o.id_obat"
          :value="o.id_obat"
        >
          {{ o.nama_obat }}
        </option>
      </select>

      <input
        v-model="form.jumlah_obat"
        type="number"
        placeholder="Jumlah Obat"
        class="w-full px-3 py-2 mb-3 border rounded"
      />

      <input
        v-model="form.dosis"
        type="text"
        placeholder="Dosis"
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
          @click="simpanResep"
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

data() {
  return {

    search: "",
    showModal: false,
    editMode: false,

    form: {
      id_detail: null,
      resep_obat_id_resep: "",
      obat_id_obat: "",
      jumlah_obat: "",
      dosis: ""
    },

    // DATA OBAT (mapping)
    daftarObat: [
      { id_obat: 1, nama_obat: "Paracetamol" },
      { id_obat: 2, nama_obat: "Amoxicillin" },
      { id_obat: 3, nama_obat: "OBH Combi" }
    ],

    // DATA RESEP
    daftarResep: [
      {
        id_detail: 1,
        resep_obat_id_resep: 101,
        obat_id_obat: 1,
        jumlah_obat: 10,
        dosis: "3x1 sehari"
      },
      {
        id_detail: 2,
        resep_obat_id_resep: 102,
        obat_id_obat: 2,
        jumlah_obat: 5,
        dosis: "2x1 sehari"
      }
    ]

  }
},

computed: {

  filteredResep() {
    return this.daftarResep.filter(r =>
      r.dosis.toLowerCase().includes(this.search.toLowerCase()) ||
      String(r.resep_obat_id_resep).includes(this.search) ||
      this.getNamaObat(r.obat_id_obat).toLowerCase().includes(this.search.toLowerCase())
    )
  }

},

methods: {

  getNamaObat(id) {
    const obat = this.daftarObat.find(o => o.id_obat == id)
    return obat ? obat.nama_obat : "-"
  },

  openTambah() {
    this.editMode = false
    this.form = {
      id_detail: null,
      resep_obat_id_resep: "",
      obat_id_obat: "",
      jumlah_obat: "",
      dosis: ""
    }
    this.showModal = true
  },

  editResep(item) {
    this.editMode = true
    this.form = { ...item }
    this.showModal = true
  },

  simpanResep() {
    if (this.editMode) {
      const index = this.daftarResep.findIndex(r => r.id_detail === this.form.id_detail)
      this.daftarResep[index] = { ...this.form }
    } else {
      this.form.id_detail = Date.now()
      this.daftarResep.push({ ...this.form })
    }
    this.tutupModal()
  },

  hapusResep(id) {
    this.daftarResep = this.daftarResep.filter(r => r.id_detail !== id)
  },

  tutupModal() {
    this.showModal = false
  }

}

}
</script>