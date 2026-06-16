import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import './PaginaLogin.css'

export default function PaginaLogin() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-titulo">🏦 Banco Accord</h1>
        <h2 className="login-subtitulo">Bienvenido</h2>
        <div className="login-botones">
          <SignInButton mode="modal">
            <button className="boton-primario">Iniciar Sesión</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="boton-secundario">Registrarse</button>
          </SignUpButton>
        </div>
      </div>
    </div>
  )
}