const API_BASE_URL = "http://localhost:3000/api/productos";

export let todosLosJuegos = [];
export let carrito = [];

export async function obtenerJuegos() {
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


export function guardarCarritoLocalStorage() {
  localStorage.setItem("carritoJuegos", JSON.stringify(carrito));
}

export function cargarCarritoLocalStorage() {
  const carritoGuardado = localStorage.getItem("carritoJuegos");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
}
