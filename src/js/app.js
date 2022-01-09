let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); //Muestra y oculta las secciones
    tabs(); //Cambia la sección cuando se presionen los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();
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