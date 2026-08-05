import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function register(data) {
  const url = `${API_BASE}/auth/register`
  const res = await axios.post(url, data, { withCredentials: true })
  return res.data
}

export async function login(credentials) {
  const url = `${API_BASE}/auth/login`
  const res = await axios.post(url, credentials, { withCredentials: true })
  return res.data
}

export async function getMe() {
  const url = `${API_BASE}/auth/get-me`
  const res = await axios.get(url, { withCredentials: true })
  return res.data
}
