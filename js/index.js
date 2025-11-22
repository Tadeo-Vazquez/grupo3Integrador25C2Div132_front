const API_BASE_URL = "http://localhost:3000/api/productos";

let todosLosJuegos = [];
let carrito = [];

async function obtenerJuegos() {
  try {
    const respuesta = await fetch(API_BASE_URL);
   
    const juegos = await respuesta.json();

    console.log("Datos de los juegos API:", juegos);
    if(!juegos){
      todosLosJuegos = [];
    }
    todosLosJuegos = juegos.payload

    return todosLosJuegos;

  } catch (error) {
    console.error("Hubo un error al obtener los juegos:", error);
    return [];
  }
}


function guardarCarritoLocalStorage() {
  localStorage.setItem("carritoJuegos", JSON.stringify(carrito));
}

function cargarCarritoLocalStorage() {
  const carritoGuardado = localStorage.getItem("carritoJuegos");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
}

//**************************variables globales*****************************//

let contenedorJuegos = document.getElementById("contenedor-productos");

const botonOrdenarNombre = document.getElementById("ordenar-por-nombre");

const botonOrdenarPrecio = document.getElementById("ordenar-por-precio");

const botonCategoria = document.getElementById("catProducto")

//*************************************************************************//
function filtrarProductos(categoria) {
    let productosFiltrados = [];
    if (categoria === "todos") {
    productosFiltrados = todosLosJuegos;
    }else{
      productosFiltrados = todosLosJuegos.filter((juego) =>
      juego.tipo === categoria
   );
    }

  mostrarProductos(productosFiltrados);
}

function mostrarProductos(array) {
  let cartaProducto = "";
  array.forEach((juego) => {
    cartaProducto += `
        <div class="card-producto">
          <img src="${juego.img_url || "img/placeholder.png"}" alt="${juego.nombre}">
          <h3>${juego.nombre}</h3>
          <p>Categoría: ${juego.tipo}</p>
          <p>$ ${juego.precio}</p>
          <button class="boton-agregar-a-carrito" onclick="agregarACarrito(${ 
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


botonCategoria.addEventListener("click", event => {
  filtrarProductos(event.target.value);
});

botonOrdenarNombre.addEventListener("click", ordenarPorNombre);

botonOrdenarPrecio.addEventListener("click", ordenarPorPrecio);


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

init();

