<script setup>
import { ref, onMounted } from 'vue';
import { registerUserAPI, getUsersAPI, updateUserAPI, deleteUserAPI } from '../services/auth';

const form = ref({ username: '', nama: '', password: '', role: 'resepsionis' });
const pesanSukses = ref('');
const pesanError = ref('');
const daftarUser = ref([]); // State untuk menampung data tabel

// State untuk Modal
const showModal = ref(false);
const isEditMode = ref(false);
const editUserId = ref(null);

// Fungsi untuk mengambil data dari backend
const fetchUsers = async () => {
  try {
    const data = await getUsersAPI();
    daftarUser.value = data;
  } catch (error) {
    console.error(error.message);
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  editUserId.value = null;
  form.value = { username: '', nama: '', password: '', role: 'resepsionis' };
  pesanSukses.value = '';
  pesanError.value = '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Fungsi saat tombol tambah/edit ditekan
const handleSubmitUser = async () => {
  pesanSukses.value = '';
  pesanError.value = '';

  try {
    if (isEditMode.value) {
      const response = await updateUserAPI(editUserId.value, form.value.username, form.value.nama, form.value.role, form.value.password);
      pesanSukses.value = response.message;
    } else {
      const response = await registerUserAPI(form.value.username, form.value.nama, form.value.password, form.value.role);
      pesanSukses.value = response.message;
    }
    
    fetchUsers(); 
    closeModal();
    
  } catch (error) {
    pesanError.value = error.message;
  }
};

const handleEditUser = (user) => {
  isEditMode.value = true;
  editUserId.value = user.idusers;
  form.value = { 
    username: user.username, 
    nama: user.nama || '', 
    password: '', 
    role: user.role 
  };
  pesanSukses.value = '';
  pesanError.value = '';
  showModal.value = true;
};

const handleHapusUser = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
    pesanSukses.value = '';
    pesanError.value = '';
    try {
      const response = await deleteUserAPI(id);
      pesanSukses.value = response.message;
      fetchUsers();
    } catch (error) {
      pesanError.value = error.message;
    }
  }
};

// Jalankan fungsi ambil data saat halaman pertama kali dibuka
onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="max-w-6xl mx-auto mt-10 p-4 relative">
    <div class="w-full bg-white p-6 border rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-800">Daftar Pegawai</h3>
        <button @click="openAddModal" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Tambah Pegawai
        </button>
      </div>

      <div v-if="pesanSukses" class="flex w-full overflow-hidden bg-white rounded-lg shadow-md mb-4 border border-gray-100">
        <div class="flex items-center justify-center w-12 bg-green-500">
          <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
          </svg>
        </div>
        <div class="px-4 py-2 -mx-3">
          <div class="mx-3">
            <span class="font-semibold text-green-500">Success</span>
            <p class="text-sm text-gray-600">{{ pesanSukses }}</p>
          </div>
        </div>
      </div>

      <div v-if="pesanError" class="flex w-full overflow-hidden bg-white rounded-lg shadow-md mb-4 border border-gray-100">
        <div class="flex items-center justify-center w-12 bg-red-500">
          <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
          </svg>
        </div>
        <div class="px-4 py-2 -mx-3">
          <div class="mx-3">
            <span class="font-semibold text-red-500">Error</span>
            <p class="text-sm text-gray-600">{{ pesanError }}</p>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-3 px-4 border-b text-gray-700 font-semibold">No</th>
              <th class="py-3 px-4 border-b text-gray-700 font-semibold">Username</th>
              <th class="py-3 px-4 border-b text-gray-700 font-semibold">Nama Lengkap</th>
              <th class="py-3 px-4 border-b text-gray-700 font-semibold">Jabatan</th>
              <th class="py-3 px-4 border-b text-gray-700 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in daftarUser" :key="user.idusers" class="hover:bg-gray-50 transition">
              <td class="py-3 px-4 border-b text-gray-600">{{ index + 1 }}</td>
              <td class="py-3 px-4 border-b text-gray-800 font-medium">{{ user.username }}</td>
              <td class="py-3 px-4 border-b text-gray-800">{{ user.nama || '-' }}</td>
              <td class="py-3 px-4 border-b">
                <span 
                  class="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide"
                  :class="{
                    'bg-blue-100 text-blue-700': user.role === 'dokter',
                    'bg-green-100 text-green-700': user.role === 'apoteker',
                    'bg-yellow-100 text-yellow-700': user.role === 'resepsionis'
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="py-3 px-4 border-b align-middle">
                <div class="flex justify-center gap-2">
                  <button @click="handleEditUser(user)" class="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 shadow-sm transition" title="Edit User">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Zm0 0L19.5 7.15M6.832 19.82l-1.897-1.13" />
                    </svg>
                  </button>
                  <button @click="handleHapusUser(user.idusers)" class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus User">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="daftarUser.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 mb-2 opacity-50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  <p>Belum ada data tersimpan.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Tambah/Edit User -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm transition-opacity px-4">
      <div class="bg-white p-7 rounded-xl shadow-2xl w-full max-w-md transform transition-all border border-gray-100">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg v-if="!isEditMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 text-blue-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.665 0v.11a2.25 2.25 0 0 1-2.25 2.25H6.25a2.25 2.25 0 0 1-2.25-2.25Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 text-blue-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.155" />
            </svg>
            {{ isEditMode ? 'Edit Pegawai' : 'Tambah Pegawai Baru' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmitUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input v-model="form.username" type="text" required class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
            <input v-model="form.nama" type="text" class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 flex justify-between">
              <span>Password</span>
              <span v-if="isEditMode" class="text-xs text-gray-400 font-normal italic">*Kosongkan jika tidak diubah</span>
            </label>
            <input v-model="form.password" type="password" :required="!isEditMode" class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow" :placeholder="isEditMode ? '******' : ''">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Jabatan</label>
            <select v-model="form.role" class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow">
              <option value="resepsionis">Resepsionis</option>
              <option value="dokter">Dokter</option>
              <option value="apoteker">Apoteker</option>
            </select>
          </div>
          
          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" @click="closeModal" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">Batal</button>
            <button type="submit" class="px-5 py-2.5 bg-blue-600 border border-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition">
              {{ isEditMode ? 'Simpan' : 'Daftar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>