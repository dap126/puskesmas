import axios from 'axios'

// 1. Definisi Interface sesuai ERD
export interface Dokter {
  id_dokter?: number
  nama_dokter: string
  jadwal_praktik: string
  users_idusers: number
  poli_id_poli: number
}

// 2. Logika Service (API Calls)
const API_URL = 'http://localhost:3000/api/dokter' // Sesuaikan dengan port backendmu

export const dokterService = {
  // Ambil semua data dokter
  async getAllDokter(): Promise<Dokter[]> {
    const response = await axios.get(API_URL)
    return response.data
  },

  // Tambah dokter baru
  async createDokter(data: Dokter): Promise<void> {
    await axios.post(API_URL, data)
  },

  // Hapus dokter
  async deleteDokter(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`)
  },
}
