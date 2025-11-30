
const inputNombre = document.getElementById('nombreCliente');

const btnContinuar = document.getElementById('btnContinuar');

const errorMessage = document.getElementById('error-message');


function manejarContinuar() {
   
    const nombre = inputNombre.value.trim(); 


    if (nombre.length > 0) {
        sessionStorage.setItem('nombreCliente', nombre);
        location.href = 'index.html'; 
        
    } else {
        errorMessage.textContent = 'El nombre es obligatorio.';
        errorMessage.style.display = 'block';
    }
}

btnContinuar.addEventListener("click", manejarContinuar);