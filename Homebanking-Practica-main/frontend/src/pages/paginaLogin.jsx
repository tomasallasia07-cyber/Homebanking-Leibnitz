import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import '../accord.css'

export default function PaginaLogin() {
  return (
    <div className="accord-page" style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <div className="bg-glow" />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 20px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="text-display text-surface" style={{ letterSpacing: '0.08em' }}>Accord</span>
          <p className="text-sm text-muted" style={{ marginTop: 8 }}>Banca inteligente, simple y transparente.</p>
        </div>

        {/* Card */}
        <div className="accord-card" style={{ padding: '40px 36px' }}>
          <h1 className="text-headline text-surface" style={{ marginBottom: 8 }}>Bienvenido</h1>
          <p className="text-sm text-muted" style={{ marginBottom: 36 }}>Ingresá a tu cuenta o creá una nueva.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SignInButton mode="modal">
              <button className="btn btn--primary btn--full">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>login</span>
                Iniciar sesión
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="btn btn--ghost btn--full">
                Crear cuenta
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
            </SignUpButton>
          </div>

          <div style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--on-surface-variant)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified_user</span>
            <span className="text-sm text-muted">Conexión encriptada de 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  )
}