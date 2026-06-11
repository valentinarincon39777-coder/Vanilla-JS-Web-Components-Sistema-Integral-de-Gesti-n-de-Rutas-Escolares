'use strict';

//referenciando mis elementos html a js

const btnAdmin = document.getElementById('btn-admin');
const btnConsulta = document.getElementById('btn-consulta');
const modal = document.getElementById('modal-acceso');
const btnConfirmar = document.getElementById('btn-confirmar');
const codigo = document.getElementById('codigo');
const btnCancelar= document.getElementById('btn-cancelar')


//variable tipoAcceso es para saber si oprimio boton de administrador o consulta
let tipoAcceso = null;


//evento boton admin y consulta

btnAdmin.addEventListener('click', function () {
  modal.classList.add('show');
  tipoAcceso = 'admin';
});

btnConsulta.addEventListener('click', function () {
  modal.classList.add('show');

  tipoAcceso = 'consulta';
});


//evento boton confirmar 

btnConfirmar.addEventListener('click', function () {
  if (codigo.value) {
    if (tipoAcceso == 'admin' && codigo.value == 'admin123') {
      window.location.href = 'admin.html';
    } else if (tipoAcceso == 'consulta' && codigo.value == 'consul123') {
      window.location.href = 'consulta.html';
    } else {
        codigo.value = '';
      alert('No ingreso el código correcto');
    }
  } else {
    alert('Debe ingresar un código para confirmar');
  }
});

codigo.addEventListener('keydown', (e)=>{
  if (e.key == 'Enter') btnConfirmar.click(); //es como si el usuario hubiera hecho clic físicamente sobre el botón.
}
)

//evento boton cancelar 

btnCancelar.addEventListener('click', function(){
     modal.classList.remove ('show');
     codigo.value=''
     tipoAcceso = null;
})
