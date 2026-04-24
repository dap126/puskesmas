import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const isLoading = ref(false)

  async function login() {
    errorMessage.value = ''
    isLoading.value = true
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        errorMessage.value = data.message || 'Login failed'
        return
      }
      
      // Save token to localStorage 
      localStorage.setItem('token', data.token)
      
      // Save user role for router guard
      localStorage.setItem('user_role', data.user.role)

      // Save user info just in case
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Navigate to dashboard
      router.push('/dashboard')
    } catch (error) {
      errorMessage.value = 'Failed to connect to the server'
    } finally {
      isLoading.value = false
    }
  }

  return {
    username,
    password,
    errorMessage,
    isLoading,
    login
  }
}

export async function registerUserAPI(username: string, nama: string, password: string, role: string) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username, nama, password, role })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Gagal mendaftarkan user');
  }
  return await response.json();
}

export async function getUsersAPI() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/auth/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Gagal mengambil data user');
  }
  return await response.json();
}

export async function updateUserAPI(id: number, username: string, nama: string, role: string, password?: string) {
  const token = localStorage.getItem('token');
  const body: any = { username, nama, role };
  if (password) body.password = password;

  const response = await fetch(`http://localhost:3000/api/auth/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Gagal mengubah data user');
  }
  return await response.json();
}

export async function deleteUserAPI(id: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:3000/api/auth/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Gagal menghapus data user');
  }
  return await response.json();
}