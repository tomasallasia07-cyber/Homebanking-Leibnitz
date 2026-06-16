import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosConfig from '../api/axiosConfig'
import './Movimientos.css'

const { db } = axiosConfig

function Movimientos() {
  const [movimientos, setMovimientos] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()
  const [sincronizando, setSincronizando] = useState(false)
  const handleSincronizar = async () => {
    setSincronizando(true)
    try {
      await db.post('/transferencias/sincronizar')
      const { data } = await db.get('/movimientos') // recargar la lista
      setMovimientos(data)
    } catch (err) {
      console.error('Error al sincronizar:', err)
    } finally {
      setSincronizando(false)
    }
  }

  useEffect(() => {
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
    fetchMovimientos()
  }, [])

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const colorTipo = (tipo) => {
    if (tipo === 'transferencia_entrada') return 'monto-positivo'
    if (tipo === 'transferencia_salida') return 'monto-negativo'
    return 'monto-neutro'
  }

  const iconoTipo = (tipo) => {
    if (tipo === 'transferencia_entrada') return '⬇️'
    if (tipo === 'transferencia_salida') return '⬆️'
    return '💰'
  }

  return (
    <div className="movimientos-container">
      <div className="navbar">
        <h2 className="nav-titulo">🏦 Banco Accord</h2>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/transferencias" className="nav-link">Transferencias</Link>
        </div>
      </div>

      <div className="contenido">
        <h1 className="titulo">📋 Mis movimientos</h1>

        {error && <p className="error">{error}</p>}
        {cargando && !error && <p>Cargando...</p>}

        {!cargando && movimientos.length === 0 && !error && (
          <p className="vacio">No tenés movimientos registrados todavía.</p>
        )}

        {movimientos.map((mov) => (
          <div key={mov.id_movimiento} className="card">
            <div className="card-left">
              <span className="icono">{iconoTipo(mov.tipo)}</span>
              <div>
                <p className="descripcion">{mov.descripcion}</p>
                <p className="fecha">{formatFecha(mov.fecha)}</p>
              </div>
            </div>
            <div className={colorTipo(mov.tipo)}>
              {mov.tipo === 'transferencia_salida' ? '-' : '+'}
              ${parseFloat(mov.importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
        <button onClick={handleSincronizar} className="boton-volver" disabled={sincronizando}>
          {sincronizando ? 'Buscando transferencias...' : '🔄 Buscar transferencias nuevas'}
        </button>
        <button onClick={() => navigate('/dashboard')} className="boton-volver">
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  )
}

export default Movimientos