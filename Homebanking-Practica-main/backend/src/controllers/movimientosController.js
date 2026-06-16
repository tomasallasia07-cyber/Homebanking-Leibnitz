const { getAuth } = require('@clerk/express');
const pool = require('../db/conexion');

const getMovimientos = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'No autenticado' });

        // Buscamos la persona por su clerk_id
        const respuestaPersona = await pool.query(
            'SELECT id FROM personas WHERE clerk = $1', [userId]
        );
        if (respuestaPersona.rows.length === 0) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        const idPersona = respuestaPersona.rows[0].id;

        // Movimientos de todas las cuentas de esa persona
        const respuesta = await pool.query(`
            SELECT m.id_movimiento, m.tipo, m.descripcion, m.importe, m.fecha
            FROM movimientos m
            JOIN cuentas_bancarias cb ON m.id_cuenta = cb.id_cuenta
            JOIN productos pr ON cb.id_producto = pr.id_producto
            WHERE pr.id_persona = $1
            ORDER BY m.fecha DESC`,
            [idPersona]
        );

        res.status(200).json(respuesta.rows);
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { getMovimientos };