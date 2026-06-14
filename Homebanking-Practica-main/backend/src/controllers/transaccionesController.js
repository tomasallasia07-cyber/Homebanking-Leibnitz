const centralBank = require('../config/axiosConfig');

const getTransacciones = async (req, res) => {
    try {
        const { cbu } = req.params;

        // Llama a la API del profe
        const respuesta = await centralBank.get('/transactions', {
            params: { minutos: 1440 } // últimas 24hs
        });

        const todasLasTransacciones = respuesta.data;

        // Filtra las transacciones de esa cuenta
        const enviadas = todasLasTransacciones.filter(
            t => t.cbuOrigen === cbu
        );

        const recibidas = todasLasTransacciones.filter(
            t => t.cbuDestino === cbu
        );

        res.status(200).json({
            enviadas,
            recibidas
        });

    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getTransacciones };