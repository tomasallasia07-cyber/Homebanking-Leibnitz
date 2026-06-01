import api from '../api/axiosConfig'
import { useState } from 'react'



function GetBanks() {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const fetchBanks = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/banks');
            console.log(data);
            setBanks(data);  
        } catch (error) {
            console.error('Ha ocurrido un error al intentar obtener los datos:', error) 
        } finally {
            setLoading(false);
        }
    }



    return (
        <div>
            <button onClick={fetchBanks} disabled={loading}>
                {loading ? 'Cargando..' : 'Obtener bancos'}
            </button>

            <ul>
                {banks.map((banks) => (
                <li key={banks.bankCode}>{banks.name}</li>
                ))}
            </ul>
        </div>
    )

}



export default GetBanks