import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { usePersona } from '../context/PersonaContext'
import './Dashboard.css'

function Dashboard() {
  const { persona, productos, cargando } = usePersona()

  if (cargando) return <p>Cargando...</p>

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <h2 className="nav-titulo">🏦 Banco Accord</h2>
        <div className="nav-links">
          <Link to="/transferencias" className="nav-link">Transferencias</Link>
          <Link to="/movimientos" className="nav-link">Movimientos</Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="contenido">
        <h1 className="bienvenida">Bienvenido, {persona?.nombre} 👋</h1>

        <h2 className="seccion">Tus cuentas</h2>

        {productos.length === 0 && <p>No tenés cuentas todavía.</p>}

        {productos.map((producto) => (
          <div key={producto.id_producto} className="card">
            <div className="card-row">
              <span className="label">CBU</span>
              <span className="valor">{producto.cbu}</span>
            </div>
            <div className="card-row">
              <span className="label">Tipo</span>
              <span className="valor">{producto.tipo_producto}</span>
            </div>
            <div className="card-row">
              <span className="label">Saldo disponible</span>
              <span className="saldo">
                ${parseFloat(producto.saldo).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}

        <div className="acciones">
          <Link to="/transferencias" className="boton">💸 Transferir</Link>
          <Link to="/movimientos" className="boton-secundario">📋 Ver movimientos</Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard