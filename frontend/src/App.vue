<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const defaultLayout = 'default'

const router = useRouter()
const currentRoute = router.currentRoute

const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`,
)

// Timer batas tidak aktif (Idle) - Ditetapkan 2 Jam (dalam milidetik)
const IDLE_TIMEOUT = 2 * 60 * 60 * 1000 
let idleTimer: ReturnType<typeof setTimeout>

const logoutUser = () => {
  // Hanya proses logout jika user SEDANG TDK BERADA di halaman Login
  if (currentRoute.value.name !== 'Login') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push({ name: 'Login' })
    alert("Sesi Anda telah habis karena tidak ada aktivitas. Silakan login kembali.")
  }
}

const resetIdleTimer = () => {
  clearTimeout(idleTimer)
  // Mulai hitung ulang setiap ada pergerakan
  idleTimer = setTimeout(logoutUser, IDLE_TIMEOUT)
}

onMounted(() => {
  window.addEventListener('mousemove', resetIdleTimer)
  window.addEventListener('keydown', resetIdleTimer)
  window.addEventListener('click', resetIdleTimer)
  window.addEventListener('scroll', resetIdleTimer)
  
  resetIdleTimer()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', resetIdleTimer)
  window.removeEventListener('keydown', resetIdleTimer)
  window.removeEventListener('click', resetIdleTimer)
  window.removeEventListener('scroll', resetIdleTimer)
  clearTimeout(idleTimer)
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
