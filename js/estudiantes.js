'use strict';

const rutas = JSON.parse(localStorage.getItem('rutas')) || [];
let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
let editId = null;

//referenciar elementos html a js

const eventLog = document.getElementById('event-log');
const btnNuevo = document.getElementById('btn-nuevo');
const modal = document.getElementById('modal-gestion');
const form = document.getElementById('form');
const btnCancelar = document.getElementById('btn-cancelar');
const btnGuardar = document.getElementById('btn-guardar');
const estudianteNombre = document.getElementById('estudiante-nombre');
const gradoCursa = document.getElementById('grado-cursa');
const rutaPertenece = document.getElementById('ruta-pertenece');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const filtrar = document.getElementById('filtrar');
//evento personalizado de logs

function logEvent(text) {
  eventLog.textContent = text;
  //creacion de evento

  const event = new CustomEvent('app:event-log', {
    detail: { message: text },
    bubbles: true,
  });
  document.dispatchEvent(event);
}

//abrir modal con boton nuevo estudiante y cerrar modal con boton cancelar

btnNuevo.addEventListener('click', function () {
  modal.classList.add('show');
  editId = null;
  form.reset();
  logEvent('Ventana para agregar nuevo estudiante abierta');
});

btnCancelar.addEventListener('click', function () {
  modal.classList.remove('show');
  logEvent('Ventana para agregar/editar nuevo estudiante cerrada');
});

//boton guardar
//administraremos tanto que sucede cuando el boton guardar tiene la accion de crear nuevo usuario como si es para editar un usuario ya existente

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (
    !estudianteNombre.value.trim() ||
    !gradoCursa.value.trim() ||
    !rutaPertenece.value.trim()
  ) {
    alert('No puede dejar los campos vacíos');
    return;
  } else {
    const datos = {
      id: editId || Date.now(),
      nombreEstudiante: estudianteNombre.value,
      gradoCursa: gradoCursa.value,
      rutaPertenece: rutaPertenece.value,
    };

    if (editId != null) {
      //modo edición

      estudiantes = estudiantes.map((elementoEstudiante) =>
        elementoEstudiante.id === editId ? datos : elementoEstudiante,
      );
      guardarEstudiantes();
      logEvent('Estudiante correctamente editado');
    } else {
      estudiantes.push(datos);
      guardarEstudiantes();
      logEvent('Estudiante nuevo correctamente registrado');
    }

    modal.classList.remove('show');

    renderizarTabla(estudiantes, rutas);
  }
});

//renderizar select de rutas
function renderizarRutas(listaRutas) {
  if (listaRutas.length === 0) {
    rutaPertenece.innerHTML = `<option value=''>No hay rutas registradas</option>`;
  } else {
    rutaPertenece.innerHTML = '';
    listaRutas.forEach((elementoRuta) => {
      rutaPertenece.innerHTML += `
    <option value='${elementoRuta.id}'> ${elementoRuta.nombreRuta} </option>
    `;
    });
  }
}

//renderizar tabla

function renderizarTabla(listaEstudiantes, listaRutas) {
  cuerpoTabla.innerHTML = '';
  listaEstudiantes.forEach((elementoEstudiante) => {
    const idRuta = elementoEstudiante.rutaPertenece;
    const objetoRuta = listaRutas.find(
      (elementoRuta) => elementoRuta.id == idRuta,
    );

    const nombreRuta = objetoRuta ? objetoRuta.nombreRuta : 'Sin ruta';

    cuerpoTabla.innerHTML += `
    <tr>

  <td>${elementoEstudiante.nombreEstudiante}</td>
  <td>${elementoEstudiante.gradoCursa}</td>
  <td>${nombreRuta}</td>
  <td>
    <button class="btn-editar" id='btn-editar' data-id="${elementoEstudiante.id}">Editar</button>
    <button class="btn-eliminar"  id='btn-eliminar' data-id="${elementoEstudiante.id}">Eliminar</button>

  </td>
</tr>`;
  });
}

//delegacion de eventos (para editar y eliminar)

cuerpoTabla.addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains('btn-eliminar')) {
    const confirmar = confirm('¿Está seguro que desea eliminar el estudiante ');
    if (confirmar) {
      estudiantes = estudiantes.filter(
        (elementoEstudiante) => elementoEstudiante.id !== id,
      );

      renderizarTabla(estudiantes, rutas);
      guardarEstudiantes();
      eventLog('Estudiante eliminado correctamente');
    } else {
      alert('Eliminación de estudiante cancelada');
      logEvent('Se canceló la eliminación del estudiante');
    }
  }

  if (e.target.classList.contains('btn-editar')) {
    modal.classList.add('show');

    const estudianteEditar = estudiantes.find(
      (elementoEstudiante) => elementoEstudiante.id === id,
    );
    editId = id;
    estudianteNombre.value = estudianteEditar.nombreEstudiante;
    gradoCursa.value = estudianteEditar.gradoCursa;
    rutaPertenece.value = estudianteEditar.rutaPertenece;

    logEvent('Estudiante en edición.');
  }
});

//buscador con filter

filtrar.addEventListener('input', function (e) {
  const texto = e.target.value.toLowerCase();

  const estudiantesFiltrados = estudiantes.filter(
    (elementoEstudiante) =>
      elementoEstudiante.nombreEstudiante.toLowerCase().includes(texto) 
  );

  console.log(estudiantesFiltrados);

  renderizarTabla(estudiantesFiltrados, rutas);

  logEvent('Estudiantes filtrados');
});

//renderizar tabla desde un inicio
renderizarTabla(estudiantes, rutas);

//renderizar lista de rutas en select
renderizarRutas(rutas);

//local storage
function guardarEstudiantes() {
  localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
}
