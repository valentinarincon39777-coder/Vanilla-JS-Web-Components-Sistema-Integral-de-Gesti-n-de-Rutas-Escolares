'use strict';

let rutas = JSON.parse(localStorage.getItem('rutas')) || [];
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
const btnEliminar = document.getElementById('btn-eliminar');
const btnEditar = document.getElementById('btn-editar');
const filtrar = document.getElementById('filtrar');
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
  logEvent('Ventana para agregar/editar nueva ruta cerrada');
});

//boton guardar
//administraremos tanto que sucede cuando el boton guardar tiene la accion de crear nuevo usuario como si es para editar un usuario ya existente

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (
    !rutaNombre.value.trim() ||
    !conductorNombre.value.trim() ||
    !horaSalida.value.trim()
  ) {
    alert('No puede dejar los campos vacíos');
    return;
  } else {
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
      guardarRutas();
      logEvent('Ruta correctamente editada');
    } else {
      rutas.push(datos);
      guardarRutas();
      logEvent('Ruta nueva correctamente registrada');
    }

    modal.classList.remove('show');
    renderizar(rutas);
  }
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
    <button class="btn-editar" id='btn-editar' data-id="${elementoRuta.id}">Editar</button>
    <button class="btn-eliminar"  id='btn-eliminar' data-id="${elementoRuta.id}">Eliminar</button>

  </td>
</tr>
        
        `;
    }));
  logEvent('Tabla renderizada');
}

//delegación de eventos (para editar y eliminar)

cuerpoTabla.addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);

  //eliminar con filter

  if (e.target.classList.contains('btn-eliminar')) {
    const confirmar = confirm('¿Está seguro que desea eliminar la ruta?');

    if (confirmar) {
      rutas = rutas.filter((elementoRuta) => elementoRuta.id !== id);
      renderizar(rutas);
      guardarRutas();
      logEvent('Ruta eliminada correctamente');
    }
    //editar ruta con find
  } else {
    modal.classList.add('show');

    const rutaEditar = rutas.find((elementoRuta) => elementoRuta.id === id);
    editId = id;
    rutaNombre.value = rutaEditar.nombreRuta;
    conductorNombre.value = rutaEditar.nombreConductor;
    horaSalida.value = rutaEditar.horaSalida;
    logEvent('Ruta en edición.');
  }
});

//buscador con filter

filtrar.addEventListener('input', function (e) {
  const texto = e.target.value.toLowerCase();

  const rutasFiltradas = rutas.filter(
    (elementoRuta) =>
      elementoRuta.nombreRuta.toLowerCase().includes(texto) ||
      elementoRuta.nombreConductor.toLowerCase().includes(texto),
  );
  renderizar(rutasFiltradas);
  logEvent('Rutas filtradas');
});

renderizar(rutas); //para que al abrir la página automaticamnete se rendericen los datos que ya tenía guardado el localStorage

function guardarRutas() {
  localStorage.setItem('rutas', JSON.stringify(rutas));
}
