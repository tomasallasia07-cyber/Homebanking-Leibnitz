import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Transferencias() {
  const [cbuDestino, setCbuDestino] = useState('')
  const [importe, setImporte] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(false)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleTransferencia = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    setCargando(true)

    try {
      const res = await fetch('/api/transferencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cbu_destino: cbuDestino,
          importe: parseFloat(importe)
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al realizar la transferencia')
        setCargando(false)
        return
      }

      setExito(`✅ Transferencia de $${importe} realizada con éxito`)
      setCbuDestino('')
      setImporte('')
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    }

    setCargando(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitulo}>🏦 Banco Leibnitz</h2>
        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/movimientos" style={styles.navLink}>Movimientos</Link>
        </div>
      </div>

      <div style={styles.contenido}>
        <h1 style={styles.titulo}>💸 Nueva Transferencia</h1>

        {error && <p style={styles.error}>{error}</p>}
        {exito && <p style={styles.exito}>{exito}</p>}

        <div style={styles.card}>
          <form onSubmit={handleTransferencia}>
            <div style={styles.campo}>
              <label>CBU Destino</label>
              <input
                type="text"
                value={cbuDestino}
                onChange={(e) => setCbuDestino(e.target.value)}
                style={styles.input}
                placeholder="Ingresá el CBU del destinatario"
                required
              />
            </div>
            <div style={styles.campo}>
              <label>Importe ($)</label>
              <input
                type="number"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                style={styles.input}
                placeholder="Ej: 1500"
                min="1"
                required
              />
            </div>
            <button type="submit" style={styles.boton} disabled={cargando}>
              {cargando ? 'Procesando...' : 'Transferir'}
            </button>
          </form>
        </div>

        <button onClick={() => navigate('/dashboard')} style={styles.botonVolver}>
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: { backgroundColor: '#1a3c6e', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitulo: { color: 'white', margin: 0 },
  navLinks: { display: 'flex', gap: '16px', alignItems: 'center' },
  navLink: { color: 'white', textDecoration: 'none', fontSize: '15px' },
  contenido: { maxWidth: '500px', margin: '40px auto', padding: '0 16px' },
  titulo: { color: '#1a3c6e', marginBottom: '24px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' },
  campo: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px' },
  boton: { width: '100%', padding: '12px', backgroundColor: '#1a3c6e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  botonVolver: { backgroundColor: 'transparent', border: 'none', color: '#1a3c6e', cursor: 'pointer', fontSize: '15px', padding: '0' },
  error: { backgroundColor: '#ffe0e0', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '16px' },
  exito: { backgroundColor: '#e0ffe0', color: '#080', padding: '10px', borderRadius: '8px', marginBottom: '16px' }
}

export default Transferencias