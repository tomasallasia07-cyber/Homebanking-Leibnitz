import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Registro() {
  const [form, setForm] = useState({ nombre: '', apellido: '', dni: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegistro = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al registrarse')
        return
      }

      setExito('¡Cuenta creada con éxito! Redirigiendo...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>🏦 Banco Leibnitz</h1>
        <h2 style={styles.subtitulo}>Crear Cuenta</h2>

        {error && <p style={styles.error}>{error}</p>}
        {exito && <p style={styles.exito}>{exito}</p>}

        <form onSubmit={handleRegistro}>
          <div style={styles.campo}>
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.campo}>
            <label>Apellido</label>
            <input name="apellido" value={form.apellido} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.campo}>
            <label>DNI</label>
            <input name="dni" value={form.dni} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.campo}>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.campo}>
            <label>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} required />
          </div>
          <button type="submit" style={styles.boton}>Registrarse</button>
        </form>

        <p style={styles.link}>
          ¿Ya tenés cuenta? <Link to="/">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '360px' },
  titulo: { textAlign: 'center', color: '#1a3c6e', marginBottom: '4px' },
  subtitulo: { textAlign: 'center', color: '#555', marginBottom: '24px', fontWeight: 'normal' },
  campo: { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px' },
  boton: { width: '100%', padding: '12px', backgroundColor: '#1a3c6e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '8px' },
  error: { backgroundColor: '#ffe0e0', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '16px' },
  exito: { backgroundColor: '#e0ffe0', color: '#080', padding: '10px', borderRadius: '8px', marginBottom: '16px' },
  link: { textAlign: 'center', marginTop: '16px', color: '#555' }
}

export default Registro