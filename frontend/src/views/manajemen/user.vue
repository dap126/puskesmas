<script setup>
import { ref, onMounted, watch } from 'vue';
import { registerUserAPI, getUsersAPI, updateUserAPI, deleteUserAPI } from '../../services/auth';
import { dokterService } from '../../services/dokter';

const form = ref({ username: '', nama: '', password: '', role: 'resepsionis' });
const pesanSukses = ref('');
const pesanError = ref('');
const daftarUser = ref([]);

// State untuk dokter yang belum terhubung ke akun user
const unlinkedDokter = ref([]);
const selectedDokterId = ref('');

// State untuk Modal
const showModal = ref(false);
const isEditMode = ref(false);
const editUserId = ref(null);

// State untuk Confirm Dialog
const showConfirmDialog = ref(false);
const deleteId = ref(null);

// Fungsi untuk mengambil data dari backend
const fetchUsers = async () => {
  try {
    const data = await getUsersAPI();
    daftarUser.value = data;
  } catch (error) {
    console.error(error.message);
    pesanError.value = error.message;
    if (error.message.includes('Token tidak valid') || error.message.includes('Token tidak ditemukan')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  editUserId.value = null;
  form.value = { username: '', nama: '', password: '', role: 'resepsionis' };
  selectedDokterId.value = '';
  pesanSukses.value = '';
  pesanError.value = '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Fetch dokter yang belum punya akun (users_idusers == null)
const fetchUnlinkedDokter = async () => {
  try {
    const allDokter = await dokterService.getAllDokter();
    unlinkedDokter.value = allDokter.filter(d => !d.users_idusers);
  } catch (error) {
    console.error('Gagal mengambil data dokter:', error);
  }
};

// Watch perubahan role -> fetch unlinked dokter ketika role = dokter
watch(() => form.value.role, (newRole) => {
  if (newRole === 'dokter' && !isEditMode.value) {
    fetchUnlinkedDokter();
  } else {
    selectedDokterId.value = '';
    form.value.nama = '';
  }
});

// Watch perubahan dokter terpilih -> auto-fill nama lengkap
watch(selectedDokterId, (newId) => {
  if (newId && form.value.role === 'dokter') {
    const dokter = unlinkedDokter.value.find(d => d.id_dokter === Number(newId));
    if (dokter) {
      form.value.nama = dokter.nama_dokter;
    }
  }
});

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

      // Jika role dokter dan ada dokter yang dipilih, hubungkan
      if (form.value.role === 'dokter' && selectedDokterId.value && response.id) {
        try {
          await dokterService.linkDokterToUser(Number(selectedDokterId.value), response.id);
          pesanSukses.value += ' & berhasil dihubungkan ke dokter.';
        } catch (linkError) {
          console.error('Gagal menghubungkan dokter:', linkError);
          pesanError.value = 'User terdaftar, tapi gagal menghubungkan ke data dokter.';
        }
      }
    }
    
    fetchUsers(); 
    closeModal();
    
  } catch (error) {
    pesanError.value = error.message;
    if (error.message.includes('Token tidak valid') || error.message.includes('Token tidak ditemukan')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
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

const openConfirmDialog = (id) => {
  deleteId.value = id;
  showConfirmDialog.value = true;
};

const cancelDelete = () => {
  showConfirmDialog.value = false;
  deleteId.value = null;
};

const confirmDelete = async () => {
  if (!deleteId.value) return;
  pesanSukses.value = '';
  pesanError.value = '';
  try {
    const response = await deleteUserAPI(deleteId.value);
    pesanSukses.value = response.message;
    showConfirmDialog.value = false;
    fetchUsers();
  } catch (error) {
    pesanError.value = error.message;
    showConfirmDialog.value = false;
    if (error.message.includes('Token tidak valid') || error.message.includes('Token tidak ditemukan')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }
};

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

    <!-- Alert Sukses -->
    <div v-if="pesanSukses" class="mb-4">
      <p class="text-emerald-600 text-sm font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
        {{ pesanSukses }}
      </p>
    </div>

    <!-- Alert Error -->
    <div v-if="pesanError" class="mb-4">
      <p class="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
        {{ pesanError }}
      </p>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-5 py-4 font-semibold text-gray-600">No</th>
              <th class="px-5 py-4 font-semibold text-gray-600">Username</th>
              <th class="px-5 py-4 font-semibold text-gray-600">Nama Lengkap</th>
              <th class="px-5 py-4 font-semibold text-gray-600">Jabatan</th>
              <th class="px-5 py-4 font-semibold text-gray-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in daftarUser" :key="user.idusers" class="hover:bg-indigo-50/50 transition border-b border-gray-50 last:border-0">
              <td class="px-5 py-4 text-gray-600">{{ index + 1 }}</td>
              <td class="px-5 py-4 text-gray-800 font-medium">{{ user.username }}</td>
              <td class="px-5 py-4 text-gray-800">{{ user.nama || '-' }}</td>
              <td class="px-5 py-4">
                <span 
                  class="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide"
                  :class="{
                    'bg-blue-100 text-blue-700': user.role === 'dokter',
                    'bg-green-100 text-green-700': user.role === 'apoteker',
                    'bg-yellow-100 text-yellow-700': user.role === 'resepsionis',
                    'bg-purple-100 text-purple-700': user.role === 'admin'
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-5 py-4 align-middle">
                <div class="flex justify-center gap-2">
                  <button @click="handleEditUser(user)" class="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 shadow-sm transition" title="Edit User">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Zm0 0L19.5 7.15M6.832 19.82l-1.897-1.13" />
                    </svg>
                  </button>
                  <button @click="openConfirmDialog(user.idusers)" class="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 shadow-sm transition" title="Hapus User">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="daftarUser.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-400">
                Belum ada data pegawai terdaftar.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Konfirmasi Penghapusan</h2>
        <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus data pegawai ini?</p>
        <div class="flex justify-end gap-3">
          <button class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition" @click="cancelDelete">
            Batal
          </button>
          <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition" @click="confirmDelete">
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form Tambah/Edit User -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div class="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-xl">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            {{ isEditMode ? 'Edit Pegawai' : 'Tambah Pegawai Baru' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmitUser" class="grid grid-cols-2 gap-5">
          <div class="flex flex-col col-span-2 sm:col-span-1">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Username</label>
            <input v-model="form.username" type="text" placeholder="Masukkan Username" required class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none">
          </div>

          <div class="flex flex-col col-span-2 sm:col-span-1">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Nama Lengkap</label>
            <input v-model="form.nama" type="text" placeholder="Masukkan Nama Lengkap" :disabled="form.role === 'dokter'" :class="form.role === 'dokter' ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''" class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none">
          </div>

          <div class="flex flex-col col-span-2 sm:col-span-1">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm flex justify-between">
              <span>Password</span>
              <span v-if="isEditMode" class="text-xs text-gray-400 font-normal italic">*Kosongkan jika tidak diubah</span>
            </label>
            <input v-model="form.password" type="password" :required="!isEditMode" :placeholder="isEditMode ? '******' : 'Masukkan Password'" class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none">
          </div>

          <div class="flex flex-col col-span-2 sm:col-span-1">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Jabatan</label>
            <select v-model="form.role" class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none bg-white">
              <option value="" disabled>--</option>
              <option value="resepsionis">Resepsionis</option>
              <option value="dokter">Dokter</option>
              <option value="apoteker">Apoteker</option>
            </select>
          </div>

          <!-- Dropdown Integrasi Dokter (hanya muncul saat role = dokter & mode tambah) -->
          <div v-if="form.role === 'dokter' && !isEditMode" class="flex flex-col col-span-2">
            <label class="mb-1.5 font-semibold text-gray-700 text-sm">Hubungkan ke Dokter</label>
            <select v-model="selectedDokterId" class="px-4 py-2.5 rounded-lg border border-gray-300 transition w-full focus:border-indigo-600 focus:ring focus:ring-indigo-200 outline-none bg-white">
              <option value="" disabled>--</option>
              <option v-for="doc in unlinkedDokter" :key="doc.id_dokter" :value="doc.id_dokter">
                {{ doc.nama_dokter }} — {{ doc.jadwal_praktik || 'Tanpa jadwal' }}
              </option>
            </select>
            <p class="text-xs text-gray-400 mt-1 italic">Hanya menampilkan dokter yang belum terhubung ke akun</p>
          </div>

          <div class="col-span-2 flex justify-end gap-3 mt-4 pt-5 border-t border-gray-100">
            <button type="button" @click="closeModal" class="bg-white text-gray-600 px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">Batal</button>
            <button type="submit" class="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
              {{ isEditMode ? 'Simpan' : 'Daftar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>
