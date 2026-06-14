const { getAuth } = require('@clerk/express');
const pool = require('../db/conexion');

const getMe = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'No autenticado' });

        const respuesta = await pool.query('SELECT * FROM personas WHERE clerk = $1', [userId]);

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }

        const persona = respuesta.rows[0];

        const respuestaProductos = await pool.query(`
            SELECT 
                pr.id_producto,
                tp.nombre AS tipo_producto,
                ep.nombre AS estado_producto,
                cb.cbu,
                cb.alias,
                cb.moneda,
                cb.saldo
            FROM productos pr
            JOIN tipos_producto tp ON pr.id_tipo_producto = tp.id_tipo_producto
            JOIN estados_producto ep ON pr.id_estado_producto = ep.id_estado_producto
            LEFT JOIN cuentas_bancarias cb ON pr.id_producto = cb.id_producto
            WHERE pr.id_persona = $1`,
            [persona.id]
        );

        res.status(200).json({
            persona,
            productos: respuestaProductos.rows
        });
    } catch(error) {
        console.error('Error interno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { getMe };