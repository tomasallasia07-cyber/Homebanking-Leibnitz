import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { usePersona } from '../context/PersonaContext'
import '../accord.css'

function Dashboard() {
  const { persona, productos, cargando, esAdmin } = usePersona()

  if (cargando) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <span className="text-label text-muted">Cargando...</span>
    </div>
  )

  const saldoTotal = productos.reduce((acc, p) => acc + parseFloat(p.saldo || 0), 0)

  return (
    <div className="accord-page">
      <div className="bg-glow" />

      {/* Navbar */}
      <nav className="accord-nav">
        <div className="accord-nav__inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <span className="accord-nav__brand">Accord</span>
            <div className="accord-nav__links" style={{ display: 'flex', gap: 24 }}>
              <Link to="/dashboard" className="accord-nav__link accord-nav__link--active">Personal</Link>
              <Link to="/transferencias" className="accord-nav__link">Transferencias</Link>
              <Link to="/movimientos" className="accord-nav__link">Movimientos</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="text-sm text-muted">Hola, {persona?.nombre}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="accord-main" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header con saldo total */}
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          paddingBottom: 32,
          marginBottom: 32,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-headline text-surface" style={{ marginBottom: 4 }}>Portfolio Overview</h1>
              <p className="text-sm text-muted">Balance total de tus cuentas</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-label text-muted" style={{ marginBottom: 4 }}>Saldo total</p>
              <span className="text-display text-primary" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                ${saldoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </header>

        {/* Quick actions + cuentas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>

          {/* Quick actions */}
          <div className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p className="text-label text-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>bolt</span>
              Acciones rápidas
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Link to="/transferencias" className="btn btn--primary" style={{ flexDirection: 'column', padding: '16px 8px', gap: 6, borderRadius: 8 }}>
                <span className="material-symbols-outlined">swap_horiz</span>
                Transferir
              </Link>
              <Link to="/movimientos" className="btn btn--ghost" style={{ flexDirection: 'column', padding: '16px 8px', gap: 6, borderRadius: 8 }}>
                <span className="material-symbols-outlined">receipt_long</span>
                Movimientos
              </Link>
              {esAdmin && (
                <Link to="/admin" className="btn btn--ghost" style={{ gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>admin_panel_settings</span>
                  Panel Admin
                </Link>
              )}
            </div>
          </div>

          {/* Cuentas */}
          {productos.length === 0 ? (
            <div className="glass-panel" style={{ padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-sm text-muted">No tenés cuentas todavía.</p>
            </div>
          ) : (
            productos.map((producto) => (
              <div key={producto.id_producto} className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20, position: 'relative', overflow: 'hidden' }}>
                {/* Glow decorativo */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: 120, height: 120,
                  background: 'rgba(160,203,245,0.04)', borderRadius: '0 0 0 100%', filter: 'blur(24px)',
                }} />
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <p className="text-label text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance_wallet</span>
                      {producto.tipo_producto || 'Cuenta bancaria'}
                    </p>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
                      color: 'var(--primary)', background: 'rgba(160,203,245,0.1)',
                      padding: '3px 8px', borderRadius: 4, letterSpacing: '0.05em',
                    }}>Activa</span>
                  </div>
                  <p className="text-sm text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.05em', marginBottom: 4 }}>
                    CBU: {producto.cbu}
                  </p>
                  {producto.alias && (
                    <p className="text-sm text-muted" style={{ fontSize: 12 }}>Alias: {producto.alias}</p>
                  )}
                </div>
                <div>
                  <span className="text-headline text-surface">
                    ${parseFloat(producto.saldo).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                  <p className="text-sm text-muted" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>arrow_upward</span>
                    Saldo disponible
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="accord-footer">
        <div className="accord-footer__inner">
          <span className="accord-nav__brand" style={{ fontSize: 20 }}>Accord</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacidad', 'Términos', 'Seguridad'].map(l => (
              <a key={l} href="#" className="text-sm text-muted" style={{ textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--on-surface)'}
                onMouseLeave={e => e.target.style.color = ''}>
                {l}
              </a>
            ))}
          </div>
          <span className="text-sm text-muted">© 2025 Accord Financial. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard