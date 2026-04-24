<template>
<div class="p-8 bg-gray-50 min-h-screen">
  
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800">Data Pasien</h2>
    <button @click="openAddModal" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Tambah Pasien
    </button>
  </div>

  <!-- Alert Sukses -->
  <div v-if="pesanSukses" class="mb-4">
    <p class="text-emerald-600 text-sm font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
      {{ pesanSukses }}
    </p>
  </div>

  <!-- Alert Error -->
  <div v-if="pesanError" class="mb-4">
    <p class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
      {{ pesanError }}
    </p>
  </div>

  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="px-5 py-4 font-semibold text-gray-600">No</th>
            <th class="px-5 py-4 font-semibold text-gray-600">Nama</th>
            <th class="px-5 py-4 font-semibold text-gray-600">NIK</th>
            <th class="px-5 py-4 font-semibold text-gray-600">Tgl Lahir</th>
            <th class="px-5 py-4 font-semibold text-gray-600">Umur</th>
            <th class="px-5 py-4 font-semibold text-gray-600">Jenis Kelamin</th>
            <th class="px-5 py-4 font-semibold text-gray-600">No Telepon</th>
            <th class="px-5 py-4 font-semibold text-gray-600 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in daftarPasien" :key="index" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
            <td class="px-5 py-4 text-gray-800">{{ index + 1 }}</td>
            <td class="px-5 py-4 text-gray-800">{{ p.nama_pasien }}</td>
            <td class="px-5 py-4 text-gray-600">{{ p.nik }}</td>
            <td class="px-5 py-4 text-gray-600">
              {{ p.tgl_lahir ? new Date(p.tgl_lahir).toLocaleDateString('id-ID') : '-' }}
            </td>
            <td class="px-5 py-4 text-gray-600 font-medium">
              {{ calculateAge(p.tgl_lahir) }} Tahun
            </td>
            <td class="px-5 py-4 text-gray-600">{{ p.jenis_kelamin }}</td>
            <td class="px-5 py-4 text-gray-600">{{ p.no_telepon || p.no_telpon }}</td>
            <td class="px-5 py-4 align-middle">
              <div class="flex justify-center">
                <button 
                  @click="openAntreanModal(p)" 
                  class="bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 shadow-sm transition text-sm font-medium flex items-center gap-1.5"
                  title="Tambah ke Antrean"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Antrean
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="daftarPasien.length === 0">
            <td colspan="8" class="py-12 text-center text-gray-400">
              Belum ada data pasien terdaftar.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Form Pendaftaran Pasien -->
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div class="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-xl">
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

      <form @submit.prevent="tambahPasien" class="grid grid-cols-2 gap-5">
        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Nama Pasien</label>
          <input v-model="pasien.nama_pasien" type="text" placeholder="Masukkan nama pasien" required class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none">
        </div>

        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">NIK</label>
          <input v-model="pasien.nik" type="text" placeholder="Masukkan NIK" required class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none">
        </div>

        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Tanggal Lahir</label>
          <input v-model="pasien.tgl_lahir" type="date" required class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none text-gray-600">
        </div>

        <div class="flex flex-col col-span-2 sm:col-span-1">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Jenis Kelamin</label>
          <select v-model="pasien.jenis_kelamin" required class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none">
            <option value="" disabled>--</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div class="flex flex-col col-span-2">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">No Telepon</label>
          <input v-model="pasien.no_telpon" type="text" required class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none">
        </div>

        <div class="flex flex-col col-span-2">
          <label class="mb-1.5 font-semibold text-gray-700 text-sm">Alamat</label>
          <input v-model="pasien.alamat" type="text" required class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none">
        </div>

        <div class="col-span-2 flex justify-end gap-3 mt-4 pt-5 border-t border-gray-100">
          <button type="button" @click="closeModal" class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">Batal</button>
          <button type="submit" class="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">Daftarkan Pasien</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Tambah ke Antrean -->
  <div v-if="showAntreanModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div class="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-md">
      <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
        <h3 class="text-xl font-bold text-gray-800">Tambah ke Antrean</h3>
        <button @click="closeAntreanModal" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="tambahKeAntrean" class="space-y-5">
        <div>
          <label class="mb-1.5 font-semibold text-gray-700 text-sm block">Pilih Poli Tujuan</label>
          <select v-model="antreanPoli" required class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none bg-white">
            <option disabled value="">-- Pilih Poli --</option>
            <option v-for="poli in daftarPoli" :key="poli.id_poli" :value="poli.id_poli">
              {{ poli.nama_poli }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-5 border-t border-gray-100">
          <button type="button" @click="closeAntreanModal" class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">Batal</button>
          <button type="submit" class="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition">Tambah Antrean</button>
        </div>
      </form>
    </div>
  </div>

</div>
</template>

<script>
import { pasienService, antreanService } from '../services/pasien'
import { poliService } from '../services/dokter'

export default {
  data() {
    return {
      showModal: false,
      showAntreanModal: false,
      daftarPasien: [],
      daftarPoli: [],
      selectedPasien: null,
      antreanPoli: '',
      pesanSukses: '',
      pesanError: '',
      pasien: {
        nama_pasien: '',
        nik: '',
        tgl_lahir: '',
        jenis_kelamin: '',
        no_telpon: '',
        alamat: ''
      }
    }
  },

  mounted() {
    this.fetchPasien()
    this.fetchPoli()
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

    async fetchPoli() {
      try {
        this.daftarPoli = await poliService.getAllPoli()
      } catch (error) {
        console.error('Gagal mengambil data poli', error)
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
        nama_pasien: '',
        nik: '',
        tgl_lahir: '',
        jenis_kelamin: '',
        no_telpon: '',
        alamat: ''
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
    },

    // ===== Antrean Modal =====
    openAntreanModal(pasien) {
      this.selectedPasien = pasien
      this.antreanPoli = ''
      this.pesanSukses = ''
      this.pesanError = ''
      this.showAntreanModal = true
    },

    closeAntreanModal() {
      this.showAntreanModal = false
      this.selectedPasien = null
      this.antreanPoli = ''
    },

    async tambahKeAntrean() {
      try {
        const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

        // Cari nama poli yang dipilih untuk generate prefix
        const poliDipilih = this.daftarPoli.find(p => p.id_poli === Number(this.antreanPoli))
        const namaPoli = poliDipilih ? poliDipilih.nama_poli.toLowerCase() : ''

        // Tentukan prefix berdasarkan nama poli
        let prefix = 'AN' // default
        if (namaPoli.includes('umum')) prefix = 'PU'
        else if (namaPoli.includes('anak')) prefix = 'PA'
        else if (namaPoli.includes('gigi')) prefix = 'PG'

        // Ambil data antrean untuk generate nomor per poli hari ini
        const semuaAntrean = await antreanService.getAllAntrean()
        const antreanPoliHariIni = semuaAntrean.filter(a => {
          const tgl = new Date(a.tgl_antrean).toISOString().slice(0, 10)
          return tgl === today && Number(a.poli_id_poli) === Number(this.antreanPoli)
        })
        const nomorUrut = antreanPoliHariIni.length + 1
        const noAntrean = `${prefix}-${String(nomorUrut).padStart(2, '0')}` // PU-01, PA-01, PG-01

        await antreanService.createAntrean({
          tgl_antrean: today,
          no_antrean: noAntrean,
          status: 'Menunggu',
          pasien_idpasien: this.selectedPasien.idpasien,
          poli_id_poli: Number(this.antreanPoli)
        })

        this.pesanSukses = `${this.selectedPasien.nama_pasien} berhasil ditambahkan ke antrean (No: ${noAntrean})`
        this.closeAntreanModal()

      } catch (error) {
        console.error('Gagal menambah antrean:', error)
        this.pesanError = 'Gagal menambahkan ke antrean. Silakan coba lagi.'
        this.closeAntreanModal()
      }
    },

    calculateAge(tgl_lahir) {
      if (!tgl_lahir) return '-';
      const birthDate = new Date(tgl_lahir);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
    }
  }
}
</script>