import axios from 'axios'

export interface Poli {
  id_poli: number
  nama_poli: string
}

const API_URL = 'http://localhost:3000/api/poli'

export const poliService = {
  async getAllPoli(): Promise<Poli[]> {
    const response = await axios.get(API_URL)
    return response.data
  },
}
