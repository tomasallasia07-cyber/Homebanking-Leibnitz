import api from '../api/axiosConfig'
import { useState } from 'react'

function AsingAliasToPerson() {

    const[generatedAlias, setGeneratedAlias] = useState('');
    const[CBU, setCBU] = useState('');
    const[loading, setLoading] = useState('');

    const asingAlias = async () => {
        try {
            setLoading(true);
            const { data } = await api.put(`/persons/${CBU}/alias`, {alias: `${generatedAlias}`});
            console.log(data);
        } catch(error) {
            console.error('Ha habido un error al añadir el alias:', error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div>
            <input placeholder='0010001430123456000105' onChange={(e) => {setCBU(e.target.value)}}></input>
            <input placeholder='PERRO.GATO.LOBIZON' onChange={(e) => {setGeneratedAlias(e.target.value)}}></input>
            <button onClick={asingAlias} disabled={loading}>
                {loading ? 'Cargando...' : 'Añadir Alias'}
            </button>
        </div>
    )

}

export default AsingAliasToPerson