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
  <div v-if="pesanSukses && !showModal && !showAntreanModal" class="mb-4">
    <p class="text-emerald-600 text-sm font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
      {{ pesanSukses }}
    </p>
  </div>

  <!-- Alert Error -->
  <div v-if="pesanError && !showModal && !showAntreanModal" class="mb-4">
    <p class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
      {{ pesanError }}
    </p>
  </div>

  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <!-- Search Bar -->
    <div class="mb-5">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input 
          v-model="search" 
          type="text" 
          placeholder="Cari nama pasien atau NIK..." 
          class="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 transition focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
        />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
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
          <tr v-for="(p) in filteredPasien" :key="p.idpasien" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
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
          <tr v-if="filteredPasien.length === 0">
            <td colspan="8" class="py-12 text-center text-gray-400">
              {{ search ? 'Tidak ada pasien yang cocok dengan pencarian.' : 'Belum ada data pasien terdaftar.' }}
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
        <!-- Alert Error di dalam Modal -->
        <div v-if="pesanError && showModal" class="col-span-2">
          <p class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
            {{ pesanError }}
          </p>
        </div>

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
        <!-- Alert Error di dalam Modal Antrean -->
        <div v-if="pesanError && showAntreanModal" class="">
          <p class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
            {{ pesanError }}
          </p>
        </div>

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
      search: '',
      showModal: false,
      showAntreanModal: false,
      daftarPasien: [],
      daftarPoli: [],
      antreanHariIni: [],
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

  computed: {
    // Filter pasien berdasarkan pencarian saja
    filteredPasien() {
      if (!this.search) return this.daftarPasien

      const keyword = this.search.toLowerCase()
      return this.daftarPasien.filter(p => {
        const nama = (p.nama_pasien || '').toLowerCase()
        const nik = (p.nik || '').toString()
        return nama.includes(keyword) || nik.includes(keyword)
      })
    }
  },

  mounted() {
    this.fetchPasien()
    this.fetchPoli()
    this.fetchAntreanHariIni()
  },

  methods: {
    // Helper: format date ke YYYY-MM-DD pakai waktu lokal (bukan UTC)
    formatLocalDate(date) {
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

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

    async fetchAntreanHariIni() {
      try {
        this.antreanHariIni = await antreanService.getAllAntrean()
      } catch (error) {
        console.error('Gagal mengambil data antrean:', error)
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
      this.pesanSukses = ''
      this.pesanError = ''
      try {
        await pasienService.createPasien(this.pasien)
        this.pesanSukses = 'Pasien berhasil didaftarkan'
        this.fetchPasien()
        this.closeModal()
      } catch (error) {
        console.error(error)
        this.pesanError = error.message || 'Gagal mendaftarkan pasien. Silakan coba lagi.'
      }
    },

    // ===== Antrean Modal =====
    openAntreanModal(pasien) {
      this.pesanSukses = ''
      this.pesanError = ''

      // Cek apakah pasien sudah ada di antrean hari ini (status Menunggu)
      const today = this.formatLocalDate(new Date())
      const sudahDiAntrean = this.antreanHariIni.some(a => {
        const tgl = this.formatLocalDate(a.tgl_antrean)
        return tgl === today && a.pasien_idpasien === pasien.idpasien && a.status === 'Menunggu'
      })

      if (sudahDiAntrean) {
        this.pesanError = `${pasien.nama_pasien} sudah ada pada antrean hari ini.`
        return
      }

      this.selectedPasien = pasien
      this.antreanPoli = ''
      this.showAntreanModal = true
    },

    closeAntreanModal() {
      this.showAntreanModal = false
      this.selectedPasien = null
      this.antreanPoli = ''
    },

    async tambahKeAntrean() {
      try {
        const today = this.formatLocalDate(new Date())

        // Cari nama poli yang dipilih untuk generate prefix
        const poliDipilih = this.daftarPoli.find(p => p.id_poli === Number(this.antreanPoli))
        const namaPoli = poliDipilih ? poliDipilih.nama_poli.toLowerCase() : ''

        // Tentukan prefix berdasarkan nama poli
        let prefix = 'AN' // default
        if (namaPoli.includes('umum')) prefix = 'PU'
        else if (namaPoli.includes('anak')) prefix = 'PA'
        else if (namaPoli.includes('gigi')) prefix = 'PG'

        // Ambil data antrean terbaru untuk generate nomor per poli hari ini
        const semuaAntrean = await antreanService.getAllAntrean()
        const antreanPoliHariIni = semuaAntrean.filter(a => {
          const tgl = this.formatLocalDate(a.tgl_antrean)
          return tgl === today && Number(a.poli_id_poli) === Number(this.antreanPoli)
        })
        const nomorUrut = antreanPoliHariIni.length + 1
        const noAntrean = `${prefix}-${String(nomorUrut).padStart(2, '0')}`

        await antreanService.createAntrean({
          tgl_antrean: today,
          no_antrean: noAntrean,
          status: 'Menunggu',
          pasien_idpasien: this.selectedPasien.idpasien,
          poli_id_poli: Number(this.antreanPoli)
        })

        this.pesanSukses = `${this.selectedPasien.nama_pasien} berhasil ditambahkan ke antrean (No: ${noAntrean})`
        this.closeAntreanModal()
        // Refresh data antrean
        this.fetchAntreanHariIni()

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