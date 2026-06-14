import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import axiosConfig from '../api/axiosConfig'

const { db } = axiosConfig
const PersonaContext = createContext(null)

export function PersonaProvider({ children }) {
  const { isSignedIn, isLoaded } = useAuth()
  const [persona, setPersona] = useState(null)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [tieneOnboarding, setTieneOnboarding] = useState(null) // null = todavia no se sabe

  const consultarPersona = useCallback(async () => {
    try {
      const { data } = await db.get('/auth/me')
      setPersona(data.persona)
      setProductos(data.productos)
      setTieneOnboarding(true)
    } catch (error) {
      if (error.response?.status === 404) {
        setTieneOnboarding(false)
      } else {
        console.error('Error al consultar persona:', error)
      }
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      consultarPersona()
    }
  }, [isLoaded, isSignedIn, consultarPersona])

  return (
    <PersonaContext.Provider value={{ persona, productos, cargando, tieneOnboarding }}>
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  return useContext(PersonaContext)
}