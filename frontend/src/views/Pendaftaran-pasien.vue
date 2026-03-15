<template>
<div class="page">

  <div class="card">
    <h2 class="title">Pendaftaran Pasien</h2>

    <form @submit.prevent="tambahPasien" class="form-grid">

      <div class="form-group">
        <label>Nama Pasien</label>
        <input v-model="pasien.nama" type="text" placeholder="Masukkan nama pasien">
      </div>

      <div class="form-group">
        <label>NIK</label>
        <input v-model="pasien.nik" type="text" placeholder="Masukkan NIK">
      </div>

      <div class="form-group">
        <label>Jenis Kelamin</label>
        <select v-model="pasien.jk">
          <option value="">Pilih Jenis Kelamin</option>
          <option>Laki-laki</option>
          <option>Perempuan</option>
        </select>
      </div>

      <div class="form-group">
        <label>No HP</label>
        <input v-model="pasien.hp" type="text" placeholder="08xxxxxxxx">
      </div>

      <div class="form-group full">
        <label>Keluhan</label>
        <textarea v-model="pasien.keluhan" placeholder="Masukkan keluhan pasien"></textarea>
      </div>

      <div class="full">
        <button type="submit" class="btn">Daftarkan Pasien</button>
      </div>

    </form>
  </div>


  <div class="table-card">

    <h3>Data Pasien</h3>

    <table>
      <thead>
        <tr>
          <th>Nama</th>
          <th>NIK</th>
          <th>JK</th>
          <th>No HP</th>
          <th>Keluhan</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(p,index) in daftarPasien" :key="index">
          <td>{{p.nama}}</td>
          <td>{{p.nik}}</td>
          <td>{{p.jk}}</td>
          <td>{{p.hp}}</td>
          <td>{{p.keluhan}}</td>
        </tr>
      </tbody>

    </table>

  </div>

</div>
</template>

<script>
export default{
data(){
return{
pasien:{
nama:'',
nik:'',
jk:'',
hp:'',
keluhan:''
},
daftarPasien:[]
}
},

methods:{
tambahPasien(){

this.daftarPasien.push({...this.pasien})

this.pasien={
nama:'',
nik:'',
jk:'',
hp:'',
keluhan:''
}

}
}
}
</script>

<style>

.page{
padding:30px;
background:#f5f7fb;
min-height:100vh;
}

.card{
background:white;
padding:25px;
border-radius:10px;
box-shadow:0 5px 15px rgba(0,0,0,0.08);
margin-bottom:30px;
}

.title{
margin-bottom:20px;
color:#2c3e50;
}

.form-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:20px;
}

.form-group{
display:flex;
flex-direction:column;
}

.form-group label{
margin-bottom:5px;
font-weight:600;
color:#34495e;
}

input,select,textarea{
padding:10px;
border-radius:6px;
border:1px solid #ccc;
transition:0.2s;
}

input:focus,select:focus,textarea:focus{
border-color:#4f46e5;
outline:none;
box-shadow:0 0 0 2px rgba(79,70,229,0.1);
}

textarea{
min-height:80px;
}

.full{
grid-column:span 2;
}

.btn{
background:#4f46e5;
color:white;
padding:12px;
border:none;
border-radius:6px;
cursor:pointer;
font-weight:bold;
}

.btn:hover{
background:#4338ca;
}

.table-card{
background:white;
padding:20px;
border-radius:10px;
box-shadow:0 5px 15px rgba(0,0,0,0.08);
}

table{
width:100%;
border-collapse:collapse;
margin-top:10px;
}

th{
background:#4f46e5;
color:white;
padding:10px;
}

td{
padding:10px;
border-bottom:1px solid #eee;
}

tr:hover{
background:#f3f4ff;
}

</style>