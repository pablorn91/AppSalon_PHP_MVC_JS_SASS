let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha:'',
    hora:'',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); //Muestra y oculta las secciones
    tabs(); //Cambia la sección cuando se presionen los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); //Consultar la API en el backend de PHP

    idCliente(); //Añade el nombre del Cliente al Objeto de cita
    nombreCliente(); //Añade el nombre del Cliente al Objeto de cita
    seleccionarFecha(); //Añade la fecha de cita al Objeto de cita
    seleccionarHora(); //Añade la hora de cita al Objeto de cita

    mostrarResumen(); //Muestra el resumen de la cita
}

function mostrarSeccion() {
    //ocultar la seccion que tenga la clase mostrar
    const seccionAnterior =  document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    const pasoSelector = `#paso-${paso}`;
    //seleccionar la sección con el paso
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //remover clase actual a tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    //Resaltar el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

// function mostrarTab() {
//     //ocultar la seccion que tenga la clase mostrar
//     const tabAnterior =  document.querySelector('.actual');
//     if(tabAnterior) {
//         tabAnterior.classList.remove('actual');
//     }
//     //seleccionar la tab con el paso
//     const botones = document.querySelectorAll('.tabs button');
//     botones.forEach (boton => {
//         if ( boton.dataset.paso == paso) {
//             boton.classList.add('actual');
//         }
//     });
// }

function tabs () {
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton =>{
        boton.addEventListener('click', function(e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            // mostrarTab();
            botonesPaginador(); //Agrega o quita los botones del paginador
        });
    });
}

function botonesPaginador () {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if ( paso === 1 ) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if ( paso === 3 ) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior  () {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if ( paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}
function paginaSiguiente () {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if ( paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    });
    
}

async function consultarAPI () {

    try {
        const url = 'http://appsalon_php_mvc_js_sass.test/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}
function mostrarServicios (servicios) {
    servicios.forEach( servicio => {
        const { id, nombre , precio } = servicio;
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;
 
        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;
        
        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        };
        
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio (servicio) {
    const { id } = servicio;
    const { servicios } = cita;

    if (servicios.some(agregado => agregado.id === id )) {
        //Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
    } else {
        //Agregarlo
        cita.servicios = [...servicios, servicio ];
    }

    //Identificar al elemento que se le dá click y activar y desactivar seleccionado
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    divServicio.classList.toggle('seleccionado');
}


function idCliente(){
    cita.id = document.querySelector('#id').value;
}
function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e) {

        //Seleccionar el día de la semana de 0=Domingo a 6=Sábado
        const dia = new Date(e.target.value).getUTCDay();

        //Comprobar Si el dia seleccionado no es ni Domingo ni Sábado
        if([0,6].includes(dia)) {
            e.target.value = '';
            cita.fecha = '';
            mostrarAlerta('No trabajamos Domingo y Sábado', 'error', '.formulario');
        } else {
            cita.fecha = inputFecha.value;
        }

    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if ( hora < 10 || hora >18) {
            e.target.value = '';
            cita.hora = '';
            mostrarAlerta('Hora no Válida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta( mensaje, tipo ,elemento, desaparece = true) {

    //Previene que se genere más de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove();
    }

    //Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    //Eliminar la alerta
    if (desaparece) {
        setTimeout( () => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    //Limpiar el contenido de resúmen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if ( Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        
        mostrarAlerta('Faltan Datos de Servicios, Fecha u Hora', 'error', '#paso-3', false);
       return; 
    } 

    //Formatear el Div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    //Heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);
    
    //Iterando y mostrando lso servicios
    servicios.forEach( servicio => {
        const { id, nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;
        
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        
        resumen.appendChild(contenedorServicio);
    });

    //Heading para cita en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);
    
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    //Formatear la fecha en español
    const fechaObj = new Date(fecha);

    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaUTC = new Date( Date.UTC( year, mes, dia ) );
    const fechaFormateada = fechaUTC.toLocaleDateString('es-ES', opciones);
    // console.log(fechaFormateada);
    
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;
    
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;
    
    //Botón para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
    
}

async function reservarCita () {

    const { id, fecha, hora, servicios } = cita;

    const idServicios = servicios.map( servicio => servicio.id );

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);
    
    // console.log([...datos]);

    try {
        
        //Petición hacia la API
        const url = 'http://appsalon_php_mvc_js_sass.test/api/citas';
    
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });
    
        resultado = await respuesta.json();
    
        console.log(resultado);
    
        if(resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
              }).then( ()=>{
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
              });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita',
          }) 
    }

    
}
