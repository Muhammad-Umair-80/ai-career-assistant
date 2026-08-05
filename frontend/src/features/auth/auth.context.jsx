import { useState } from 'react'
import * as api from './services/auth.api'

export function useAuth() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.login({ email, password })
      return res
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data) => {
    setLoading(true)
    try {
      const res = await api.register(data)
      return res
    } finally {
      setLoading(false)
    }
  }

  const getMe = async () => {
    setLoading(true)
    try {
      const res = await api.getMe()
      return res
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleLogin, handleRegister, getMe }
}
