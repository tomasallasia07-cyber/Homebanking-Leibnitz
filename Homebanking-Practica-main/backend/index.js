require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const pool = require('./src/db/conexion');
const personaRoutes = require('./src/routes/personasRoutes');
const authRoutes = require('./src/routes/authRoutes');
const transaccionesRoutes = require('./src/routes/transaccionesRoutes');


const app = express();
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use('/personas', personaRoutes);
app.use('/auth', authRoutes);
app.use('/transacciones', transaccionesRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor Funcionando' });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto:${PORT}`);
});