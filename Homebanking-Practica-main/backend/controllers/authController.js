const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const BANCO_CENTRAL_URL = process.env.BANCO_CENTRAL_URL;
const BANCO_CENTRAL_API_KEY = process.env.BANCO_CENTRAL_API_KEY;

const registro = async (req, res) => {
  const { nombre, apellido, dni, email, password, direccion, telefono, fecha_nac } = req.body;

  try {
    // Verificar si el email ya existe
    const existe = await pool.query('SELECT * FROM Personas WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear persona en nuestra base de datos
    const result = await pool.query(
      'INSERT INTO Personas (nombre, apellido, dni, email, password, direccion, telefono, fecha_nac) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, nombre, apellido, email',
      [nombre, apellido, dni, email, hashedPassword, direccion || null, telefono || null, fecha_nac || null]
    );

    const persona = result.rows[0];

    // Crear producto (cuenta de ahorro)
    const producto = await pool.query(
      'INSERT INTO Productos (id_persona, id_tipo_producto, id_estado_producto) VALUES ($1, 1, 1) RETURNING id_producto',
      [persona.id]
    );

    const id_producto = producto.rows[0].id_producto;

    // Generar CBU
    const cbu = '0000003100' + persona.id.toString().padStart(6, '0') + Date.now().toString().slice(-6);

    // Crear cuenta bancaria
    await pool.query(
      'INSERT INTO Cuentas_Bancarias (id_producto, cbu, saldo) VALUES ($1, $2, $3)',
      [id_producto, cbu, 10000]
    );

    // Registrar en banco central
    try {
      await fetch(`${BANCO_CENTRAL_URL}/persons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': BANCO_CENTRAL_API_KEY
        },
        body: JSON.stringify({ nombre, apellido, dni })
      });
    } catch (errorCentral) {
      console.log('Error al registrar en banco central:', errorCentral);
    }

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', persona, cbu });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM Personas WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const persona = result.rows[0];

    const passwordValida = await bcrypt.compare(password, persona.password);
    if (!passwordValida) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: persona.id, email: persona.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: { id: persona.id, nombre: persona.nombre, email: persona.email }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registro, login };