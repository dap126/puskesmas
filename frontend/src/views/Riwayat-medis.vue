<template>
<div v-if="showModalMedis" class="modal">
  <div class="modal-content">
    <h3>Tambah Data Medis</h3>

    <input v-model.number="formMedis.id_rm" type="number" placeholder="ID Rekam Medis" />
    
    <input v-model="formMedis.tgl_periksa" type="date" />

    <input v-model="formMedis.keluhan" placeholder="Keluhan" />

    <input v-model.number="formMedis.tinggi_badan" type="number" placeholder="Tinggi Badan (cm)" />

    <input v-model.number="formMedis.berat_badan" type="number" placeholder="Berat Badan (kg)" />

    <input v-model.number="formMedis.tekana_darah" type="number" placeholder="Tekanan Darah" />

    <input v-model="formMedis.diagnosa" placeholder="Diagnosa" />

    <input v-model="formMedis.pasien_idpasien" placeholder="ID Pasien" />

    <input v-model="formMedis.dokter_id_dokter" placeholder="ID Dokter" />

    <button @click="handleSubmitMedis">Simpan</button>
    <button @click="showModalMedis = false">Batal</button>

    <p style="color: green">{{ pesanSukses }}</p>
    <p style="color: red">{{ pesanError }}</p>
  </div>
</div>
</template>


<script>
import { ref } from 'vue'
import { medisService } from '../services/medis'

const showModalMedis = ref(false)

const formMedis = ref({
  id_rm: 0,
  tgl_periksa: '',
  keluhan: '',
  tinggi_badan: 0,
  berat_badan: 0,
  tekana_darah: 0,
  diagnosa: '',
  pasien_idpasien: '',
  dokter_id_dokter: ''
})

const pesanSukses = ref('')
const pesanError = ref('')

const openModalMedis = () => {
  formMedis.value = {
    id_rm: 0,
    tgl_periksa: '',
    keluhan: '',
    tinggi_badan: 0,
    berat_badan: 0,
    tekana_darah: 0,
    diagnosa: '',
    pasien_idpasien: '',
    dokter_id_dokter: ''
  }
  showModalMedis.value = true
}

const handleSubmitMedis = async () => {
  pesanSukses.value = ''
  pesanError.value = ''

  try {
    const payload = {
      ...formMedis.value,
      tgl_periksa: new Date(formMedis.value.tgl_periksa).getTime()
    }

    await medisService.createMedis(payload)
    pesanSukses.value = 'Data medis berhasil ditambahkan'
    showModalMedis.value = false
  } catch (error) {
    pesanError.value = error.message
  }
}
</script>