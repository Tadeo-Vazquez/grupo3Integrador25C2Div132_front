let carrito = [];

function guardarCarritoLocalStorage() {
  localStorage.setItem("carritoJuegos", JSON.stringify(carrito));
}

function cargarCarritoLocalStorage() {
  const carritoGuardado = localStorage.getItem("carritoJuegos");
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
    contenedorCarrito.style.display = "none";
    carritoVacio.style.display = "block";
    precioTotalCarrito.textContent = "$0";
    return;
  }

  carritoVacio.style.display = "none";
  contenedorCarrito.style.display = "block";

  let htmlCarrito = "";

  carrito.forEach((item, indice) => {
    const subtotal = item.precio * item.cantidad;
    htmlCarrito += `
      <li class="list-carrritoProducto">
        <div class="card-carrito-producto">
          <img src="${item.img_url || "img/placeholder.png"}" alt="${item.nombre}">
            <h3>${item.nombre}</h3>
            <p>Categoría: ${item.tipo || "Sin categoría"}</p>
            <p>Precio unitario: $${item.precio}</p>
          </div>
          <div class="card-edicion-carrito">
            <button class="boton-disminuir-cantidad" onclick="disminuirCantidad(${indice})">-</button>
            <p>${item.cantidad}</p>
            <button class="boton-aumentar-cantidad" onclick="aumentarCantidad(${indice})">+</button>
          </div>
          <div class="card-precio-carrito">$${subtotal}</div>
          <button class="boton-eliminar-elemento" onclick="eliminarElemento(${indice})">Eliminar</button>
      </li>
    `;
  });

  listaCarrito.innerHTML = htmlCarrito;
  precioTotalCarrito.textContent = `$${calcularPrecioTotal()}`;
}



function aumentarCantidad(indice) {
  if (carrito[indice]) {
    carrito[indice].cantidad += 1;
    guardarCarritoLocalStorage();
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
    guardarCarritoLocalStorage();
    mostrarCarrito();
  }
}

function eliminarElemento(indice) {
  if (
    confirm("¿Estás seguro de que querés eliminar este producto del carrito?")
  ) {
    carrito.splice(indice, 1);
    guardarCarritoLocalStorage();
    mostrarCarrito();
  }
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    return;
  }

  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
    carrito.length = 0;
    guardarCarritoLocalStorage();
    mostrarCarrito();
  }
}
if (botonVaciarCarrito) {
  botonVaciarCarrito.addEventListener("click", vaciarCarrito);
}


function initCarrito() {
  cargarCarritoLocalStorage();
  mostrarCarrito();
}


initCarrito();