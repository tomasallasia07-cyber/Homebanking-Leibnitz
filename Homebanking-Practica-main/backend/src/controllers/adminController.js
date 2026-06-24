const { getAuth } = require('@clerk/express');
const pool = require('../db/conexion');
const centralBank = require('../config/axiosConfig');

// Middleware reutilizable para verificar que es Empleado
const verificarAdmin = async (userId) => {
    const respuesta = await pool.query(
        `SELECT rp.id_rol FROM roles_x_personas rp
         JOIN personas p ON p.id = rp.id_persona
         WHERE p.clerk = $1 AND rp.id_rol = 3`,
        [userId]
    );
    return respuesta.rows.length > 0;
};

const getUsuarios = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await verificarAdmin(userId)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const respuesta = await pool.query(`
            SELECT p.id, p.nombre, p.apellido, p.dni, p.email, p.telefono, p.direccion,
                   cb.id_cuenta, cb.cbu, cb.alias, cb.saldo, cb.moneda,
                   ep.nombre AS estado_producto, tp.nombre AS tipo_producto,
                   pr.id_producto, pr.id_estado_producto,
                   r.nombre_rol
            FROM personas p
            LEFT JOIN productos pr ON pr.id_persona = p.id
            LEFT JOIN tipos_producto tp ON tp.id_tipo_producto = pr.id_tipo_producto
            LEFT JOIN estados_producto ep ON ep.id_estado_producto = pr.id_estado_producto
            LEFT JOIN cuentas_bancarias cb ON cb.id_producto = pr.id_producto
            LEFT JOIN roles_x_personas rp ON rp.id_persona = p.id
            LEFT JOIN roles r ON r.id_rol = rp.id_rol
            ORDER BY p.id ASC`
        );

        res.status(200).json(respuesta.rows);
    } catch(error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const agregarSaldo = async (req, res) => {
    const client = await pool.connect();
    try {
        const { userId } = getAuth(req);
        if (!await verificarAdmin(userId)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params;
        const { monto } = req.body;

        if (!monto || monto <= 0) {
            return res.status(400).json({ error: 'El monto debe ser mayor a cero' });
        }

        await client.query('BEGIN');

        const respuestaCuenta = await client.query(
            `SELECT cb.id_cuenta FROM cuentas_bancarias cb
             JOIN productos pr ON pr.id_producto = cb.id_producto
             WHERE pr.id_persona = $1`, [id]
        );

        if (respuestaCuenta.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }

        const idCuenta = respuestaCuenta.rows[0].id_cuenta;

        await client.query(
            'UPDATE cuentas_bancarias SET saldo = saldo + $1 WHERE id_cuenta = $2',
            [monto, idCuenta]
        );

        await client.query(
            `INSERT INTO movimientos (id_cuenta, tipo, descripcion, importe)
             VALUES ($1, 'credito_admin', 'Acreditación por administrador', $2)`,
            [idCuenta, monto]
        );

        await client.query('COMMIT');
        res.status(200).json({ mensaje: `Se acreditaron $${monto} correctamente` });
    } catch(error) {
        await client.query('ROLLBACK');
        console.error('Error al agregar saldo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        client.release();
    }
};

const editarPersona = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await verificarAdmin(userId)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params;
        const { nombre, apellido, dni, email, telefono, direccion } = req.body;

        const respuesta = await pool.query(
            `UPDATE personas SET nombre=$1, apellido=$2, dni=$3, email=$4, telefono=$5, direccion=$6
             WHERE id=$7 RETURNING *`,
            [nombre, apellido, dni, email, telefono, direccion, id]
        );

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }

        res.status(200).json(respuesta.rows[0]);
    } catch(error) {
        console.error('Error al editar persona:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const editarAlias = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await verificarAdmin(userId)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params; // id_persona
        const { alias } = req.body;

        const respuesta = await pool.query(
            `UPDATE cuentas_bancarias cb SET alias = $1
             FROM productos pr
             WHERE cb.id_producto = pr.id_producto AND pr.id_persona = $2
             RETURNING cb.*`,
            [alias, id]
        );

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }

        res.status(200).json(respuesta.rows[0]);
    } catch(error) {
        console.error('Error al editar alias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const editarEstadoProducto = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await verificarAdmin(userId)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { id } = req.params; // id_producto
        const { id_estado_producto } = req.body;

        const respuesta = await pool.query(
            `UPDATE productos SET id_estado_producto = $1
             WHERE id_producto = $2 RETURNING *`,
            [id_estado_producto, id]
        );

        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(respuesta.rows[0]);
    } catch(error) {
        console.error('Error al editar estado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const cambiarNombreBanco = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await verificarAdmin(userId)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { nombre } = req.body;
        const { data } = await centralBank.put('/banks/me', { name: nombre });
        res.status(200).json(data);
    } catch(error) {
        console.error('Error al cambiar nombre del banco:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getBancos = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await verificarAdmin(userId)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { data } = await centralBank.get('/banks');
        res.status(200).json(data);
    } catch(error) {
        console.error('Error al obtener bancos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getUsuarios, agregarSaldo, editarPersona, editarAlias, editarEstadoProducto, cambiarNombreBanco, getBancos };