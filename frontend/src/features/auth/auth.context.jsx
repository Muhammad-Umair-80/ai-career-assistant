import { createContext, useState, useEffect, useContext } from 'react'
import { getMe, login as apiLogin } from "./services/auth.api"
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch current user on mount
    let mounted = true;
    (async () => {
      try {
        const data = await getMe();
        if (mounted) {
          setUser(data.user || null);
        }
      } catch (err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogin(email, password) {
    setLoading(true);
    try {
      const data = await apiLogin({ email, password });
      setUser(data.user || null);
      return data;
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}
