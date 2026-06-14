import api from '../../api/axiosConfig'
import { useState } from "react"

function RegisterPersonCentralBank() {

    const [persona, setPersona] = useState({
        nombre: '',
        apellido: '',
        dni: ''
    })

    const handleChange = (e) => {
        setPersona({
            ...persona,
            [e.target.name]: e.target.value
        })
    }

    const postPersona = async () => {
        try {
            const { data } = await api.post('/persons', persona);
            console.log('Persona registrada:', data);
        } catch (error) {
            console.error('Error al registrar la persona:', error);
        }
    };

    return(
        <div>
            <input placeholder="Nombre" name="nombre" value={persona.nombre} onChange={handleChange} />
            <input placeholder="Apellido" name="apellido" value={persona.apellido} onChange={handleChange} />
            <input placeholder="DNI" name="dni" value={persona.dni} onChange={handleChange} />
            <button onClick={postPersona}>Registrar Persona</button>
        </div>
    )

}

export default RegisterPersonCentralBank