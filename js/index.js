const URL_BASE = "http://localhost:3000/"
const API_BASE_URL = URL_BASE + "api/productos";

let todosLosJuegos = [];
let carrito = [];
let paginaActual = 1



async function obtenerJuegos(limit, offset) {
  try {
    const respuesta = await fetch(`${API_BASE_URL}?limit=${limit}&offset=${offset}`);
    const datos = await respuesta.json();

    console.log("Datos de los juegos de la API:", datos);
    if(!datos || !datos.payload || !datos.payload.rows || datos.payload.total == null){
      return{rows: [], total: 0};
    }

    return datos.payload

  } catch (error) {
    console.error("Hubo un error al obtener los juegos:", error);
    return [];
  }
}


function guardarCarritosessionStorage() {
  sessionStorage.setItem("carritoJuegos", JSON.stringify(carrito));
}

function cargarCarritosessionStorage() {
  const carritoGuardado = sessionStorage.getItem("carritoJuegos");
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
          <img src="${URL_BASE}${juego.img_url || "img/placeholder.png"}" alt="${juego.nombre}" class="img-producto">
          <h3>${juego.nombre}</h3>
          <p>${juego.tipo.toUpperCase()}</p>
          <p>$ ${juego.precio}</p>
          <button class="boton-agregar-a-carrito" onclick="agregarACarrito(${ 
            juego.id 
          })"><img src="http://localhost:3000/img/svg-cart.svg" alt="" srcset="" class="add-cart-svg"></button>
        </div>
      `;      
  });
  contenedorJuegos.innerHTML = cartaProducto;
}

function mostrarProductosReordenamiento(productos) {
  const contenedor = document.getElementById("contenedor-productos");

    // desaparecer los productos
    contenedor.classList.add("fade-out");

    setTimeout(() => {
      // mostrar productos desaparecidos
      mostrarProductos(productos);

      // aparecer productos ordenados
      contenedor.classList.remove("fade-out");

  }, 400); 
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

  guardarCarritosessionStorage();

  //alert(`${juego.nombre} agregado al carrito!`);
}


//******************Ordenamiento*******************//
function ordenarPorPrecio() {
  mostrarProductosReordenamiento([...todosLosJuegos].sort((a, b) => a.precio - b.precio));
}

function ordenarPorNombre() {
  mostrarProductosReordenamiento(
    [...todosLosJuegos].sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
}




async function pasarDePagina() {
  const { total } = await obtenerJuegos(1, 0); // solo para obtener total  
  let maximasPagDisp = total / 10
  if (paginaActual < maximasPagDisp){
    init(10,paginaActual * 10)
    paginaActual ++;
  }
  console.log(paginaActual);
  
}
async function volverPaginaAtras() {
  if (paginaActual > 1){
    paginaActual -= 1;
    init(10,paginaActual * 10 - 10)
  }  
  console.log(paginaActual);
  
}


//************************************************************************ *//

async function init(limit=10,offset=0) {
  cargarCarritosessionStorage();
  const {rows,total} = await obtenerJuegos(limit,offset);
  console.log(rows)
  if (rows && rows.length > 0) {
    todosLosJuegos = rows;
    mostrarProductos(rows);
  } else {
    console.error("No se pudo obtener o el array está vacío.");
  }
}

init(10,0);


botonCategoria.addEventListener("click", event => {
  filtrarProductos(event.target.value);
});

botonOrdenarNombre.addEventListener("click", ordenarPorNombre);

botonOrdenarPrecio.addEventListener("click", ordenarPorPrecio);