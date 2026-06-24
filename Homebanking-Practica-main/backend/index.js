require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const pool = require('./src/db/conexion');
const personaRoutes = require('./src/routes/personasRoutes');
const authRoutes = require('./src/routes/authRoutes');
const movimientosRoutes = require('./src/routes/movimientosRoutes');
const transferenciasRoutes = require('./src/routes/transferenciasRoutes.js');
const { sincronizarEntrantes } = require('./src/controllers/transferenciasController');
const adminRoutes = require('./src/routes/adminRoutes');




const app = express();
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use('/personas', personaRoutes);
app.use('/auth', authRoutes);
app.use('/movimientos', movimientosRoutes);
app.use('/transferencias', transferenciasRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor Funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto:${PORT}`);
});

const QUINCE_MINUTOS = 15 * 60 * 1000;
setInterval(sincronizarEntrantes, QUINCE_MINUTOS);
sincronizarEntrantes();