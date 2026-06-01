const express = require('express');
const cors = require('cors');

const personaController = require('./controllers/personaController');
const tablaController = require('./controllers/tablaController');

const app = express();

app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json());

// ------------------
// TUS ENDPOINTS
// ------------------
app.get('/api/personas', personaController.obtenerPersonas);
app.get('/api/personas/:id/roles', personaController.obtenerRoles);
app.get('/api/personas/:id/productos', personaController.obtenerProductos);
app.post('/api/personas', personaController.crearPersona);
app.get('/api/tablas/:tabla', tablaController.obtenerTabla);

// ------------------
// PROXY A LA API EXTERNA
// ------------------
app.get('/api/proxy/persona/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await fetch(`https://centralbank.brocoly.cc/api/banks`, {
            headers: {
                'x-environment': 'prod',
                'x-api-key': '59wWNmrhz0pEs8gKln4SLvudTMoALbDcBDmmdm7R2rw'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Error en API externa' });
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en proxy' });
    }
});

// ------------------
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});