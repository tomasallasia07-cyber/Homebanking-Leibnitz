import api from "../../api/axiosConfig";
import { useState } from "react";

function CheckForTransfers() {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchTransfers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/transactions', {params: {minutos: '1440'}});
            console.log(data);
         setTransfers(data);  
        } catch (error) {
            console.error('Ha ocurrido un error al intentar obtener los datos:', error) 
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <button onClick={fetchTransfers} disabled={loading}>
                {loading ? 'Cargando..' : 'Obtener transferencias'}
            </button>
            <ul>
                {transfers.map((transfers) => (
                <li key={transfers._id}>CBU Origen:{transfers.cbuOrigen} CBU Destino: {transfers.cbuDestino} Importe: {transfers.import} Estado {transfers.estado} </li>
                ))}
            </ul>
        </div>
    )
}

export default CheckForTransfers