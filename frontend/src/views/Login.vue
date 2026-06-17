<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '../services/auth'

const { username, password, errorMessage, isLoading, login } = useAuth()

const logoutReason = ref('')
const showPassword = ref(false)

onMounted(() => {
  const reason = sessionStorage.getItem('logout_reason')

  if (reason) {
    logoutReason.value = reason
    sessionStorage.removeItem('logout_reason')
  }
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-200 p-6"
  >
    <div
      class="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2"
    >

      <!-- LEFT PANEL -->
      <div
        class="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-cyan-600 to-indigo-700 text-white p-12"
      >
        <div
          class="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-8"
        >
          <span class="text-6xl">🏥</span>
        </div>

        <h1 class="text-5xl font-bold mb-4">
          Puskesmas
        </h1>

        <p class="text-center text-lg text-blue-100 max-w-md">
          Sistem Informasi Pelayanan Kesehatan Modern untuk mendukung
          pengelolaan pasien, rekam medis, dan layanan kesehatan secara
          terintegrasi.
        </p>

        <div class="mt-12 space-y-5 text-lg">
          <div class="flex items-center gap-3">
            <span>✔️</span>
            <span>Data Pasien Terintegrasi</span>
          </div>

          <div class="flex items-center gap-3">
            <span>✔️</span>
            <span>Rekam Medis Digital</span>
          </div>

          <div class="flex items-center gap-3">
            <span>✔️</span>
            <span>Layanan Kesehatan Modern</span>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="p-8 md:p-12 flex flex-col justify-center">

        <div class="text-center mb-8">
          <div
            class="w-20 h-20 mx-auto rounded-full bg-cyan-100 flex items-center justify-center mb-4 lg:hidden"
          >
            <span class="text-4xl">🏥</span>
          </div>

          <h2 class="text-3xl font-bold text-gray-800">
            Selamat Datang
          </h2>

          <p class="text-gray-500 mt-2">
            Silakan login untuk melanjutkan
          </p>
        </div>

        <!-- ALERT LOGOUT -->
        <div
          v-if="logoutReason"
          class="mb-4 p-4 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-800"
        >
          {{ logoutReason }}
        </div>

        <!-- ALERT ERROR -->
        <div
          v-if="errorMessage"
          class="mb-4 p-4 rounded-xl bg-red-50 border border-red-300 text-red-700"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="login">

          <!-- USERNAME -->
          <div class="mb-5">
            <label class="block mb-2 text-sm font-semibold text-gray-700">
              Username
            </label>

            <div class="relative">
              <span
                class="absolute left-4 top-3.5 text-gray-400"
              >
                👤
              </span>

              <input
                v-model="username"
                type="text"
                required
                placeholder="Masukkan Username"
                class="
                  w-full
                  pl-12
                  pr-4
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  focus:outline-none
                  focus:ring-4
                  focus:ring-cyan-200
                  focus:border-cyan-500
                  transition
                "
              >
            </div>
          </div>

          <!-- PASSWORD -->
          <div class="mb-5">
            <label class="block mb-2 text-sm font-semibold text-gray-700">
              Password
            </label>

            <div class="relative">
              <span
                class="absolute left-4 top-3.5 text-gray-400"
              >
                🔒
              </span>

              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Masukkan Password"
                class="
                  w-full
                  pl-12
                  pr-12
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  focus:outline-none
                  focus:ring-4
                  focus:ring-cyan-200
                  focus:border-cyan-500
                  transition
                "
              >

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="
                  absolute
                  right-4
                  top-3
                  text-gray-500
                  hover:text-cyan-600
                "
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- REMEMBER -->
          <div class="flex justify-between items-center mb-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                class="
                  rounded
                  text-cyan-600
                  focus:ring-cyan-500
                "
              >

              <span class="ml-2 text-sm text-gray-600">
                Remember Me
              </span>
            </label>

            <a
              href="#"
              class="text-sm text-cyan-600 hover:text-cyan-700"
            >
              Lupa Password?
            </a>
          </div>

          <!-- BUTTON -->
          <button
            type="submit"
            :disabled="isLoading"
            class="
              w-full
              py-3
              rounded-xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-cyan-600
              to-indigo-600
              hover:from-cyan-700
              hover:to-indigo-700
              hover:shadow-xl
              hover:scale-[1.02]
              transition-all
              duration-300
              disabled:opacity-50
            "
          >
            {{ isLoading ? 'Signing In...' : 'Masuk ke Sistem' }}
          </button>

        </form>

        <div class="mt-8 text-center text-sm text-gray-400">
        </div>

      </div>

    </div>
  </div>
</template>