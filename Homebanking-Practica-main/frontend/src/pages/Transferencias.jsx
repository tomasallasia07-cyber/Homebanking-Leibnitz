import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { usePersona } from '../context/PersonaContext'
import axiosConfig from '../api/axiosConfig'
import '../accord.css'

const { db } = axiosConfig

function Transferencias() {
  const { productos } = usePersona()
  const [destino, setDestino] = useState('')
  const [importe, setImporte] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(false)

  const saldo = productos?.[0] ? parseFloat(productos[0].saldo) : 0

  const handleTransferencia = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    setCargando(true)
    try {
      await db.post('/transferencias', { destino, importe: parseFloat(importe) })
      setExito(`Transferencia de $${parseFloat(importe).toLocaleString('es-AR', { minimumFractionDigits: 2 })} realizada con éxito.`)
      setDestino('')
      setImporte('')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
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
              <Link to="/transferencias" className="accord-nav__link accord-nav__link--active">Transferencias</Link>
              <Link to="/movimientos" className="accord-nav__link">Movimientos</Link>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="accord-main" style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>

        <div style={{ marginBottom: 36 }}>
          <p className="text-label text-primary" style={{ marginBottom: 6 }}>Nueva operación</p>
          <h1 className="text-headline text-surface">Transferir fondos</h1>
        </div>

        {/* Saldo disponible */}
        {productos?.length > 0 && (
          <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p className="text-label text-muted" style={{ marginBottom: 4 }}>Saldo disponible</p>
              <span className="text-mono text-surface">
                ${saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="material-symbols-outlined text-muted">account_balance_wallet</span>
          </div>
        )}

        {error  && <div className="alert alert--error">{error}</div>}
        {exito  && <div className="alert alert--success">{exito}</div>}

        <div className="accord-card" style={{ padding: '36px' }}>
          <form onSubmit={handleTransferencia}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 36 }}>

              <div className="field">
                <label className="field__label">CBU o alias del destinatario</label>
                <input
                  className="ghost-input"
                  type="text"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  placeholder="22 dígitos o alias"
                  required
                />
                <span className="text-sm text-muted" style={{ marginTop: 4 }}>
                  Podés usar el CBU (22 dígitos) o el alias de cualquier banco del sistema.
                </span>
              </div>

              <div className="field">
                <label className="field__label">Importe</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--on-surface-variant)',
                  }}>$</span>
                  <input
                    className="ghost-input"
                    type="number"
                    value={importe}
                    onChange={(e) => setImporte(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    style={{ paddingLeft: 16 }}
                    required
                  />
                </div>
                {importe && saldo > 0 && parseFloat(importe) > saldo && (
                  <span className="text-sm text-danger" style={{ marginTop: 4 }}>Saldo insuficiente</span>
                )}
              </div>

            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={cargando}>
              {cargando ? 'Procesando...' : (
                <>
                  Confirmar transferencia
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Nota de seguridad */}
        <div style={{
          marginTop: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: 'var(--on-surface-variant)', opacity: 0.6,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified_user</span>
          <span className="text-sm text-muted">Operación procesada vía Banco Central</span>
        </div>

      </main>
    </div>
  )
}

export default Transferencias