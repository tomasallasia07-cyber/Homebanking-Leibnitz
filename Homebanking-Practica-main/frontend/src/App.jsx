import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Transferencias from './pages/Transferencias'
import Movimientos from './pages/Movimientos'

function PaginaLogin() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>🏦 Banco Leibnitz</h1>
        <h2 style={styles.subtitulo}>Bienvenido</h2>
        <div style={styles.botones}>
          <SignInButton mode="modal">
            <button style={styles.boton}>Iniciar Sesión</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={styles.botonSecundario}>Registrarse</button>
          </SignUpButton>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '360px', textAlign: 'center' },
  titulo: { color: '#1a3c6e', marginBottom: '4px' },
  subtitulo: { color: '#555', marginBottom: '32px', fontWeight: 'normal' },
  botones: { display: 'flex', flexDirection: 'column', gap: '12px' },
  boton: { width: '100%', padding: '12px', backgroundColor: '#1a3c6e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  botonSecundario: { width: '100%', padding: '12px', backgroundColor: 'white', color: '#1a3c6e', border: '1px solid #1a3c6e', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <SignedOut>
              <PaginaLogin />
            </SignedOut>
            <SignedIn>
              <Navigate to="/dashboard" />
            </SignedIn>
          </>
        } />
        <Route path="/dashboard" element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        } />
        <Route path="/transferencias" element={
          <SignedIn>
            <Transferencias />
          </SignedIn>
        } />
        <Route path="/movimientos" element={
          <SignedIn>
            <Movimientos />
          </SignedIn>
        } />
      </Routes>
    </BrowserRouter>
  )
}