const pool = require('../config/db');
require('dotenv').config();

const BANCO_CENTRAL_URL = process.env.BANCO_CENTRAL_URL;
const BANCO_CENTRAL_API_KEY = process.env.BANCO_CENTRAL_API_KEY;

const realizarTransferencia = async (req, res) => {
  const { cbu_destino, importe } = req.body;
  const usuarioId = req.usuario.id;

  try {
    // Obtener cuenta origen
    const cuentaOrigen = await pool.query(
      `SELECT cb.* FROM Cuentas_Bancarias cb
       JOIN Productos pr ON cb.id_producto = pr.id_producto
       WHERE pr.id_persona = $1`,
      [usuarioId]
    );

    if (cuentaOrigen.rows.length === 0) {
      return res.status(404).json({ error: 'No tenés cuenta registrada' });
    }

    const origen = cuentaOrigen.rows[0];

    if (origen.saldo < importe) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Buscar cuenta destino en nuestra base de datos
    const cuentaDestino = await pool.query(
      'SELECT * FROM Cuentas_Bancarias WHERE cbu = $1',
      [cbu_destino]
    );

    await pool.query('BEGIN');

    // Restar saldo de origen
    await pool.query(
      'UPDATE Cuentas_Bancarias SET saldo = saldo - $1 WHERE id_cuenta = $2',
      [importe, origen.id_cuenta]
    );

    // Registrar movimiento de salida
    await pool.query(
      'INSERT INTO Movimientos (id_cuenta, tipo, importe, descripcion) VALUES ($1, $2, $3, $4)',
      [origen.id_cuenta, 'transferencia_salida', importe, `Transferencia a ${cbu_destino}`]
    );

    if (cuentaDestino.rows.length > 0) {
      // Transferencia interna
      const destino = cuentaDestino.rows[0];
      await pool.query(
        'UPDATE Cuentas_Bancarias SET saldo = saldo + $1 WHERE id_cuenta = $2',
        [importe, destino.id_cuenta]
      );
      await pool.query(
        'INSERT INTO Movimientos (id_cuenta, tipo, importe, descripcion) VALUES ($1, $2, $3, $4)',
        [destino.id_cuenta, 'transferencia_entrada', importe, `Transferencia desde ${origen.cbu}`]
      );
    } else {
      // Transferencia externa - notificar al banco central
      try {
        const respuestaCentral = await fetch(`${BANCO_CENTRAL_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': BANCO_CENTRAL_API_KEY
          },
          body: JSON.stringify({
            cbuOrigen: origen.cbu,
            cbuDestino: cbu_destino,
            importe: importe,
            saldoOrigen: origen.saldo
          })
        });

        if (!respuestaCentral.ok) {
          await pool.query('ROLLBACK');
          return res.status(400).json({ error: 'Transferencia rechazada por el banco central' });
        }
      } catch (errorCentral) {
        await pool.query('ROLLBACK');
        return res.status(500).json({ error: 'Error al comunicarse con el banco central' });
      }
    }

    await pool.query('COMMIT');
    res.json({ mensaje: 'Transferencia realizada con éxito', importe });

  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

module.exports = { realizarTransferencia };