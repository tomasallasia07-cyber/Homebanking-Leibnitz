import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePersona } from '../../context/PersonaContext'
import axiosConfig from '../../api/axiosConfig'
const { db } = axiosConfig;

function RegisterPersonCentralBank() {
    const navigate = useNavigate()
    const { refrescar } = usePersona()

    const [persona, setPersona] = useState({
        nombre: '', apellido: '', dni: '', direccion: '', email: '', telefono: '', fecha_nac: ''
    })

    const handleChange = (e) => {
        setPersona({ ...persona, [e.target.name]: e.target.value })
    }

    const postPersona = async () => {
        try {
            const { data } = await db.post('/personas', persona);
            console.log('Persona registrada:', data);
            await refrescar() 
            navigate('/dashboard')
        } catch (error) {
            console.error('Error al registrar la persona:', error);
        }
    };

    return(
        <div>
            <input placeholder="Nombre" name="nombre" value={persona.nombre} onChange={handleChange} />
            <input placeholder="Apellido" name="apellido" value={persona.apellido} onChange={handleChange} />
            <input placeholder="DNI" name="dni" value={persona.dni} onChange={handleChange} />
            <input placeholder="Direccion" name="direccion" value={persona.direccion} onChange={handleChange} />
            <input placeholder="Email" name="email" value={persona.email} onChange={handleChange} />
            <input placeholder="Telefono" name="telefono" value={persona.telefono} onChange={handleChange} />
            <input placeholder="fechaNacimiento" name="fecha_nac" value={persona.fecha_nac} onChange={handleChange} type="date" />
            <button onClick={postPersona}>Registrar Persona</button>
        </div>
    )
}

export default RegisterPersonCentralBank