const pool = require('../config/db');

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    // Buscar persona por clerk_id
    const result = await pool.query(
      'SELECT * FROM Personas WHERE clerk_id = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.usuario = result.rows[0];
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};