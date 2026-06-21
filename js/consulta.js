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



#panel-clima{

background:linear-gradient(
    135deg,
    #eaf7ff,
    #ffffff
);

border:2px solid #d6ecff;

border-radius:var(--radius);

padding:1.5rem;

text-align:center;

box-shadow:var(--shadow);

margin-bottom:2rem;

}

#panel-clima h4{

color:#4a7ca5;

font-size:1.2rem;

margin-bottom:.5rem;

}

#temperatura-actual{

font-family:var(--font-title);

font-size:2.8rem;

font-weight:800;

color:#ffb703;

}



</style>




 



<article class='tarjeta-ruta'> 

      <section id="panel-clima">

        <h4>🌤️ Clima actual de Panamá</h4>
        <p class="temperatura-actual"></p>



      </section>

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
    const regionOpera = this.getAttribute('region-opera');

    //reemplazo/escritura de los valores

    this.shadowRoot.querySelector('.nombre-ruta').textContent = nombreRuta;

    this.shadowRoot.querySelector('.badge-estudiantes').textContent =
      cantidadEstudiantes;
    this.shadowRoot.querySelector('.nombre-conductor').textContent =
      nombreConductor;
    this.shadowRoot.querySelector('.hora-salida').textContent = horaSalida;
    this.shadowRoot.querySelector('.panel-clima, h4').textContent =
      `🌤️ Clima actual en ${regionOpera}`;

    //funcion para renderizar la lsita de estudiantes
    this.renderEstudiantes();

    //SECCION DE LA API

    const temperaturaActual = this.shadowRoot.querySelector(
      '.temperatura-actual',
    );

    let temperaturaAPI;

    let API_URL;

    switch (regionOpera) {
      case 'Panamá':
        API_URL =
          'https://api.open-meteo.com/v1/forecast?latitude=8.9823&longitude=-79.5198&current=temperature_2m';
        break;

      case 'Herrera':
        API_URL =
          'https://api.open-meteo.com/v1/forecast?latitude=7.9523&longitude=-80.4382&current=temperature_2m';
        break;

      case 'Boquete':
        API_URL =
          'https://api.open-meteo.com/v1/forecast?latitude=8.7772&longitude=-82.4481&current=temperature_2m';
        break;
    }

    async function cargarTemperatura() {
      try {
        temperaturaActual.innerHTML = ` Cargando temperatura...
  `;

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('API del clima no está funcionando correctamente');
        }

        const data = await response.json();

        console.log(data);

        temperaturaAPI = data.current.temperature_2m;

        console.log(temperaturaAPI);

        temperaturaActual.innerHTML = `${temperaturaAPI} °C`;
      } catch (error) {
        console.warn(error);
        temperaturaActual.innerHTML = `No se pudo cargar el clima`;
      }
    }

    cargarTemperatura();
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
    tarjeta.setAttribute('region-opera', elementoRuta.regionOpera);

    contenedorTarjetas.append(tarjeta);
  });
}

tomarInfo();
