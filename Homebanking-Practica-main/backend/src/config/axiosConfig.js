/// Creamos la configuracion de axios. 
/// Asi directamente llamamos al module centalBank para realizar las llamadas a la API del profe.
const axios = require('axios');

const centralBank = axios.create({
    baseURL: 'https://centralbank.brocoly.cc/api',
    headers: {
        'x-environment': process.env.API_ENVIRONMENT,
        'x-api-key': process.env.API_KEY 
    }
})

module.exports = centralBank;