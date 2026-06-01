import api from '../api/axiosConfig'
import { useState } from 'react'

function ChangeBankName() {

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchChangeBankName = async () => {
        try {
            setLoading(true);
            const { data } = await api.put(`/banks/me`, {name: `${name}`});
            console.log(data);
        } catch(error) {
            console.error('Ha habido un error al cambiar el nombre:', error);
        } finally {
            setLoading(false);
        }


    }

    return(
        <div>
            <input placeholder='Ingrese el nuevo nombre' onChange={(e) => setName(e.target.value)}></input>
            <button onClick={fetchChangeBankName}>Actualizar</button>
        </div>
    )
}

export default ChangeBankName