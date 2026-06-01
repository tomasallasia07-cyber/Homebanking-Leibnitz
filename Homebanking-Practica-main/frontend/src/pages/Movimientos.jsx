import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Movimientos() {
  const [movimientos, setMovimientos] = useState([])
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const res = await fetch('/api/cuentas/movimientos', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Error al obtener movimientos')
          return
        }
        setMovimientos(data)
      } catch (err) {
        setError('No se pudo conectar con el servidor')
      }
    }
    fetchMovimientos()
  }, [])

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const colorTipo = (tipo) => {
    if (tipo === 'transferencia_entrada') return '#1a7a1a'
    if (tipo === 'transferencia_salida') return '#c00'
    return '#333'
  }

  const iconoTipo = (tipo) => {
    if (tipo === 'transferencia_entrada') return '⬇️'
    if (tipo === 'transferencia_salida') return '⬆️'
    return '💰'
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitulo}>🏦 Banco Leibnitz</h2>
        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/transferencias" style={styles.navLink}>Transferencias</Link>
        </div>
      </div>

      <div style={styles.contenido}>
        <h1 style={styles.titulo}>📋 Mis Movimientos</h1>

        {error && <p style={styles.error}>{error}</p>}

        {movimientos.length === 0 && !error && (
          <p style={styles.vacio}>No tenés movimientos registrados todavía.</p>
        )}

        {movimientos.map((mov) => (
          <div key={mov.id_movimiento} style={styles.card}>
            <div style={styles.cardLeft}>
              <span style={styles.icono}>{iconoTipo(mov.tipo)}</span>
              <div>
                <p style={styles.descripcion}>{mov.descripcion}</p>
                <p style={styles.fecha}>{formatFecha(mov.fecha)}</p>
              </div>
            </div>
            <div style={{ color: colorTipo(mov.tipo), fontWeight: 'bold', fontSize: '18px' }}>
              {mov.tipo === 'transferencia_salida' ? '-' : '+'}
              ${parseFloat(mov.importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}

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
  contenido: { maxWidth: '600px', margin: '40px auto', padding: '0 16px' },
  titulo: { color: '#1a3c6e', marginBottom: '24px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  icono: { fontSize: '28px' },
  descripcion: { margin: 0, color: '#333', fontWeight: '500' },
  fecha: { margin: '4px 0 0', color: '#888', fontSize: '13px' },
  botonVolver: { backgroundColor: 'transparent', border: 'none', color: '#1a3c6e', cursor: 'pointer', fontSize: '15px', padding: '0', marginTop: '16px' },
  error: { backgroundColor: '#ffe0e0', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '16px' },
  vacio: { color: '#888', textAlign: 'center', marginTop: '40px' }
}

export default Movimientos