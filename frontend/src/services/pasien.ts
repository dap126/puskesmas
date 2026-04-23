import axios from "axios";

// Pasien
export interface Pasien{
    id_pasein : number
    nik : number
    nama_pasien : string
    tgl_lahir : number
    jenis_kelamin : number
    alamat : string
    no_telpon : string
}
const API_URL_PASIEN = 'http://localhost:3000/api/pasien'

// Service Pasien
export const pasienService = {
  // Ambil semua data pasien
  async getAllPasien(): Promise<Pasien[]> {
    const response = await axios.get(API_URL_PASIEN)
    return response.data
  },

  // Tambah pasien baru
  async createPasien(data: Pasien): Promise<void> {
    await axios.post(API_URL_PASIEN, data)
  },

  // Hapus pasien
  async deletePasien(id: number): Promise<void> {
    await axios.delete(`${API_URL_PASIEN}/${id}`)
  },
}


// Antrean
export interface Antrean{
    idantrean : number
    tgl_antrean : number
    no_antrean : string
    status : number
    pasien_idpasien : string
    poli_id_poli : number
}

const API_URL_ANTREAN = 'http://localhost:3000/api/antrean'

// Service Antrean
export const antreanService = {
  // Ambil semua data antrean
  async getAllAntrean(): Promise<Antrean[]> {
    const response = await axios.get(API_URL_ANTREAN)
    return response.data
  },

  // Tambah antrean baru
  async createAntrean(data: Antrean): Promise<void> {
    await axios.post(API_URL_ANTREAN, data)
  },

  // Hapus antrean
  async deleteAntrean(id: number): Promise<void> {
    await axios.delete(`${API_URL_ANTREAN}/${id}`)
  },
}