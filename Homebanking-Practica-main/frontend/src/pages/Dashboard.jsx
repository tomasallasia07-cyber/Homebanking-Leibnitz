import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'

function Dashboard() {
  const [cuentas, setCuentas] = useState([])
  const [error, setError] = useState('')
  const { user } = useUser()

  useEffect(() => {
    const iniciarSesion = async () => {
      try {
        // Registrar o loguear con Clerk
        await fetch('/api/auth/clerk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            nombre: user.firstName,
            apellido: user.lastName
          })
        })

        // Obtener saldo
        const res = await fetch('/api/cuentas/saldo', {
          headers: { Authorization: `Bearer ${user.id}` }
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
    if (user) iniciarSesion()
  }, [user])

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitulo}>🏦 Banco Leibnitz</h2>
        <div style={styles.navLinks}>
          <Link to="/transferencias" style={styles.navLink}>Transferencias</Link>
          <Link to="/movimientos" style={styles.navLink}>Movimientos</Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div style={styles.contenido}>
        <h1 style={styles.bienvenida}>Bienvenido, {user?.firstName} 👋</h1>

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