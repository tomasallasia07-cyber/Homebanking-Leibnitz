const pool = require('../config/db');
require('dotenv').config();

const obtenerSaldo = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const result = await pool.query(
      `SELECT cb.id_cuenta, cb.cbu, cb.alias, cb.moneda, cb.saldo,
              tp.nombre AS tipo_producto, ep.nombre AS estado
       FROM Cuentas_Bancarias cb
       JOIN Productos pr ON cb.id_producto = pr.id_producto
       JOIN Tipos_Producto tp ON pr.id_tipo_producto = tp.id_tipo_producto
       JOIN Estados_Producto ep ON pr.id_estado_producto = ep.id_estado_producto
       WHERE pr.id_persona = $1`,
      [usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No tenés cuentas registradas' });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerMovimientos = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const result = await pool.query(
      `SELECT m.id, m.tipo, m.importe, m.descripcion, m.fecha,
              cb.cbu
       FROM Movimientos m
       JOIN Cuentas_Bancarias cb ON m.cuenta_id = cb.id_cuenta
       JOIN Productos pr ON cb.id_producto = pr.id_producto
       WHERE pr.id_persona = $1
       ORDER BY m.fecha DESC`,
      [usuarioId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { obtenerSaldo, obtenerMovimientos };