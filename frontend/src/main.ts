import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios'

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'
import UPagination from './components/UPagination.vue'

const app = createApp(App)

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.component('UPagination', UPagination)

// Setup Axios Interceptor for Auth
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token)
    config.headers.Authorization = `Bearer ${token}`

  return config
})

app.use(router)

app.mount('#app')
