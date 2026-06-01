import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import Transferencias from './pages/Transferencias'
import Movimientos from './pages/Movimientos'

const RutaPrivada = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<RutaPrivada><Dashboard /></RutaPrivada>} />
        <Route path="/transferencias" element={<RutaPrivada><Transferencias /></RutaPrivada>} />
        <Route path="/movimientos" element={<RutaPrivada><Movimientos /></RutaPrivada>} />
      </Routes>
    </BrowserRouter>
  )
}
