const URL_BASE = "http://localhost:3000/"
const API_BASE_URL = URL_BASE + "api/productos";

let todosLosJuegos = {};
let carrito = [];
let paginaActual = 1
sessionStorage.setItem("categoriaActual","todos")
sessionStorage.setItem("ordenActual","")

function verificarNombreIngresado(){
  if (!sessionStorage.getItem("nombreCliente")){
    location.href = "bienvenido.html"
  }
}

async function obtenerJuegos(limit, offset, categoria="todos",orderBy="") {
  try {
    const reqParams = `?limit=${limit}&offset=${offset}&soloActivos=true&categoria=${categoria}&orderBy=${orderBy}`
    const respuesta = await fetch(`${API_BASE_URL}${reqParams}`);
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

const botonCategoria = document.getElementById("catProducto");

const h1 = document.getElementById('bienvenida');

let paginaActualIndice = document.getElementById("paginaActual")

//*************************************************************************//




async function filtrarProductos(categoria) {
  let {rows} = await obtenerJuegos(10, (paginaActual - 1) * 10, categoria);
  mostrarProductos(rows);
}

function mostrarNombreBienvenidaCliente(){

  const nombre = sessionStorage.getItem('nombreCliente');
       
    
  h1.textContent = `Bienvenido ${nombre}!`;

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
  console.log(todosLosJuegos);
    
  const juego = todosLosJuegos.rows.find((j) => j.id === id);

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
  init(pag)
}

function ordenarPorNombre() {
  mostrarProductosReordenamiento(
    [...todosLosJuegos.rows].sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
}




async function pasarDePagina() {
  const { rows,total } = await obtenerJuegos(1, 0,sessionStorage.getItem("categoriaActual")); // solo para obtener total  
  let maximasPagDisp = total / 10
  if (paginaActual < maximasPagDisp){
    init(10,paginaActual * 10,sessionStorage.getItem("categoriaActual"),sessionStorage.getItem("ordenActual"))
    paginaActual ++;
    paginaActualIndice.innerHTML = `${paginaActual}`
  }
  console.log(paginaActual);
  
}
async function volverPaginaAtras() {
  if (paginaActual > 1){
    paginaActual -= 1;
    init(10,paginaActual * 10 - 10,sessionStorage.getItem("categoriaActual"),sessionStorage.getItem("ordenActual"))
    paginaActualIndice.innerHTML = `${paginaActual}`
  }  
  console.log(paginaActual);
  
}


//************************************************************************ *//

async function init(limit=10,offset=0,categoria="todos",orderBy="") {
  verificarNombreIngresado()
  mostrarNombreBienvenidaCliente();
  cargarCarritosessionStorage();
  const {rows,total} = await obtenerJuegos(limit,offset,categoria,orderBy);
  console.log(rows)
  if (rows && rows.length > 0) {
    todosLosJuegos = {rows,total};
    mostrarProductos(rows);
  } else {
    console.error("No se pudo obtener o el array está vacío.");
  }
}

init(10,0);


botonCategoria.addEventListener("click", event => {
  if (event.target.value !== sessionStorage.getItem("categoriaActual")){
    sessionStorage.setItem("categoriaActual",event.target.value)
    for (let i = 0 ; i < paginaActual; i++){
      volverPaginaAtras()
    }
    filtrarProductos(event.target.value);
    console.log(event.target.value);
  }
});

botonOrdenarNombre.addEventListener("click", () => {
  sessionStorage.setItem("ordenActual","nombre")
  init(10,(paginaActual-1)*10,sessionStorage.getItem("categoriaActual"),"nombre")
});

botonOrdenarPrecio.addEventListener("click", () => {
  sessionStorage.setItem("ordenActual","precio")
  init(10,(paginaActual-1)*10,sessionStorage.getItem("categoriaActual"),"precio")
});

