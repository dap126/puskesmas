import axios from 'axios'
export interface medis {
    id_rm : number
    tgl_periksa : number
    keluhan : string
    tinggi_badan : number
    berat_badan : number
    tekanan_darah : number
    diagnosa : string
    pasien_idpasien : string
    dokter_id_dokter : string
}

const API_URL_MEDIS = 'http://localhost:3000/api/medis'
const API_URL_RESEP = 'http://localhost:3000/api/resep'

export const medisService = {
  // Ambil semua data medis
  async getAllMedis(): Promise<medis[]> {
    const response = await axios.get(API_URL_MEDIS)
    return response.data
  },

  // Tambah data medis baru
  async createMedis(data: medis): Promise<void> {
    await axios.post(API_URL_MEDIS, data)
  },

  // Hapus data medis
  async deleteMedis(id: number): Promise<void> {
    await axios.delete(`${API_URL_MEDIS}/${id}`)
  },
}

export interface resep {
    id_resep : number
    tgl_resep : number
    status_tebus : string
    rekam_medis_id_rm : number
}

export const resepService = {
  // Ambil semua resep medis
  async getAllResep(): Promise<resep[]> {
    const response = await axios.get(API_URL_RESEP)
    return response.data
  },

  // Tambah data resep baru
  async createResep(data: resep): Promise<void> {
    await axios.post(API_URL_RESEP, data)
  },

  // Hapus data resep
  async deleteResep(id: number): Promise<void> {
    await axios.delete(`${API_URL_RESEP}/${id}`)
  },
}