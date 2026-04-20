import axios from 'axios'

// Dokter
export interface Dokter {
  id_dokter?: number
  nama_dokter: string
  jadwal_praktik: string
  users_idusers: number
  poli_id_poli: number
}
const API_URL_DOKTER = 'http://localhost:3000/api/dokter'
const API_URL_POLI = 'http://localhost:3000/api/poli'

export const dokterService = {
  // Ambil semua data dokter
  async getAllDokter(): Promise<Dokter[]> {
    const response = await axios.get(API_URL_DOKTER)
    return response.data
  },

  // Tambah dokter baru
  async createDokter(data: Dokter): Promise<void> {
    await axios.post(API_URL_DOKTER, data)
  },

  // Hapus dokter
  async deleteDokter(id: number): Promise<void> {
    await axios.delete(`${API_URL_DOKTER}/${id}`)
  },
}

// Poli
export interface Poli {
  id_poli: number
  nama_poli: string
}

export const poliService = {
  async getAllPoli(): Promise<Poli[]> {
    const response = await axios.get(API_URL_POLI)
    return response.data
  },
}