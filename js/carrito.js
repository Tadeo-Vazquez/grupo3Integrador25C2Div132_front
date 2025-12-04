const URL_BASE = "http://localhost:3000/"
let carrito = [];

function guardarCarritosessionStorage() {
  sessionStorage.setItem("carritoJuegos", JSON.stringify(carrito));
}

function cargarCarritosessionStorage() {
  const carritoGuardado = sessionStorage.getItem("carritoJuegos");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
}

const contenedorCarrito = document.getElementById("contenedor-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const precioTotalCarrito = document.getElementById("precio-total-carrito");
const botonVaciarCarrito = document.getElementById("boton-vaciar-carrito");
const botonConfirmarCompra = document.getElementById("boton-confirmar-compra");
const carritoPieDePagina = document.getElementById("carrito-pie-de-pagina")


function calcularPrecioTotal() {
  if (carrito.length === 0) {
    return 0;
  }
  return carrito.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<h2> No hay productos en el carrito. </h2>`
    return;
  }

  contenedorCarrito.style.display = "block";
  
  let htmlCarrito = "";
  
  carrito.forEach((item, indice) => {    
    const subtotal = item.precio * item.cantidad;
    htmlCarrito += `
      <li class="list-carrritoProducto">
      <div class="cont-info-producto">
        <img src="${URL_BASE}${item.img_url || "img/placeholder.png"}" alt="${item.nombre}" class="img_carrito">
        <div class="card-carrito-producto">
            <h3>${item.nombre}</h3>
            <div class="cont-datos-producto">
              <span>${item.tipo.toUpperCase() || "Sin categoría"} | $${item.precio}</span>
              
            </div>
        </div>
      </div>
      <div class="datos-prod-carrito">
        <div class="card-edicion-carrito">
          <button class="boton-disminuir-cantidad edit-prod-carrito" onclick="disminuirCantidad(${indice})"><ion-icon name="remove-circle-outline" class="svg-minus svg-button"></ion-icon></button>
          <p class="item-cantidad-carrito">${item.cantidad}</p>
          <button class="boton-aumentar-cantidad edit-prod-carrito" onclick="aumentarCantidad(${indice})"><ion-icon name="add-circle-outline" class="svg-plus svg-button"></ion-icon></button>
        </div>
        <button class="boton-eliminar-elemento edit-prod-carrito" onclick="eliminarElemento(${indice})"><ion-icon name="trash-outline" class="svg-trash svg-button"></ion-icon></button>
        <div class="card-precio-carrito">$${subtotal}</div>
      </div>
          </li>
    `;

    carritoPieDePagina.innerHTML = `
            <div id="cont-total">
              <span class="">Total</span>
              <span id="precio-total-carrito" class="">$ ${calcularPrecioTotal()}</span>
            </div>
            <div class="cont-cart-actions">
              <button id="boton-vaciar-carrito" onclick="vaciarCarrito()" class="">
                Vaciar Carrito
              </button>
              <button id="boton-confirmar-compra" onclick="confirmarCompra()"class="">
                Confirmar Compra
              </button>
            </div>`
  });
  listaCarrito.innerHTML = htmlCarrito;
}

function imprimirTicket(){
  const {jsPDF} = window.jspdf;
  const doc = new jsPDF();

  // margen superior de 10px en el eje y del ticket
  let y = 20;
  doc.setFontSize(18)
  // escribimos el texto del ticket en la posicion x=10 y=10
  doc.text("Gamer-Ticket de compra: ", 10, y)

  y += 20;
  doc.setFontSize(12);
  carrito.forEach(p => {
      doc.text(`${p.nombre}`, 30, y)      
      doc.text(`$${p.precio} x${p.cantidad}`, 120, y)
      y += 10;
  })
  let total = carrito.reduce((acum,p) => acum + p.precio * p.cantidad, 0)
  y += 5;
  doc.text(`Total: $${total}`, 30, y)      

  // imprimimos ticket de venta
  doc.save("ticket.pdf")

}


function aumentarCantidad(indice) {
  if (carrito[indice]) {
    carrito[indice].cantidad += 1;
    guardarCarritosessionStorage();
    mostrarCarrito();
  }
}

function disminuirCantidad(indice) {
  if (carrito[indice]) {
    if (carrito[indice].cantidad > 1) {
      carrito[indice].cantidad -= 1;
    } else {
      eliminarElemento(indice);
      return;
    }
    guardarCarritosessionStorage();
    mostrarCarrito();
  }
}

function eliminarElemento(indice) {
  if (
    confirm("¿Estás seguro de que querés eliminar este producto del carrito?")
  ) {
    carrito.splice(indice, 1);
    guardarCarritosessionStorage();
    mostrarCarrito();
  }
}

function vaciarCarrito() {
  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
    carrito.length = 0;
    guardarCarritosessionStorage();
    mostrarCarrito();
  }
}

async function registrarVenta(datosVenta){
  try {
    const respuesta = await fetch("http://localhost:3000/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosVenta)
    });
    
    const resultado = await respuesta.json();
    console.log(resultado);
  }catch (error) {
    console.error("Error al enviar los datos: ", error);
    alert("Error al procesar la solicitud");
  }
}
const confirmarCompra = async () => {
  if (!confirm("Deseas confirmar la compra?")){
    return;
  } ;                                                                  
  const datosVenta = {
    fecha: new Date()
        .toLocaleString("sv-SE", { hour12: false })  
        .replace("T", " "),
    nombre_usuario: sessionStorage.getItem("nombreCliente"),
    productos: carrito
  };
  
  registrarVenta(datosVenta)
  alert("Compra realizada! Ve a la caja con tu ticket a retirarla");
  imprimirTicket()
  carrito.length = 0
  guardarCarritosessionStorage()
  mostrarCarrito();
  sessionStorage.removeItem("nombreCliente")
  location.href = "bienvenido.html"
};


function initCarrito() {
  cargarCarritosessionStorage();
  mostrarCarrito();
}


initCarrito();