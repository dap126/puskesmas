<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type Obat, obatService } from '../services/farmasi'
import { type Pasien, pasienService } from '../services/pasien'
import { medisService, resepService } from '../services/medis'
import { type Dokter, dokterService } from '../services/dokter'

const route = useRoute()
const router = useRouter()

const form = ref({
  keluhan: '',
  tinggi_badan: '',
  berat_badan: '',
  tekanan_darah: '',
  diagnosa: '',
  pasien_idpasien: '' as number | string,
  dokter_id_dokter: '' as number | string,
})

const resep = ref<any[]>([])
const obatList = ref<Obat[]>([])
const pasienList = ref<Pasien[]>([])
const dokterList = ref<Dokter[]>([])

// Search States
const searchPasien = ref('')
const searchDokter = ref('')
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
      p.nama_pasien.toLowerCase().includes(searchPasien.value.toLowerCase())
      || (p.nik ? p.nik.toString().includes(searchPasien.value) : false),
    )
    showPasienDropdown.value = true
  }, 300)
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
      d.nama_dokter.toLowerCase().includes(searchDokter.value.toLowerCase()),
    )
    showDokterDropdown.value = true
  }, 300)
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
      dokterService.getAllDokter(),
    ])
    obatList.value = obatData
    pasienList.value = pasienData
    dokterList.value = dokterData

    // Auto-fill pasien dari parameter route
    if (route.query.idpasien && route.query.nama) {
      form.value.pasien_idpasien = Number(route.query.idpasien)
      searchPasien.value = route.query.nama as string
    }
    else if (route.query.idpasien) {
      const p = pasienData.find((x: Pasien) => x.idpasien === Number(route.query.idpasien))
      if (p) {
        form.value.pasien_idpasien = p.idpasien ?? ''
        searchPasien.value = `${p.nama_pasien} (NIK: ${p.nik ?? ''})`
      }
    }
  }
  catch (error) {
    console.error('Gagal mengambil data', error)
  }
}

function tambahObat() {
  resep.value.push({
    obat: '',
    jumlah: '',
    dosis: '',
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
      tekanan_darah: form.value.tekanan_darah,
      diagnosa: form.value.diagnosa,
      pasien_idpasien: Number(form.value.pasien_idpasien),
      dokter_id_dokter: Number(form.value.dokter_id_dokter),
    }

    // Simpan data medis dan ambil ID
    const medisResult = await medisService.createMedis(payload as any)
    const newRmId = medisResult.id

    // Jika ada obat yang diresepkan, simpan secara transaksional
    if (resep.value.length > 0) {
      const daftarObat = resep.value.map(item => ({
        obat_id_obat: Number(item.obat),
        jumlah_obat: Number(item.jumlah),
        dosis: item.dosis,
      }))

      await resepService.createResepTransaction({
        rekam_medis_id_rm: newRmId,
        daftar_obat: daftarObat,
      })

      alert('Pemeriksaan & Resep Obat berhasil disimpan!')
      router.push('/resep')
    }
    else {
      alert('Pemeriksaan berhasil disimpan!')
      router.push('/riwayat-medis')
    }
  }
  catch (error) {
    console.error('Gagal menyimpan pemeriksaan', error)
    alert('Terjadi kesalahan saat menyimpan pemeriksaan.')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Pemeriksaan Pasien
        </h3>
      </div>

      <!-- INFORMASI PASIEN -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h4 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">
          Informasi Pasien
        </h4>
        <div class="grid grid-cols-3 gap-5">
          <div class="col-span-3 sm:col-span-1 relative flex flex-col">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Pilih Pasien</label>
            <input
              v-model="searchPasien"
              placeholder="Cari nama pasien..."
              class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              @input="onInputPasien"
            >
            <ul v-if="showPasienDropdown" class="absolute top-full left-0 z-10 w-full bg-white border border-gray-200 mt-1 max-h-48 overflow-y-auto rounded-lg shadow-lg">
              <li v-if="filteredPasien.length === 0" class="p-3 text-gray-500 text-sm">
                Tidak ditemukan
              </li>
              <li
                v-for="p in filteredPasien"
                :key="p.idpasien"
                class="p-3 hover:bg-indigo-50 cursor-pointer text-sm transition"
                @click="selectPasien(p)"
              >
                {{ p.nama_pasien }} <span class="text-gray-500">(NIK: {{ p.nik || '-' }})</span>
              </li>
            </ul>
          </div>

          <div class="col-span-3 sm:col-span-2 relative flex flex-col">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Pilih Dokter Pemeriksa</label>
            <input
              v-model="searchDokter"
              placeholder="Cari nama dokter..."
              class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
              @input="onInputDokter"
            >
            <ul v-if="showDokterDropdown" class="absolute top-full left-0 z-10 w-full bg-white border border-gray-200 mt-1 max-h-48 overflow-y-auto rounded-lg shadow-lg">
              <li v-if="filteredDokter.length === 0" class="p-3 text-gray-500 text-sm">
                Tidak ditemukan
              </li>
              <li
                v-for="d in filteredDokter"
                :key="d.id_dokter"
                class="p-3 hover:bg-indigo-50 cursor-pointer text-sm transition"
                @click="selectDokter(d)"
              >
                {{ d.nama_dokter }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- FORM PEMERIKSAAN -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h4 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">
          Form Pemeriksaan
        </h4>
        <div class="grid grid-cols-3 gap-5">
          <div class="col-span-3 flex flex-col">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Keluhan</label>
            <textarea
              v-model="form.keluhan"
              rows="3"
              class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none resize-none"
            />
          </div>

          <div class="flex flex-col">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Tinggi Badan (cm)</label>
            <input
              v-model="form.tinggi_badan"
              type="number"
              placeholder="contoh: 170"
              class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
            >
          </div>

          <div class="flex flex-col">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Berat Badan (kg)</label>
            <input
              v-model="form.berat_badan"
              type="number"
              placeholder="contoh: 65"
              class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
            >
          </div>

          <div class="flex flex-col">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Tekanan Darah</label>
            <input
              v-model="form.tekanan_darah"
              placeholder="contoh: 120/80"
              class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none"
            >
          </div>

          <div class="col-span-3 flex flex-col">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Diagnosa</label>
            <textarea
              v-model="form.diagnosa"
              rows="3"
              class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <!-- RESEP OBAT -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div class="flex justify-between items-center border-b border-gray-50 pb-2 mb-4">
          <h4 class="text-lg font-bold text-gray-800">
            Resep Obat
          </h4>
          <button class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition shadow-sm border border-blue-200 text-sm" @click="tambahObat">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Obat
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-3 font-semibold text-gray-600">
                  Obat
                </th>
                <th class="px-5 py-3 font-semibold text-gray-600 w-32">
                  Jumlah
                </th>
                <th class="px-5 py-3 font-semibold text-gray-600">
                  Dosis
                </th>
                <th class="px-5 py-3 font-semibold text-gray-600 text-center w-24">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in resep" :key="index" class="border-b border-gray-50 last:border-0 hover:bg-indigo-50/30 transition">
                <td class="px-5 py-3">
                  <select v-model="item.obat" class="px-3 py-2 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none bg-white text-sm">
                    <option disabled value="">
                      Pilih Obat
                    </option>
                    <option v-for="o in obatList" :key="o.id_obat" :value="o.id_obat">
                      {{ o.nama_obat }}
                    </option>
                  </select>
                </td>
                <td class="px-5 py-3">
                  <input v-model="item.jumlah" type="number" min="1" class="px-3 py-2 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none text-sm">
                </td>
                <td class="px-5 py-3">
                  <input v-model="item.dosis" placeholder="contoh: 3x1" class="px-3 py-2 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none text-sm">
                </td>
                <td class="px-5 py-3 align-middle text-center">
                  <button class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus Obat" @click="hapusObat(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="resep.length === 0">
                <td colspan="4" class="py-6 text-center text-gray-400 text-sm">
                  Belum ada obat yang ditambahkan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- BUTTON SIMPAN -->
      <div class="flex justify-end pt-4 border-t border-gray-100">
        <button class="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md flex items-center gap-2" @click="simpan">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Simpan Pemeriksaan
        </button>
      </div>
    </div>
  </div>
</template>
