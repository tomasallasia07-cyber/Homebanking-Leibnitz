import api from '../api/axiosConfig'
import { useState } from 'react'

function SearchPersonByCBU() {

    const [loading, setLoading] = useState(false);
    const [CBU, setCBU] = useState('');
    const [person, setPerson] = useState('');

    const getCBU = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/persons/${CBU}`);
            console.log(data);
        } catch(error) {
            console.error('Ha habido un error al obtener la persona:', error);
        } finally {
            setLoading(false);
        }
    } 

    return(

        <div>
            <input placeholder='0010001430123456000105' onChange={(e) => {setCBU(e.target.value)}}></input>
            <button onClick={getCBU} disabled={loading}>
                {loading ? 'Cargando...' : 'Buscar'}
            </button>
        </div>

    )

}

export default SearchPersonByCBU