import {todosLosJuegos, carrito, obtenerJuegos, guardarCarritoLocalStorage, cargarCarritoLocalStorage} from "./utils.js"

//**************************variables globales*****************************//

let contenedorJuegos = document.getElementById("contenedor-productos");

const botonOrdenarNombre = document.getElementById("ordenar-por-nombre");

const botonOrdenarPrecio = document.getElementById("ordenar-por-precio");


//*************************************************************************//

function mostrarProductos(array) {
  let cartaProducto = "";
  array.forEach((juego) => {
    cartaProducto += `
        <div class="card-producto">
          <img src="${juego.img_url || "img/placeholder.png"}" alt="${juego.nombre}">
          <h3>${juego.nombre}</h3>
          <p>Categoría: ${juego.tipo}</p>
          <p>$ ${juego.precio}</p>
          <button onclick="agregarACarrito(${
            juego.id
          })">Agregar al carrito</button>
        </div>
      `;
  });
  contenedorJuegos.innerHTML = cartaProducto;
}

function agregarACarrito(id) {
  const juego = todosLosJuegos.find((j) => j.id === id);

  const itemExistente = carrito.find((item) => item.id === id);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      id: juego.id,
      nombre: juego.nombre,
      tipo: juego.tipo,
      precio: juego.precio,
      img_url: juego.img_url,
      cantidad: 1,
    });
  }

//  console.log(carrito);

  guardarCarritoLocalStorage();

  //alert(`${juego.nombre} agregado al carrito!`);
}


//******************Ordenamiento*******************//
function ordenarPorPrecio() {
  const juegos = todosLosJuegos;
  juegos.sort((a, b) => a.precio - b.precio);
  mostrarProductos(juegos);
}

function ordenarPorNombre() {
  const juegos = todosLosJuegos;
  juegos.sort((a, b) => {
    if (a.nombre < b.nombre) {
      return -1;
    }
    if (a.nombre > b.nombre) {
      return 1;
    }
    return 0;
  });
  mostrarProductos(juegos);
}

if (botonOrdenarNombre) {
  botonOrdenarNombre.addEventListener("click", ordenarPorNombre);
}

if (botonOrdenarPrecio) {
  botonOrdenarPrecio.addEventListener("click", ordenarPorPrecio);
}

//************************************************************************ *//

async function init() {
  cargarCarritoLocalStorage();
  const arrayDeJuegos = await obtenerJuegos();

  if (arrayDeJuegos && arrayDeJuegos.length > 0) {
    mostrarProductos(arrayDeJuegos);
  } else {
    console.error("No se pudo obtener o el array está vacío.");
  }

 
}
window.agregarACarrito = agregarACarrito;
init();

