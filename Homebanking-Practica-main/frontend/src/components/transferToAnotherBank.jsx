import api from "../api/axiosConfig";
import { useState } from "react";

function TransferToAnotherBank() {

    const [accountData, setAccountData] = useState({
        cbuOrigen: '',
        cbuDestino: '',
        importe: '',
        saldoOrigen: ''
    });

    const handleChange = (e) => {
        setAccountData({
            ...accountData,
            [e.target.name]: e.target.value
        })
    }

    const postAccountData = async () => {
        try {
            const { data } = await api.post('/transactions', accountData);
            console.log('Transferencia registrada:', data);
        } catch (error) {
            console.error('Error al registrar la transferencia:', error);
        }
    };

    return(
        <div>
            <input placeholder="cbuOrigen" name="cbuOrigen" value={accountData.cbuOrigen} onChange={handleChange} />
            <input placeholder="cbuDestino" name="cbuDestino" value={accountData.cbuDestino} onChange={handleChange} />
            <input placeholder="importe" name="importe" value={accountData.importe} onChange={handleChange} />
            <input placeholder="SaldoOrigen" name="saldoOrigen" value={accountData.saldoOrigen} onChange={handleChange} />
            <button onClick={postAccountData}>Registrar accountData</button>
        </div>
    )

}

export default TransferToAnotherBank