import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAxiosAuth } from './hooks/useAxiosAuth'
import { PersonaProvider, usePersona } from './context/PersonaContext'
import PaginaLogin from './pages/paginaLogin'
import Dashboard from './pages/Dashboard'
import Transferencias from './pages/Transferencias'
import Movimientos from './pages/Movimientos'
import RegisterPersonCentralBank from './components/auth/registerPersonCentralBank'
import AdminDashboard from './pages/AdminDashboard'

function RutaAdmin({ children }) {
  const { esAdmin, cargando } = usePersona()
  if (cargando) return <p>Cargando...</p>
  if (!esAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function RutaProtegida({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><Navigate to="/" replace /></SignedOut>
    </>
  )
}

function GateOnboarding({ children }) {
  const { cargando, tieneOnboarding } = usePersona()

  if (cargando) return <p>Cargando...</p>
  if (tieneOnboarding === false) return <Navigate to="/onboarding" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <SignedOut><PaginaLogin /></SignedOut>
          <SignedIn><Navigate to="/dashboard" /></SignedIn>
        </>
      } />

      <Route path="/onboarding" element={
        <RutaProtegida><RegisterPersonCentralBank /></RutaProtegida>
      } />

      <Route path="/dashboard" element={
        <RutaProtegida><GateOnboarding><Dashboard /></GateOnboarding></RutaProtegida>
      } />

      <Route path="/transferencias" element={
        <RutaProtegida><GateOnboarding><Transferencias /></GateOnboarding></RutaProtegida>
      } />

      <Route path="/movimientos" element={
        <RutaProtegida><GateOnboarding><Movimientos /></GateOnboarding></RutaProtegida>
      } />

      <Route path="/admin" element={
        <RutaProtegida><RutaAdmin><AdminDashboard /></RutaAdmin></RutaProtegida>
      } />
    </Routes>
  )
}

export default function App() {
  useAxiosAuth()

  return (
    <BrowserRouter>
      <PersonaProvider>
        <AppRoutes />
      </PersonaProvider>
    </BrowserRouter>
  )
}