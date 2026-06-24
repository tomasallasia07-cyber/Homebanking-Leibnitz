import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import axiosConfig from '../api/axiosConfig'

const { db } = axiosConfig

// ── Sección: Usuarios ──────────────────────────────────────
function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null) // id persona en edicion
  const [form, setForm] = useState({})
  const [montoSaldo, setMontoSaldo] = useState({}) // { [id]: monto }
  const [mensaje, setMensaje] = useState('')

  useEffect(() => { fetchUsuarios() }, [])

  const fetchUsuarios = async () => {
    try {
      const { data } = await db.get('/admin/usuarios')
      setUsuarios(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener usuarios')
    } finally {
      setCargando(false)
    }
  }

  const iniciarEdicion = (u) => {
    setEditando(u.id)
    setForm({
      nombre: u.nombre, apellido: u.apellido, dni: u.dni,
      email: u.email, telefono: u.telefono, direccion: u.direccion,
      alias: u.alias || '', id_estado_producto: u.id_estado_producto
    })
  }

  const guardarPersona = async (id) => {
    try {
      await db.put(`/admin/usuarios/${id}/persona`, {
        nombre: form.nombre, apellido: form.apellido, dni: form.dni,
        email: form.email, telefono: form.telefono, direccion: form.direccion
      })
      setMensaje('Datos actualizados')
      setEditando(null)
      fetchUsuarios()
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al actualizar')
    }
  }

  const guardarAlias = async (id) => {
    try {
      await db.put(`/admin/usuarios/${id}/alias`, { alias: form.alias })
      setMensaje('Alias actualizado')
      fetchUsuarios()
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al actualizar alias')
    }
  }

  const guardarEstado = async (id, idProducto) => {
    try {
      await db.put(`/admin/usuarios/${idProducto}/producto`, {
        id_estado_producto: parseInt(form.id_estado_producto)
      })
      setMensaje('Estado actualizado')
      fetchUsuarios()
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al actualizar estado')
    }
  }

  const agregarSaldo = async (id) => {
    const monto = parseFloat(montoSaldo[id])
    if (!monto || monto <= 0) return
    try {
      await db.put(`/admin/usuarios/${id}/saldo`, { monto })
      setMensaje(`$${monto} acreditados correctamente`)
      setMontoSaldo(prev => ({ ...prev, [id]: '' }))
      fetchUsuarios()
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al acreditar saldo')
    }
  }

  if (cargando) return <p style={s.muted}>Cargando usuarios...</p>
  if (error) return <p style={s.danger}>{error}</p>

  return (
    <div>
      {mensaje && (
        <div style={s.alert} onClick={() => setMensaje('')}>
          {mensaje} <span style={{ cursor: 'pointer', marginLeft: 8 }}>✕</span>
        </div>
      )}

      {usuarios.map(u => (
        <div key={u.id} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={s.label}>ID #{u.id} · {u.nombre_rol || 'Sin rol'}</p>
              {editando === u.id ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                  {['nombre', 'apellido', 'dni', 'email', 'telefono', 'direccion'].map(campo => (
                    <div key={campo} style={s.field}>
                      <label style={s.label}>{campo}</label>
                      <input style={s.input} value={form[campo]} onChange={e => setForm({ ...form, [campo]: e.target.value })} />
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
                    <button style={s.btnPrimary} onClick={() => guardarPersona(u.id)}>Guardar</button>
                    <button style={s.btnGhost} onClick={() => setEditando(null)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={s.nombre}>{u.nombre} {u.apellido}</p>
                  <p style={s.muted}>DNI: {u.dni} · {u.email} · {u.telefono}</p>
                  <p style={s.muted}>{u.direccion}</p>
                </div>
              )}
            </div>

            {editando !== u.id && (
              <button style={s.btnGhost} onClick={() => iniciarEdicion(u)}>Editar datos</button>
            )}
          </div>

          {/* Cuenta */}
          {u.cbu && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={s.label}>Cuenta bancaria</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 8, alignItems: 'flex-end' }}>

                {/* Saldo */}
                <div>
                  <p style={s.muted}>Saldo actual</p>
                  <p style={{ ...s.mono, color: 'var(--primary)' }}>
                    ${parseFloat(u.saldo).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* CBU */}
                <div>
                  <p style={s.muted}>CBU</p>
                  <p style={s.mono}>{u.cbu}</p>
                </div>

                {/* Estado producto */}
                <div style={s.field}>
                  <p style={s.muted}>Estado producto</p>
                  <select
                    style={s.input}
                    value={editando === u.id ? form.id_estado_producto : u.id_estado_producto}
                    onChange={e => setForm({ ...form, id_estado_producto: e.target.value })}
                    onBlur={() => guardarEstado(u.id, u.id_producto)}
                  >
                    <option value={1}>Activo</option>
                    <option value={2}>Inactivo</option>
                    <option value={3}>Bloqueado</option>
                  </select>
                </div>

                {/* Alias */}
                <div style={s.field}>
                  <p style={s.muted}>Alias</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      style={{ ...s.input, width: 200 }}
                      value={editando === u.id ? form.alias : (u.alias || '')}
                      placeholder="sin alias"
                      onChange={e => setForm({ ...form, alias: e.target.value })}
                    />
                    <button style={s.btnGhost} onClick={() => guardarAlias(u.id)}>Guardar</button>
                  </div>
                </div>

                {/* Agregar saldo */}
                <div style={s.field}>
                  <p style={s.muted}>Acreditar saldo</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      style={{ ...s.input, width: 120 }}
                      type="number"
                      min="1"
                      placeholder="$0"
                      value={montoSaldo[u.id] || ''}
                      onChange={e => setMontoSaldo(prev => ({ ...prev, [u.id]: e.target.value }))}
                    />
                    <button style={s.btnPrimary} onClick={() => agregarSaldo(u.id)}>Acreditar</button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Sección: Banco ─────────────────────────────────────────
function Banco() {
  const [bancos, setBancos] = useState([])
  const [nombre, setNombre] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const fetchBancos = async () => {
    setCargando(true)
    try {
      const { data } = await db.get('/admin/bancos')
      setBancos(data)
    } catch (err) {
      setMensaje('Error al obtener bancos')
    } finally {
      setCargando(false)
    }
  }

  const cambiarNombre = async () => {
    if (!nombre.trim()) return
    try {
      await db.put('/admin/banco/nombre', { nombre })
      setMensaje(`Nombre actualizado a "${nombre}"`)
      setNombre('')
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al cambiar nombre')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {mensaje && (
        <div style={s.alert} onClick={() => setMensaje('')}>
          {mensaje} <span style={{ cursor: 'pointer', marginLeft: 8 }}>✕</span>
        </div>
      )}

      {/* Cambiar nombre */}
      <div style={s.card}>
        <p style={s.sectionTitle}>Cambiar nombre del banco</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <input
            style={{ ...s.input, flex: 1, minWidth: 200 }}
            placeholder="Nuevo nombre del banco"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <button style={s.btnPrimary} onClick={cambiarNombre}>Actualizar</button>
        </div>
      </div>

      {/* Lista de bancos */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={s.sectionTitle}>Bancos registrados</p>
          <button style={s.btnGhost} onClick={fetchBancos} disabled={cargando}>
            {cargando ? 'Cargando...' : 'Obtener bancos'}
          </button>
        </div>
        {bancos.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bancos.map(b => (
              <div key={b.bankCode} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={s.mono}>#{b.bankCode}</span>
                <span style={{ color: 'var(--on-surface)' }}>{b.name}</span>
              </div>
            ))}
          </div>
        )}
        {bancos.length === 0 && !cargando && (
          <p style={{ ...s.muted, marginTop: 12 }}>Hacé click en "Obtener bancos" para cargar la lista.</p>
        )}
      </div>
    </div>
  )
}

// ── AdminDashboard principal ───────────────────────────────
const TABS = ['Usuarios', 'Banco']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Usuarios')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--on-surface)' }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(11,21,27,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 72, maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '0.08em' }}>Accord</span>
            <span style={{ ...s.label, color: 'var(--secondary-container)', background: 'rgba(225,2,17,0.15)', padding: '4px 10px', borderRadius: 4 }}>Admin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" style={{ ...s.label, color: 'var(--on-surface-variant)', textDecoration: 'none' }}>← Volver</Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ ...s.label, color: 'var(--primary)', marginBottom: 6 }}>Panel de administración</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700 }}>Control del banco</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 0 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '12px 20px',
                color: tab === t ? 'var(--primary)' : 'var(--on-surface-variant)',
                borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {tab === 'Usuarios' && <Usuarios />}
        {tab === 'Banco'    && <Banco />}

      </main>
    </div>
  )
}

// ── Estilos base (sin clases, solo objetos) ────────────────
const s = {
  card: {
    background: 'var(--surface-container)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, padding: 24, marginBottom: 16,
  },
  label: {
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--on-surface-variant)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
    color: 'var(--on-surface)',
  },
  nombre: {
    fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
    color: 'var(--on-surface)', marginBottom: 4,
  },
  mono: {
    fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
    color: 'var(--on-surface)',
  },
  muted: {
    fontFamily: 'var(--font-body)', fontSize: 13,
    color: 'var(--on-surface-variant)',
  },
  danger: {
    fontFamily: 'var(--font-body)', fontSize: 13,
    color: 'var(--error)',
  },
  input: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--outline-variant)',
    borderRadius: 0,
    color: 'var(--on-surface)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    padding: '8px 0',
    outline: 'none',
    width: '100%',
  },
  field: {
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  btnPrimary: {
    background: 'var(--secondary-container)',
    color: '#fff', border: 'none', borderRadius: 4,
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '10px 18px', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnGhost: {
    background: 'transparent',
    color: 'var(--on-surface)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4,
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '10px 18px', cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  alert: {
    padding: '12px 16px', borderRadius: 8, marginBottom: 20,
    background: 'rgba(160,203,245,0.1)', color: 'var(--primary)',
    border: '1px solid rgba(160,203,245,0.2)',
    fontFamily: 'var(--font-body)', fontSize: 14,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'default',
  },
}
