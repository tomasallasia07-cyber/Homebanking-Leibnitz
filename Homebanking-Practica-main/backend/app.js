require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas del compañero
const personaController = require('./controllers/personaController');
const tablaController = require('./controllers/tablaController');

app.get('/api/personas', personaController.obtenerPersonas);
app.get('/api/personas/:id/roles', personaController.obtenerRoles);
app.get('/api/personas/:id/productos', personaController.obtenerProductos);
app.post('/api/personas', personaController.crearPersona);
app.get('/api/tablas/:tabla', tablaController.obtenerTabla);

// Rutas de autenticación
const authRoutes = require('./routes/authRoutes');
const cuentaRoutes = require('./routes/cuentaRoutes');
const transferenciaRoutes = require('./routes/transferenciaRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/cuentas', cuentaRoutes);
app.use('/api/transferencias', transferenciaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
