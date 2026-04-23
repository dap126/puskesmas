import axios from 'axios'

/* ================= OBAT ================= */
export interface Obat {
  id_obat?: number
  nama_obat: string
  kategori: string
  stok: number
  satuan: string
}

const API_URL_OBAT = 'http://localhost:3000/api/obat'
const API_URL_DETAILRESEP = 'http://localhost:3000/api/detailresep'

export const obatService = {
  async getAllObat(): Promise<Obat[]> {
    const response = await axios.get(API_URL_OBAT)
    return response.data
  },

  async createObat(data: Obat) {
    const response = await axios.post(API_URL_OBAT, data)
    return response.data
  },

  async deleteObat(id: number) {
    const response = await axios.delete(`${API_URL_OBAT}/${id}`)
    return response.data
  },
}

/* ================= DETAIL RESEP ================= */
export interface DetailResep {
  id_detail?: number // ✅ FIX: optional
  jumlah_obat: number
  dosis: string
  resep_obat_id_resep: number
  obat_id_obat: number
}

export const detailresepService = {
  async getAllDetailResep(): Promise<DetailResep[]> {
    const response = await axios.get(API_URL_DETAILRESEP)
    return response.data
  },

  async createDetailResep(data: DetailResep) {
    const response = await axios.post(API_URL_DETAILRESEP, data)
    return response.data
  },

  async deleteDetailResep(id: number) {
    const response = await axios.delete(`${API_URL_DETAILRESEP}/${id}`)
    return response.data
  },
}