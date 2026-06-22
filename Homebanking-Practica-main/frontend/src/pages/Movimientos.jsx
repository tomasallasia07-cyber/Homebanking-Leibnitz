import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import axiosConfig from '../api/axiosConfig'
import '../accord.css'

const { db } = axiosConfig

function Movimientos() {
  const [movimientos, setMovimientos] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [sincronizando, setSincronizando] = useState(false)

  useEffect(() => {
    fetchMovimientos()
  }, [])

  const fetchMovimientos = async () => {
    try {
      const { data } = await db.get('/movimientos')
      setMovimientos(data)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  const handleSincronizar = async () => {
    setSincronizando(true)
    try {
      await db.post('/transferencias/sincronizar')
      await fetchMovimientos()
    } catch (err) {
      console.error('Error al sincronizar:', err)
    } finally {
      setSincronizando(false)
    }
  }

  const formatFecha = (fecha) => new Date(fecha).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  const tipoConfig = (tipo) => {
    if (tipo === 'transferencia_entrada') return { icon: 'arrow_downward', color: '#4caf82', prefix: '+', bg: 'rgba(76,175,130,0.1)' }
    if (tipo === 'transferencia_salida')  return { icon: 'arrow_upward',   color: 'var(--error)', prefix: '-', bg: 'rgba(255,180,171,0.1)' }
    return { icon: 'payments', color: 'var(--primary)', prefix: '', bg: 'rgba(160,203,245,0.1)' }
  }

  return (
    <div className="accord-page">
      <div className="bg-glow" />

      <nav className="accord-nav">
        <div className="accord-nav__inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <span className="accord-nav__brand">Accord</span>
            <div className="accord-nav__links" style={{ display: 'flex', gap: 24 }}>
              <Link to="/dashboard" className="accord-nav__link">Personal</Link>
              <Link to="/transferencias" className="accord-nav__link">Transferencias</Link>
              <Link to="/movimientos" className="accord-nav__link accord-nav__link--active">Movimientos</Link>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="accord-main" style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="text-label text-primary" style={{ marginBottom: 6 }}>Historial</p>
            <h1 className="text-headline text-surface">Movimientos</h1>
          </div>
          <button className="btn btn--ghost" onClick={handleSincronizar} disabled={sincronizando} style={{ gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sync</span>
            {sincronizando ? 'Buscando...' : 'Actualizar'}
          </button>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        {cargando && !error && (
          <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '48px 0' }}>Cargando movimientos...</p>
        )}

        {!cargando && movimientos.length === 0 && !error && (
          <div className="glass-panel" style={{ padding: 48, textAlign: 'center' }}>
            <span className="material-symbols-outlined text-muted" style={{ fontSize: 40, marginBottom: 12, display: 'block' }}>receipt_long</span>
            <p className="text-sm text-muted">No tenés movimientos registrados todavía.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {movimientos.map((mov) => {
            const cfg = tipoConfig(mov.tipo)
            return (
              <div key={mov.id_movimiento} className="glass-panel" style={{
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'border-color 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(160,203,245,0.15)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: cfg.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: cfg.color }}>{cfg.icon}</span>
                  </div>
                  <div>
                    <p className="text-body text-surface" style={{ fontWeight: 500, fontSize: 14 }}>{mov.descripcion}</p>
                    <p className="text-sm text-muted" style={{ fontSize: 12, marginTop: 2 }}>{formatFecha(mov.fecha)}</p>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: cfg.color, flexShrink: 0 }}>
                  {cfg.prefix}${parseFloat(mov.importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )
          })}
        </div>

      </main>
    </div>
  )
}

export default Movimientos