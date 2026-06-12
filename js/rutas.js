'use strict';

let rutas = [];
let editId = null; //nuestra variable para saber si estamos en modo edición o modo creación

//referenciando mis elementos html a js

const eventLog = document.getElementById('event-log');
const btnNuevo = document.getElementById('btn-nuevo');
const btnCancelar = document.getElementById('btn-cancelar');
const modal = document.getElementById('modal-gestion');
const btnGuardar = document.getElementById('btn-guardar');
const form = document.getElementById('form');
const rutaNombre = document.getElementById('ruta-nombre');
const conductorNombre = document.getElementById('conductor-nombre');
const horaSalida = document.getElementById('hora-salida');
const cuerpoTabla = document.getElementById('cuerpo-tabla');

//funcion con evento personalizado de logs

function logEvent(text) {
  eventLog.textContent = text;

  //creacion de vento

  const event = new CustomEvent('app:event-log', {
    detail: { message: text },
    bubbles: true,
  });
  document.dispatchEvent(event);
}

//abrir modal con crear nueva ruta  y cerrar modal con cancelar

btnNuevo.addEventListener('click', function () {
  editId = null;
  form.reset();
  modal.classList.add('show');
  logEvent('Ventana para agregar nueva ruta abierta');
});

btnCancelar.addEventListener('click', function () {
  modal.classList.remove('show');
  logEvent('Ventana para agregar nueva ruta cerrada');
});

//boton guardar
//administrarems tanto que sucede cuando el boton guardar tiene la accion de crear nuevo usuario como si es para editar un usuario ya existente

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const datos = {
    id: editId || Date.now(),
    nombreRuta: rutaNombre.value,
    nombreConductor: conductorNombre.value,
    horaSalida: horaSalida.value,
  };

  if (editId !== null) {
    //modo edicion
    rutas = rutas.map((elementoRuta) =>
      elementoRuta.id == editId ? datos : elementoRuta,
    );
    logEvent('Ruta correctamente editada');
  } else {
    rutas.push(datos);
    logEvent('Ruta nueva correctamente registrada');
  }

  modal.classList.remove('show');
  renderizar(rutas);
});


//renderizar la tabla 

function renderizar(listaRutas) {
  ((cuerpoTabla.innerHTML = ''),
    listaRutas.forEach((elementoRuta) => {
      cuerpoTabla.innerHTML += `
        
<tr>

  <td>${elementoRuta.nombreRuta}</td>
  <td>${elementoRuta.nombreConductor}</td>
  <td>${elementoRuta.horaSalida}</td>
  <td>
    <button class="btn-editar" data-id="${elementoRuta.id}">Editar</button>
    <button class="btn-eliminar" data-id="${elementoRuta.id}">Eliminar</button>

  </td>
</tr>
        
        `;
    }));
  logEvent('Tabla renderizada');
}

