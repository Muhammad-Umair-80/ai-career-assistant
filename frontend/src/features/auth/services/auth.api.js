import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function normalizeAxiosError(err) {
  const message = err?.response?.data?.message ?? err?.response?.data ?? err.message
  const status = err?.response?.status
  const error = new Error(`Request failed (${status}): ${message}`)
  error.status = status
  error.response = err?.response
  return error
}

export async function register(data) {
  const url = `${API_BASE}/auth/register`
  try {
    const res = await axios.post(url, data, { withCredentials: true })
    return res.data
  } catch (err) {
    throw normalizeAxiosError(err)
  }
}

export async function login(credentials) {
  const url = `${API_BASE}/auth/login`
  try {
    const res = await axios.post(url, credentials, { withCredentials: true })
    return res.data
  } catch (err) {
    throw normalizeAxiosError(err)
  }
}

export async function getMe() {
  const url = `${API_BASE}/auth/get-me`
  try {
    const res = await axios.get(url, { withCredentials: true })
    return res.data
  } catch (err) {
    throw normalizeAxiosError(err)
  }
}
