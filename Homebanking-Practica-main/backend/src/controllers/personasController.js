const { json } = require('express');
const pool = require('../db/conexion');
const centralBank = require('../config/axiosConfig')

const getPersonas = async (req, res) => {
    try {
        const respuesta = await pool.query('SELECT * FROM personas');
        res.json(respuesta.rows)
    } catch(error) {
        console.error('Ha ocurrido un error al obtener personas.');
        res.status(500).json({ error: 'Error en el servidor interno'});
    } 
}

const getPersonasByID = async (req, res) => {
    try {
        const { id } = req.params;
        const respuesta = await pool.query('SELECT * from personas WHERE id = $1', [id]);
        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Persona no encontrada'});
        }
        res.status(200).json(respuesta.rows[0]);
    } catch(error) {
        console.error('Error al obtener persona:', error);
        res.status(500).json({ error: 'Error en el servidor interno' });
    }
}

const { getAuth } = require('@clerk/express');

const postPersonas = async (req, res) => {
    const client = await pool.connect();
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'No autenticado' });

        const { nombre, apellido, dni, direccion, email, telefono, fecha_nac } = req.body;
        const respuestaBanco = await centralBank.post('/persons', { nombre, apellido, dni });
        const cbu = respuestaBanco.data.cbu;

        await client.query('BEGIN');

        const respuestaPersona = await client.query(`
            INSERT INTO personas (nombre, apellido, dni, direccion, email, telefono, fecha_nac, clerk)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [nombre, apellido, dni, direccion, email, telefono, fecha_nac, userId]
        );
        const persona = respuestaPersona.rows[0];
        
        const respuestaProducto = await client.query(`
            INSERT INTO productos (id_persona, id_tipo_producto, id_estado_producto)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [persona.id, 1, 1]
        );
        const producto = respuestaProducto.rows[0]
        console.log('Producto creado:', producto);

        const respuestaCuenta = await client.query(`
            INSERT INTO cuentas_bancarias (id_producto, cbu, alias, moneda, saldo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [producto.id_producto, cbu, null, 'ARS', 0]
        );
        const cuenta = respuestaCuenta.rows[0]
        console.log('Cuenta creada con exito', cuenta);

        await client.query('COMMIT')

        res.status(201).json({
            persona,
            producto,
            cuenta
        });
    }   catch(error) {
            await client.query('ROLLBACK')
            console.error('Error al crear persona', error);
            res.status(500).json({ error: 'Error interno del servidor' });
    }   finally {
        client.release();
    }
}

const updatePersonas = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, dni, direccion, email, telefono, fecha_nac } = req.body;
        const respuesta = await pool.query(`UPDATE personas
            SET nombre = $1, apellido = $2, dni = $3, direccion = $4, email = $5, telefono = $6, fecha_nac = $7
            WHERE id = $8
            RETURNING *`,
            [nombre, apellido, dni, direccion, email, telefono, fecha_nac, id] 
        );
        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        res.status(200).json(respuesta.rows[0]);
    } catch(error) {
        console.error('Error al actualizar persona:', error);
        res.status(500).json({ error: 'Error en el servidor interno' });
    }
}

const deletePersonas = async (req, res) => {
    const { id } = req.params
    try {
        const respuesta = await pool.query(`
            DELETE FROM personas WHERE id = $1
            RETURNING *`,
        [id]);
        if (respuesta.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontro a la persona' });
        }
        res.status(200).json(respuesta.rows[0]);
    } catch (error) {
        console.error('Error al borrar persona', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
}
module.exports = { getPersonas, getPersonasByID, postPersonas, updatePersonas, deletePersonas };

