import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Dashboard() {
  const [cuentas, setCuentas] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const res = await fetch('/api/cuentas/saldo', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Error al obtener saldo')
          return
        }
        setCuentas(data)
      } catch (err) {
        setError('No se pudo conectar con el servidor')
      }
    }
    fetchSaldo()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitulo}>🏦 Banco Leibnitz</h2>
        <div style={styles.navLinks}>
          <Link to="/transferencias" style={styles.navLink}>Transferencias</Link>
          <Link to="/movimientos" style={styles.navLink}>Movimientos</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Cerrar sesión</button>
        </div>
      </div>

      <div style={styles.contenido}>
        <h1 style={styles.bienvenida}>Bienvenido, {usuario.nombre} 👋</h1>

        {error && <p style={styles.error}>{error}</p>}

        <h2 style={styles.seccion}>Tus cuentas</h2>

        {cuentas.length === 0 && !error && <p>Cargando...</p>}

        {cuentas.map((cuenta) => (
          <div key={cuenta.id_cuenta} style={styles.card}>
            <div style={styles.cardRow}>
              <span style={styles.label}>CBU</span>
              <span style={styles.valor}>{cuenta.cbu}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.label}>Tipo</span>
              <span style={styles.valor}>{cuenta.tipo_producto}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.label}>Saldo disponible</span>
              <span style={styles.saldo}>${parseFloat(cuenta.saldo).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        ))}

        <div style={styles.acciones}>
          <Link to="/transferencias" style={styles.boton}>💸 Transferir</Link>
          <Link to="/movimientos" style={styles.botonSecundario}>📋 Ver movimientos</Link>
        </div>
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
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' },
  contenido: { maxWidth: '600px', margin: '40px auto', padding: '0 16px' },
  bienvenida: { color: '#1a3c6e', marginBottom: '24px' },
  seccion: { color: '#333', marginBottom: '16px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '16px' },
  cardRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  label: { color: '#888', fontSize: '14px' },
  valor: { color: '#333', fontSize: '14px', fontFamily: 'monospace' },
  saldo: { color: '#1a3c6e', fontSize: '24px', fontWeight: 'bold' },
  acciones: { display: 'flex', gap: '12px', marginTop: '24px' },
  boton: { flex: 1, padding: '14px', backgroundColor: '#1a3c6e', color: 'white', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '15px' },
  botonSecundario: { flex: 1, padding: '14px', backgroundColor: 'white', color: '#1a3c6e', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '15px', border: '1px solid #1a3c6e' },
  error: { backgroundColor: '#ffe0e0', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '16px' }
}

export default Dashboard