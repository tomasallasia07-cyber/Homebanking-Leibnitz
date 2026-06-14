import api from '../../api/axiosConfig'
import { useState } from 'react'

function SearchPersonByAlias() {

    const [loading, setLoading] = useState(false);
    const [alias, setAlias] = useState('');
    const [person, setPerson] = useState('');

    const getAlias = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/persons/alias/${alias}`);
            console.log(data);
        } catch(error) {
            console.error('Ha habido un error al obtener la persona:', error);
        } finally {
            setLoading(false);
        }
    } 

    return(

        <div>
            <input placeholder='PERRO.GATO.LOBIZON' onChange={(e) => {setAlias(e.target.value)}}></input>
            <button onClick={getAlias} disabled={loading}>
                {loading ? 'Cargando...' : 'Buscar'}
            </button>
        </div>

    )

}

export default SearchPersonByAlias