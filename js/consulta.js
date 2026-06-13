'use strict';

const rutas = JSON.parse(localStorage.getItem('rutas')) || [];
const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];

const template = document.createElement('template');

template.innerHTML = `
<style>

:host{


display:block;

}

.tarjeta-ruta{


background:white;

border-radius:16px;

padding:1.5rem;

box-shadow:0 10px 25px rgba(0,0,0,.08);

border-top:6px solid #ffcc00;

transition:.25s ease;


}

.tarjeta-ruta:hover{


transform:translateY(-5px);


}

.cabecera-ruta{


display:flex;

justify-content:space-between;

align-items:center;

gap:1rem;

margin-bottom:1rem;


}

.cabecera-ruta h2{


color:#1a2a6c;

font-size:1.4rem;


}

.badge-estudiantes{


background:#1a2a6c;

color:white;

padding:.35rem .8rem;

border-radius:999px;

font-size:.85rem;

font-weight:600;


}

.info-ruta{


display:flex;

flex-direction:column;

gap:.4rem;

margin-bottom:1.2rem;


}

.lista-estudiantes h3{


font-size:1rem;

margin-bottom:.5rem;


}

.lista-estudiantes ul{


list-style:none;

display:flex;

flex-direction:column;

gap:.5rem;


}

.lista-estudiantes li{


background:#f4f4f4;

padding:.75rem 1rem;

border-radius:10px;

border-left:4px solid #ffcc00;


}
</style>








<article class='tarjeta-ruta'> 

<header class="cabecera-ruta">

  <h2 class="nombre-ruta">
    Nombre Ruta
  </h2>

  <span class="badge-estudiantes">
    0 estudiantes
  </span>

</header>

<section 
class="info-ruta">

  <p>
    <strong>Conductor:</strong>
    <span class="nombre-conductor">
      Nombre conductor
    </span>
  </p>

  <p>
    <strong>Hora de salida:</strong>
    <span class="hora-salida">
      07:00 AM
    </span>
  </p>

</section>

<section class="lista-estudiantes">

  <h3>Estudiantes asignados</h3>

  <ul class="estudiantes">

   

  </ul>

</section>




</article>


`;

class RutaTarjeta extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    //lectura de los valores
    const nombreRuta = this.getAttribute('nombre-ruta');
    const cantidadEstudiantes = this.getAttribute('cantidad-estudiantes');
    const nombreConductor = this.getAttribute('nombre-conductor');
    const horaSalida = this.getAttribute('hora-salida');

    //reemplazo/escritura de los valores

    this.shadowRoot.querySelector('.nombre-ruta').textContent = nombreRuta;
    this.shadowRoot.querySelector('.badge-estudiantes').textContent =
      cantidadEstudiantes;
    this.shadowRoot.querySelector('.nombre-conductor').textContent =
      nombreConductor;
    this.shadowRoot.querySelector('.hora-salida').textContent = horaSalida;

    //funcion para renderizar la lsita de estudiantes
    this.renderEstudiantes();
  }

  //fuera del connected callaback vamos a hacer la funcion
  //la razon por la cual tenemos q hacerlo dentro del shadow dom es pq la etiqueta <ul> esta alli dentro.
  //y nosotros queremos añadirle elementos <li> a dicha etiqueta por cada estudiante, pero para ello, debemos manipular ese <ul> dentro
  // de el shadow, no por fuera(por ejemplo, no funcionaria gestionar esto en la funciond e tomar info)
  //ojo: no se usa la palabra function para hacer una funcion dentor de una clase, solo el nombre

  renderEstudiantes() {
    const contenedorEstudiantes = this.shadowRoot.querySelector('ul');
    const idRuta = this.getAttribute('ruta-id');

    //debemso filtrar los estudiantes que tienes el rutaPertenece igual a idRuta

    const estudiantesFiltrados = estudiantes.filter(
      (elementoEstudiante) => elementoEstudiante.rutaPertenece == idRuta,
    );

    contenedorEstudiantes.innerHTML = '';

    estudiantesFiltrados.forEach((elementoEstudiante) => {
      contenedorEstudiantes.innerHTML += `
        <li> ${elementoEstudiante.nombreEstudiante} </li>
        `;
    });
  }
}

customElements.define('ruta-tarjeta', RutaTarjeta);

//toma de valores haciendo conexion con rutas y estudiantes
function tomarInfo() {
  const contenedorTarjetas = document.getElementById('contenedor-tarjetas');

  rutas.forEach((elementoRuta) => {
    const estudiantesFiltrados = estudiantes.filter(
      (elementoEstudiante) =>
        elementoEstudiante.rutaPertenece == elementoRuta.id,
    );

    const cantidad = estudiantesFiltrados.length;

    const tarjeta = document.createElement('ruta-tarjeta');
    tarjeta.setAttribute('nombre-ruta', elementoRuta.nombreRuta);
    tarjeta.setAttribute('ruta-id', elementoRuta.id);
    tarjeta.setAttribute('cantidad-estudiantes', cantidad);
    tarjeta.setAttribute('nombre-conductor', elementoRuta.nombreConductor);
    tarjeta.setAttribute('hora-salida', elementoRuta.horaSalida);
    tarjeta.setAttribute('estudiantes-registrados', 'none');

    contenedorTarjetas.append(tarjeta);
  });
}

tomarInfo();
