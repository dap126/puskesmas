export async function getDashboardStats() {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/dashboard/statistik?_t=${Date.now()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || 'Failed to fetch dashboard stats');
  }

  return response.json();
}
