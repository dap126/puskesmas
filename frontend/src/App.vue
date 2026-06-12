<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const defaultLayout = 'default'

const router = useRouter()
const currentRoute = router.currentRoute

const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`,
)

// ─── Idle Auto-logout (2 jam tidak aktif) ────────────────────────────────────
const IDLE_TIMEOUT = 2 * 60 * 60 * 1000
let idleTimer: ReturnType<typeof setTimeout>

function resetIdleTimer() {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    if (currentRoute.value.name !== 'Login' && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('user_role')
      sessionStorage.setItem('logout_reason', 'Sesi Anda telah habis karena tidak ada aktivitas selama 2 jam. Silakan login kembali.')
      window.location.href = '/'
    }
  }, IDLE_TIMEOUT)
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

