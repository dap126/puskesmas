<template>
<div class="page">
  
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold">Data Pasien</h2>
    <button @click="openAddModal" class="btn flex items-center justify-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Tambah Pasien
    </button>
  </div>

  <div class="table-card">
    <table>
      <thead>
        <tr>
          <th>Nama</th>
          <th>NIK</th>
          <th>JK</th>
          <th>No HP</th>
          <th>Keluhan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p,index) in daftarPasien" :key="index">
          <td>{{p.nama_pasien}}</td>
          <td>{{p.nik}}</td>
          <td>{{p.jenis_kelamin}}</td>
          <td>{{p.no_telpon}}</td>
          <td>{{p.alamat}}</td>
        </tr>
        <tr v-if="daftarPasien.length === 0">
          <td colspan="5" class="py-6 text-center text-gray-500">
            Belum ada data pasien terdaftar.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal Form Pendaftaran -->
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm px-4 opacity-100 transition-opacity">
    <div class="bg-white p-7 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all border border-gray-100">
      <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          Pendaftaran Pasien Baru
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="tambahPasien" class="form-grid">
        <div class="form-group">
          <label>Nama Pasien</label>
          <input v-model="pasien.nama" type="text" placeholder="Masukkan nama pasien" required>
        </div>

        <div class="form-group">
          <label>NIK</label>
          <input v-model="pasien.nik" type="text" placeholder="Masukkan NIK" required>
        </div>

        <div class="form-group">
          <label>Jenis Kelamin</label>
          <select v-model="pasien.jk" required>
            <option value="">Pilih Jenis Kelamin</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </div>

        <div class="form-group">
          <label>No HP</label>
          <input v-model="pasien.hp" type="text" placeholder="08xxxxxxxx" required>
        </div>

        <div class="form-group full">
          <label>Keluhan</label>
          <textarea v-model="pasien.keluhan" placeholder="Masukkan keluhan pasien" required></textarea>
        </div>

        <div class="full flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button type="button" @click="closeModal" class="btn-secondary">Batal</button>
          <button type="submit" class="btn">Daftarkan Pasien</button>
        </div>
      </form>
    </div>
  </div>

</div>
</template>

<script>
import { pasienService } from '../services/pasien'

export default {
  data() {
    return {
      showModal: false,
      daftarPasien: [],
      pasien: {
        id_pasien: 0,
        nik: '',
        nama_pasien: '',
        tgl_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        no_telpon: ''
      }
    }
  },

  mounted() {
    this.fetchPasien()
  },

  methods: {
    async fetchPasien() {
      try {
        const data = await pasienService.getAllPasien()
        this.daftarPasien = data
      } catch (error) {
        console.error(error)
      }
    },

    openAddModal() {
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.resetForm()
    },

    resetForm() {
      this.pasien = {
        id_pasien: 0,
        nik: '',
        nama_pasien: '',
        tgl_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        no_telpon: ''
      }
    },

    async tambahPasien() {
      try {
        await pasienService.createPasien(this.pasien)
        this.fetchPasien()
        this.closeModal()
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style>
.page {
  padding: 30px;
  background: #f5f7fb;
  min-height: 100vh;
}

.title {
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 600;
  color: #34495e;
}

input, select, textarea {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  transition: 0.2s;
  width: 100%;
}

input:focus, select:focus, textarea:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

textarea {
  min-height: 80px;
}

.full {
  grid-column: span 2;
}

.btn {
  background: #4f46e5;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.btn:hover {
  background: #4338ca;
}

.btn-secondary {
  background: #ffffff;
  color: #4b5563;
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.table-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  text-align: left;
}

th {
  background: #4f46e5;
  color: white;
  padding: 12px 10px;
}

td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
}

tr:hover {
  background: #f3f4ff;
}
</style>