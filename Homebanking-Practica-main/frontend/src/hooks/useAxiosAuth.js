import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import axiosConfig from '../api/axiosConfig'

const { db } = axiosConfig

export function useAxiosAuth() {
  const { getToken } = useAuth()

  useEffect(() => {
    const interceptorId = db.interceptors.request.use(async (config) => {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Limpieza: si el componente se desmonta, sacamos el interceptor
    return () => {
      db.interceptors.request.eject(interceptorId)
    }
  }, [getToken])
}