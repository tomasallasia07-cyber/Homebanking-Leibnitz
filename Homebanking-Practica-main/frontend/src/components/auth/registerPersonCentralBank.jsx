import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePersona } from '../../context/PersonaContext'
import axiosConfig from '../../api/axiosConfig'

const { db } = axiosConfig

function RegisterPersonCentralBank() {
  const navigate = useNavigate()
  const { refrescar } = usePersona()
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const [persona, setPersona] = useState({
    nombre: '', apellido: '', dni: '', direccion: '', email: '', telefono: '', fecha_nac: ''
  })

  const handleChange = (e) => {
    setPersona({ ...persona, [e.target.name]: e.target.value })
  }

  const postPersona = async () => {
    setError('')
    setCargando(true)
    try {
      await db.post('/personas', persona)
      await refrescar()
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar. Intentá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Glow ambiental */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(160,203,245,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Navbar mínima */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        width: '100%',
        background: 'rgba(11, 21, 27, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 72,
          maxWidth: 1280, margin: '0 auto',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
            letterSpacing: '0.08em', color: 'var(--on-surface)',
          }}>Accord</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--on-surface-variant)',
          }}>Paso 1 de 1 — Datos personales</span>
        </div>
      </header>

      {/* Contenido */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 20px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--primary)', marginBottom: 8,
            }}>Onboarding</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12,
            }}>Completá tu perfil</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--on-surface-variant)' }}>
              Necesitamos algunos datos para crear tu cuenta bancaria.
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'var(--surface-container)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '36px',
          }}>
            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: 8, marginBottom: 24,
                background: 'rgba(147,0,10,0.25)', color: 'var(--error)',
                border: '1px solid rgba(255,180,171,0.2)',
                fontFamily: 'var(--font-body)', fontSize: 14,
              }}>{error}</div>
            )}

            {/* Nombre + Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
              <Field label="Nombre">
                <input style={inputStyle} name="nombre" value={persona.nombre} onChange={handleChange} placeholder="Juan" />
              </Field>
              <Field label="Apellido">
                <input style={inputStyle} name="apellido" value={persona.apellido} onChange={handleChange} placeholder="Pérez" />
              </Field>
            </div>

            {/* Resto de campos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 36 }}>
              <Field label="DNI">
                <input style={inputStyle} name="dni" value={persona.dni} onChange={handleChange} placeholder="Documento de identidad" />
              </Field>
              <Field label="Email">
                <input style={inputStyle} type="email" name="email" value={persona.email} onChange={handleChange} placeholder="tu@mail.com" />
              </Field>
              <Field label="Teléfono">
                <input style={inputStyle} name="telefono" value={persona.telefono} onChange={handleChange} placeholder="+54 11 0000 0000" />
              </Field>
              <Field label="Dirección">
                <input style={inputStyle} name="direccion" value={persona.direccion} onChange={handleChange} placeholder="Calle, número, ciudad" />
              </Field>
              <Field label="Fecha de nacimiento">
                <input style={{ ...inputStyle, colorScheme: 'dark' }} type="date" name="fecha_nac" value={persona.fecha_nac} onChange={handleChange} />
              </Field>
            </div>

            {/* Botón */}
            <button
              onClick={postPersona}
              disabled={cargando}
              style={{
                width: '100%', padding: '14px 24px',
                background: cargando ? 'rgba(225,2,17,0.5)' : 'var(--secondary-container)',
                color: '#fff', border: 'none', borderRadius: 4,
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: '0 0 20px rgba(225,2,17,0.2)',
              }}
            >
              {cargando ? 'Procesando...' : 'Continuar →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper para el label + input
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--on-surface-variant)',
      }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--outline-variant)',
  borderRadius: 0,
  color: 'var(--on-surface)',
  fontFamily: 'var(--font-body)',
  fontSize: 16,
  padding: '12px 0',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default RegisterPersonCentralBank