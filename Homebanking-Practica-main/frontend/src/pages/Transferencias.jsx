import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosConfig from '../api/axiosConfig'
import './Transferencias.css'

const { db } = axiosConfig

function Transferencias() {
  const [destino, setDestino] = useState('')
  const [importe, setImporte] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleTransferencia = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    setCargando(true)

    try {
      await db.post('/transferencias', {
        destino,
        importe: parseFloat(importe)
      })

      setExito(`✅ Transferencia de $${importe} realizada con éxito`)
      setDestino('')
      setImporte('')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="transferencias-container">
      <div className="navbar">
        <h2 className="nav-titulo">🏦 Banco Accord</h2>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/movimientos" className="nav-link">Movimientos</Link>
        </div>
      </div>

      <div className="contenido">
        <h1 className="titulo">💸 Nueva transferencia</h1>

        {error && <p className="error">{error}</p>}
        {exito && <p className="exito">{exito}</p>}

        <div className="card">
          <form onSubmit={handleTransferencia}>
            <div className="campo">
              <label>CBU o alias del destinatario</label>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="input"
                placeholder="CBU (22 dígitos) o alias"
                required
              />
            </div>
            <div className="campo">
              <label>Importe ($)</label>
              <input
                type="number"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                className="input"
                placeholder="Ej: 1500"
                min="1"
                required
              />
            </div>
            <button type="submit" className="boton" disabled={cargando}>
              {cargando ? 'Procesando...' : 'Transferir'}
            </button>
          </form>
        </div>

        <button onClick={() => navigate('/dashboard')} className="boton-volver">
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  )
}

export default Transferencias