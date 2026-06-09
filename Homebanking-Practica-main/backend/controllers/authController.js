const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registro = async (req, res) => {
  const { nombre, apellido, dni, email, password, direccion, telefono, fecha_nac, clerk_id } = req.body;

  try {
    const existe = await pool.query('SELECT * FROM Personas WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const result = await pool.query(
      'INSERT INTO Personas (nombre, apellido, dni, email, password, direccion, telefono, fecha_nac, clerk_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, nombre, apellido, email',
      [nombre, apellido, dni, email, hashedPassword, direccion || null, telefono || null, fecha_nac || null, clerk_id || null]
    );

    const persona = result.rows[0];

    const producto = await pool.query(
      'INSERT INTO Productos (id_persona, id_tipo_producto, id_estado_producto) VALUES ($1, 1, 1) RETURNING id_producto',
      [persona.id]
    );

    const id_producto = producto.rows[0].id_producto;
    const cbu = '0000003100' + persona.id.toString().padStart(6, '0') + Date.now().toString().slice(-6);

    await pool.query(
      'INSERT INTO Cuentas_Bancarias (id_producto, cbu, saldo) VALUES ($1, $2, $3)',
      [id_producto, cbu, 10000]
    );

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

const loginORegistrarClerk = async (req, res) => {
  const { clerk_id, email, nombre, apellido } = req.body;

  try {
    // Buscar si ya existe
    let result = await pool.query('SELECT * FROM Personas WHERE clerk_id = $1', [clerk_id]);
    
    if (result.rows.length === 0) {
      // Crear persona nueva
      result = await pool.query(
        'INSERT INTO Personas (nombre, apellido, dni, email, clerk_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, apellido, email',
        [nombre || 'Usuario', apellido || 'Leibnitz', clerk_id, email, clerk_id]
      );

      const persona = result.rows[0];

      const producto = await pool.query(
        'INSERT INTO Productos (id_persona, id_tipo_producto, id_estado_producto) VALUES ($1, 1, 1) RETURNING id_producto',
        [persona.id]
      );

      const id_producto = producto.rows[0].id_producto;
      const cbu = '0000003100' + persona.id.toString().padStart(6, '0') + Date.now().toString().slice(-6);

      await pool.query(
        'INSERT INTO Cuentas_Bancarias (id_producto, cbu, saldo) VALUES ($1, $2, $3)',
        [id_producto, cbu, 10000]
      );
    }

    const persona = result.rows[0];
    res.json({ persona });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registro, login, loginORegistrarClerk };