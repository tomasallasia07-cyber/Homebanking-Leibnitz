import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAxiosAuth } from './hooks/useAxiosAuth'
import { PersonaProvider, usePersona } from './context/PersonaContext'
import PaginaLogin from './pages/paginaLogin'
import Dashboard from './pages/Dashboard'
import Transferencias from './pages/Transferencias'
import Movimientos from './pages/Movimientos'
import RegisterPersonCentralBank from './components/auth/registerPersonCentralBank'

function RutaProtegida({ children }) {
  return (
    <>
      <SignedIn>
        <PersonaProvider>{children}</PersonaProvider>
      </SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  )
}

function GateOnboarding({ children }) {
  const { cargando, tieneOnboarding } = usePersona()

  if (cargando) return <p>Cargando...</p>
  if (tieneOnboarding === false) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  useAxiosAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <SignedOut><PaginaLogin /></SignedOut>
            <SignedIn><Navigate to="/dashboard" /></SignedIn>
          </>
        } />

        <Route path="/onboarding" element={
          <RutaProtegida>
            <RegisterPersonCentralBank />
          </RutaProtegida>
        } />

        <Route path="/dashboard" element={
          <RutaProtegida>
            <GateOnboarding><Dashboard /></GateOnboarding>
          </RutaProtegida>
        } />
        <Route path="/transferencias" element={
          <RutaProtegida>
            <GateOnboarding><Transferencias /></GateOnboarding>
          </RutaProtegida>
        } />
        <Route path="/movimientos" element={
          <RutaProtegida>
            <GateOnboarding><Movimientos /></GateOnboarding>
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}