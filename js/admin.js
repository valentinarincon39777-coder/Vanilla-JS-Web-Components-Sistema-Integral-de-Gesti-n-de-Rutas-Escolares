'use strict';

const btnRutas = document.getElementById('btn-rutas');
const btnEstudiantes = document.getElementById('btn-estudiantes');

btnRutas.addEventListener('click', function () {
  window.location.href = 'rutas.html';
});

btnEstudiantes.addEventListener('click', function () {
  window.location.href = 'estudiantes.html';
});
