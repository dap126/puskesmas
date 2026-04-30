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
      <div class="col-span-3 sm:col-span-1 relative">
        <label class="text-sm text-gray-600">Pilih Pasien</label>
        <input
          v-model="searchPasien"
          @input="onInputPasien"
          placeholder="Cari nama pasien..."
          class="w-full border rounded-lg p-2 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ul v-if="showPasienDropdown" class="absolute z-10 w-full bg-white border border-gray-200 mt-1 max-h-48 overflow-y-auto rounded-lg shadow-lg">
          <li v-if="filteredPasien.length === 0" class="p-2 text-gray-500 text-sm">Tidak ditemukan</li>
          <li 
            v-for="p in filteredPasien" 
            :key="p.idpasien"
            @click="selectPasien(p)"
            class="p-2 hover:bg-blue-50 cursor-pointer text-sm"
          >
            {{ p.nama_pasien }} (NIK: {{ p.nik }})
          </li>
        </ul>
      </div>

      <div class="col-span-3 sm:col-span-2 relative">
        <label class="text-sm text-gray-600">Pilih Dokter Pemeriksa</label>
        <input
          v-model="searchDokter"
          @input="onInputDokter"
          placeholder="Cari nama dokter..."
          class="w-full border rounded-lg p-2 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ul v-if="showDokterDropdown" class="absolute z-10 w-full bg-white border border-gray-200 mt-1 max-h-48 overflow-y-auto rounded-lg shadow-lg">
          <li v-if="filteredDokter.length === 0" class="p-2 text-gray-500 text-sm">Tidak ditemukan</li>
          <li 
            v-for="d in filteredDokter" 
            :key="d.id_dokter"
            @click="selectDokter(d)"
            class="p-2 hover:bg-blue-50 cursor-pointer text-sm"
          >
            {{ d.nama_dokter }}
          </li>
        </ul>
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
                :key="o.id_obat"
                :value="o.id_obat"
              >
                {{ o.nama_obat }}
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



<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obatService, type Obat } from '../services/farmasi'
import { pasienService, type Pasien } from '../services/pasien'
import { medisService, resepService } from '../services/medis'
import { dokterService, type Dokter } from '../services/dokter'

const route = useRoute()
const router = useRouter()

const form = ref({
  keluhan: "",
  tinggi_badan: "",
  berat_badan: "",
  tekanan_darah: "",
  diagnosa: "",
  pasien_idpasien: "" as number | string,
  dokter_id_dokter: "" as number | string
})

const resep = ref<any[]>([])
const obatList = ref<Obat[]>([])
const pasienList = ref<Pasien[]>([])
const dokterList = ref<Dokter[]>([])

// Search States
const searchPasien = ref("")
const searchDokter = ref("")
const filteredPasien = ref<Pasien[]>([])
const filteredDokter = ref<Dokter[]>([])
const showPasienDropdown = ref(false)
const showDokterDropdown = ref(false)

let debounceTimerPasien: any = null
let debounceTimerDokter: any = null

function onInputPasien() {
  clearTimeout(debounceTimerPasien)
  if (!searchPasien.value) {
    showPasienDropdown.value = false
    return
  }
  debounceTimerPasien = setTimeout(() => {
    filteredPasien.value = pasienList.value.filter(p => 
      p.nama_pasien.toLowerCase().includes(searchPasien.value.toLowerCase()) ||
      (p.nik ? p.nik.toString().includes(searchPasien.value) : false)
    )
    showPasienDropdown.value = true
  }, 1000) // delay 1 detik
}

function selectPasien(p: Pasien) {
  form.value.pasien_idpasien = p.idpasien ?? ''
  searchPasien.value = `${p.nama_pasien} (NIK: ${p.nik ?? ''})`
  showPasienDropdown.value = false
}

function onInputDokter() {
  clearTimeout(debounceTimerDokter)
  if (!searchDokter.value) {
    showDokterDropdown.value = false
    return
  }
  debounceTimerDokter = setTimeout(() => {
    filteredDokter.value = dokterList.value.filter(d => 
      d.nama_dokter.toLowerCase().includes(searchDokter.value.toLowerCase())
    )
    showDokterDropdown.value = true
  }, 1000) // delay 1 detik
}

function selectDokter(d: Dokter) {
  form.value.dokter_id_dokter = d.id_dokter ?? ''
  searchDokter.value = d.nama_dokter
  showDokterDropdown.value = false
}

async function fetchData() {
  try {
    const [obatData, pasienData, dokterData] = await Promise.all([
      obatService.getAllObat(),
      pasienService.getAllPasien(),
      dokterService.getAllDokter()
    ])
    obatList.value = obatData
    pasienList.value = pasienData
    dokterList.value = dokterData

    // Auto-fill pasien dari parameter route
    if (route.query.idpasien && route.query.nama) {
      form.value.pasien_idpasien = Number(route.query.idpasien)
      searchPasien.value = route.query.nama as string
    } else if (route.query.idpasien) {
      const p = pasienData.find((x: Pasien) => x.idpasien === Number(route.query.idpasien))
      if (p) {
        form.value.pasien_idpasien = p.idpasien ?? ''
        searchPasien.value = `${p.nama_pasien} (NIK: ${p.nik ?? ''})`
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data', error)
  }
}

function tambahObat() {
  resep.value.push({
    obat: "",
    jumlah: "",
    dosis: ""
  })
}

function hapusObat(index: number) {
  resep.value.splice(index, 1)
}

async function simpan() {
  try {
    // Validasi input
    if (!form.value.pasien_idpasien) {
      alert('Silakan pilih pasien dari dropdown!')
      return
    }
    if (!form.value.dokter_id_dokter) {
      alert('Silakan pilih dokter pemeriksa dari dropdown!')
      return
    }
    if (!form.value.keluhan) {
      alert('Keluhan wajib diisi!')
      return
    }

    const payload = {
      tgl_periksa: new Date().toISOString().slice(0, 19).replace('T', ' '),
      keluhan: form.value.keluhan,
      tinggi_badan: Number(form.value.tinggi_badan) || 0,
      berat_badan: form.value.berat_badan ? Number(form.value.berat_badan) : null,
      tekanan_darah: form.value.tekanan_darah, // Kirim sebagai string (contoh: 120/80)
      diagnosa: form.value.diagnosa,
      pasien_idpasien: Number(form.value.pasien_idpasien),
      dokter_id_dokter: Number(form.value.dokter_id_dokter)
    }
    
    // Simpan data medis dan ambil ID
    const medisResult = await medisService.createMedis(payload as any)
    const newRmId = medisResult.id
    
    // Jika ada obat yang diresepkan, simpan secara transaksional
    if (resep.value.length > 0) {
      const daftarObat = resep.value.map(item => ({
        obat_id_obat: Number(item.obat),
        jumlah_obat: Number(item.jumlah),
        dosis: item.dosis
      }))
      
      await resepService.createResepTransaction({
        rekam_medis_id_rm: newRmId,
        daftar_obat: daftarObat
      })
      
      alert('Pemeriksaan & Resep Obat berhasil disimpan!')
      router.push('/resep') // Tampilkan hasil transaksi pada halaman Resep
    } else {
      alert('Pemeriksaan berhasil disimpan!')
      router.push('/riwayat-medis')
    }
  } catch (error) {
    console.error('Gagal menyimpan pemeriksaan', error)
    alert('Terjadi kesalahan saat menyimpan pemeriksaan.')
  }
}

onMounted(() => {
  fetchData()
})
</script>