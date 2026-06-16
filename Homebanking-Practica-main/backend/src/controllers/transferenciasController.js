const { getAuth } = require('@clerk/express');
const pool = require('../db/conexion');
const centralBank = require('../config/axiosConfig');

const esCBU = (texto) => /^\d{22}$/.test(texto);

const resolverCbuDestino = async (destinoIngresado) => {
    // Si ya es un CBU válido (22 dígitos), lo usamos directo
    if (esCBU(destinoIngresado)) {
        return { cbu: destinoIngresado, nombre: null };
    }

    // Si no, lo tratamos como alias y lo resolvemos contra el Banco Central
    try {
        const respuesta = await centralBank.get(`/persons/alias/${destinoIngresado}`);
        const persona = respuesta.data;
        return { cbu: persona.cbu, nombre: `${persona.nombre || ''} ${persona.apellido || ''}`.trim() };
    } catch (error) {
        if (error.response?.status === 404) {
            return null; // alias no encontrado
        }
        throw error; // otro error (502, etc.) lo propagamos
    }
}

const postTransferencia = async (req, res) => {
    const client = await pool.connect();
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'No autenticado' });

        const { destino, importe } = req.body; // 👈 ahora "destino" puede ser CBU o alias

        if (!destino || !importe || importe <= 0) {
            return res.status(400).json({ error: 'Destino e importe son obligatorios, importe debe ser mayor a cero' });
        }

        // 1. Buscar persona y su cuenta de origen
        const respuestaPersona = await pool.query(
            `SELECT p.id, cb.id_cuenta, cb.cbu, cb.saldo
             FROM personas p
             JOIN productos pr ON pr.id_persona = p.id
             JOIN cuentas_bancarias cb ON cb.id_producto = pr.id_producto
             WHERE p.clerk = $1`,
            [userId]
        );

        if (respuestaPersona.rows.length === 0) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }

        const cuentaOrigen = respuestaPersona.rows[0];

        // 2. Resolver el destino (CBU directo, o alias vía Banco Central)
        let resuelto;
        try {
            resuelto = await resolverCbuDestino(destino);
        } catch (errorResolucion) {
            console.error('Error al resolver alias:', errorResolucion.message);
            return res.status(503).json({ error: 'El servicio del Banco Central no está disponible. Intentá de nuevo en unos minutos.' });
        }

        if (!resuelto) {
            return res.status(404).json({ error: 'No se encontró ninguna cuenta con ese CBU o alias' });
        }

        const { cbu: cbuDestino, nombre: nombreDestinoAlias } = resuelto;

        if (cuentaOrigen.cbu === cbuDestino) {
            return res.status(400).json({ error: 'No podés transferirte a tu propia cuenta' });
        }

        if (parseFloat(cuentaOrigen.saldo) < importe) {
            return res.status(422).json({ error: 'Saldo insuficiente' });
        }

        // 3. Consultar al Banco Central para aprobar la transferencia
        let respuestaBanco;
        try {
            respuestaBanco = await centralBank.post('/transactions', {
                cbuOrigen: cuentaOrigen.cbu,
                cbuDestino,
                importe,
                saldoOrigen: parseFloat(cuentaOrigen.saldo)
            });
        } catch (errorBanco) {
            const status = errorBanco.response?.status;
            const detalle = errorBanco.response?.data;

            if (status === 422) {
                return res.status(422).json({ error: 'Saldo insuficiente según el Banco Central' });
            }
            if (status === 404) {
                return res.status(404).json({ error: 'CBU destino no encontrado en el sistema' });
            }
            if (status === 400) {
                return res.status(400).json({ error: detalle?.message || 'Datos inválidos' });
            }

            console.error('Error al consultar Banco Central:', errorBanco.message);
            return res.status(503).json({ error: 'El servicio del Banco Central no está disponible. Intentá de nuevo en unos minutos.' });
        }

        const { transaccionId, nombreDestino } = respuestaBanco.data;
        const nombreFinal = nombreDestino || nombreDestinoAlias || cbuDestino;

        // 4. Descontar saldo local y registrar movimiento
        await client.query('BEGIN');

        await client.query(
            'UPDATE cuentas_bancarias SET saldo = saldo - $1 WHERE id_cuenta = $2',
            [importe, cuentaOrigen.id_cuenta]
        );

        const respuestaMovimiento = await client.query(
            `INSERT INTO movimientos (id_cuenta, tipo, descripcion, importe, id_transaccion_externa)
             VALUES ($1, 'transferencia_salida', $2, $3, $4)
             RETURNING *`,
            [cuentaOrigen.id_cuenta, `Transferencia a ${nombreFinal}`, importe, transaccionId]
        );

        await client.query('COMMIT');

        res.status(201).json({
            mensaje: 'Transferencia realizada con éxito',
            movimiento: respuestaMovimiento.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al realizar transferencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        client.release();
    }
}

// sincronizarEntrantes queda exactamente igual que antes
const sincronizarEntrantes = async () => {
    // ...sin cambios, ver mensaje anterior
}

module.exports = { postTransferencia, sincronizarEntrantes };