const registrarBancoForm = document.getElementById('registrarBanco');
const listarBancos = document.getElementById('listarBanco');
const buscarBancosForm = document.getElementById('buscarBanco');
const cambiarNombreBancoForm = document.getElementById('cambiarNombreBanco');
const registrarPersonaForm = document.getElementById('registrarPersona');
const buscarPersonaCBUForm = document.getElementById('buscarPersonaCBU');
const buscarPersonaALIASForm = document.getElementById('buscarPersonaALIAS');
const aniadirAliasForm = document.getElementById('aniadirAlias');

// REGISTAR BANCOS EN LA API DEL PROFE
registrarBancoForm.addEventListener('submit', async evento => {
    evento.preventDefault();
    const registrarBancoObjeto = new FormData(registrarBancoForm);
    const registarBancoData = Object.fromEntries(registrarBancoObjeto.entries());
    
    const respuesta = await fetch('https://centralbank.brocoly.cc/api/banks', {
        method: 'POST',
        headers: {
            'x-environment': 'test',
            'Content-Type': 'application/json',
            Authorization: 'Bearer 59wWNmrhz0pEs8gKln4SLvudTMoALbDcBDmmdm7R2rw'
        },
        body: JSON.stringify({
            name: registarBancoData.nombreBanco
        })
    });
    const resultado = await respuesta.json();
    console.log(resultado);
});

// LISTAR TODOS LOS BANCOS EXISTENTES EN LA API DEL PROFE
listarBancos.addEventListener('click', async evento => {
    const respuesta = await fetch('https://centralbank.brocoly.cc/api/banks', {
        headers: {
            'x-environment': 'test',
            'x-api-key': '0afbdc85-dcc1-4d74-9d6a-85aa5eccf464'
        },
    });
    const resultado = await respuesta.json();
    console.log(resultado);
});

// BUSCAR BANCOS EN LA API DEL PROFE POR EL BANKCODE
buscarBancosForm.addEventListener('submit', async evento => {
    evento.preventDefault();
    const buscarBancosObject = new FormData(buscarBancosForm);
    const buscarBancosData = Object.fromEntries(buscarBancosObject.entries());
    console.log(buscarBancosData);
    const respuesta = await fetch(`https://centralbank.brocoly.cc/api/banks/${buscarBancosData.bankCode}`, {
        headers: {
            'x-environment': 'test',
            'x-api-key': '0afbdc85-dcc1-4d74-9d6a-85aa5eccf464'
        }
    });
    const resultado = await respuesta.json();
    console.log(resultado);
});

// CAMBIAR NOMBRE DEL BANCO
cambiarNombreBancoForm.addEventListener('submit', async evento => {
    evento.preventDefault();
    const cambiarNombreBancoObject = new FormData(cambiarNombreBancoForm);
    const cambiarNombreBancoData = Object.fromEntries(cambiarNombreBancoObject.entries());
    const respuesta = await fetch('https://centralbank.brocoly.cc/api/banks/me', {
        method: 'PUT',
        headers: {
            'x-environment': 'test',
            'Content-Type': 'application/json',
            'x-api-key': '0afbdc85-dcc1-4d74-9d6a-85aa5eccf464',
        },
        body: JSON.stringify({
            name: cambiarNombreBancoData.nuevoNombre
        })
    });
    const resultado = await respuesta.json();
    console.log(resultado);
});

// REGISTRAR PERSONA EN LA API DEL PROFE
registrarPersonaForm.addEventListener('submit', async evento => {
    evento.preventDefault();
    const registrarPersonaObjeto = new FormData(registrarPersonaForm);
    const registarPersonaData = Object.fromEntries(registrarPersonaObjeto.entries());
    const respuesta = await fetch('https://centralbank.brocoly.cc/api/persons', {
        method: 'POST',
        headers: {
            'x-environment': 'test',
            'Content-Type': 'application/json',
            'x-api-key': '0afbdc85-dcc1-4d74-9d6a-85aa5eccf464',
        },
        body: JSON.stringify({
            nombre: registarPersonaData.nombre,
            apellido: registarPersonaData.apellido,
            dni: registarPersonaData.dni,
        })
    });
    const resultado = await respuesta.json();
    console.log(resultado);
});

buscarPersonaCBUForm.addEventListener('submit', async evento => {
    evento.preventDefault();
    const buscarPersonaObject = new FormData(buscarPersonaCBUForm);
    const buscarPersonaData = Object.fromEntries(buscarPersonaObject.entries());
    const respuesta = await fetch(`https://centralbank.brocoly.cc/api/persons/${buscarPersonaData.CBU}`, {
        headers: {
            'x-environment': 'test',
            'x-api-key': '0afbdc85-dcc1-4d74-9d6a-85aa5eccf464'
            }
        });
    const resultado = await respuesta.json();
    console.log(resultado);
});

aniadirAliasForm.addEventListener('submit', async evento => {
    evento.preventDefault();
    const aniadirAliasObject = new FormData(aniadirAliasForm);
    const aniadirAliasData = Object.fromEntries(aniadirAliasObject.entries());
    const respuesta = await fetch(`https://centralbank.brocoly.cc/api/persons/${aniadirAliasData.CBU}/alias`, {
        method: 'PUT',
        headers: {
            'x-environment': 'test',
            'Content-Type': 'application/json',
            'x-api-key': '0afbdc85-dcc1-4d74-9d6a-85aa5eccf464'
        },
        body: JSON.stringify({
            alias: aniadirAliasData.ALIAS
        })
    });
    const resultado = await respuesta.json();
    console.log(resultado);
});

buscarPersonaALIASForm.addEventListener('submit', async evento => {
    evento.preventDefault();
    const buscarPersonaObject = new FormData(buscarPersonaALIASForm);
    const buscarPersonaData = Object.fromEntries(buscarPersonaObject.entries());
    const respuesta = await fetch(`https://centralbank.brocoly.cc/api/persons/alias/${buscarPersonaData.ALIAS}`, {
        headers: {
            'x-environment': 'test',
            'x-api-key': '0afbdc85-dcc1-4d74-9d6a-85aa5eccf464'
            }
        });
    const resultado = await respuesta.json();
    console.log(resultado);
});

// /// SUBIR DATOS DEL FORM A BASE DE DATOS LOCAL
// form.addEventListener('submit', async evento => {
//     evento.preventDefault();
//     const formularioData = new FormData(form);
//     const data = Object.fromEntries(formularioData.entries());

//     const respuesta = await fetch('http://localhost:3001/api/personas', {
//         'method': 'POST',
//         'headers': {
//             'Content-Type': 'application/json'
//         },
//         'body': JSON.stringify(data)
//     });
//     const resultado = await respuesta.json();
//     console.log(resultado);
    
// })

// /// POST PERSONA A BASE DE DATOS DE RAUL
// async function postPersona () {
//     console.log('viviendo')
//     const respuesta = await fetch('http://localhost:3000/?url=https://centralbank.brocoly.cc/api/persons', {
//         method: 'POST',
//         headers: {
//             'x-environment': 'test',
//             'Content-Type': 'application/json',
//             'x-api-key': '59wWNmrhz0pEs8gKln4SLvudTMoALbDcBDmmdm7R2rw'
//         },
//         body: JSON.stringify({
//             nombre: 'Juanitus',
//             apellido: 'perez',
//             dni: '22573991'
//         })
//     });
//     const resultado = await respuesta.json();
//     console.log(resultado);
// }
