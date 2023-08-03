// constantes
const apiKey = '?api_key=a0ccce9a73d0c8b0f5eb545f766b33a5'; //  API key de TMDB

const url_basica = `https://api.themoviedb.org/3/`;  // url de base para referencia
const url_recomendada = `${url_basica}movie/top_rated${apiKey}`;  // las mas top para aside
const url_lista = `${url_basica}genre/movie/list${apiKey}`;  // lista de generos para el nav
const url_popular = `${url_basica}movie/popular${apiKey}&language=es-AR&page=`;  // busqueda por defecto las mas populares
// url_actual es la direccion que sera consultada a la API para mostrar en el MAIN
let url_actual = url_popular; // inicia la muestra con las mas populares por defecto


// --------- BOTONES DE SELECCION DE PAGINAS EN EL MAIN ----------------------------------------
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
      let pagina = 1;

      // Evento CLICK del boton de pagina ANTERIOR
      btnAnterior.addEventListener("click", ()=>{
          if(pagina > 1){ // funciona hasta la pagina 1
              pagina -= 1;  
              mostrarPeliculas();  // funcion con la nueva seleccion de pagina
              botones() // ubicacion y muestra de los botones
          }
      });
      
      // boton de pagina SIGUIENTE
      btnSiguiente.addEventListener("click", ()=>{
          if(pagina < 1000){ //limite de 1000 paginas
              pagina += 1;
              mostrarPeliculas();  // funcion con la nueva seleccion de pagina
              botones() // ubicacion y muestra de los botones
          }
      });

// funciones iniciales
obtenerGeneros();  // Lista de los generos de peliculas
muestraPelisRecomendadas(); // Iniciar la obtención y visualización de las películas más valoradas
mostrarPeliculas(); // Carga las peliculas en el MAIN, inicialmente las mas polulares


//  ---------------  PELICULAS RECOMENDADAS EN EL ASIDE ----------------------------------------------

// Función para obtener las películas más valoradas de TMDB
    async function muestraPelisRecomendadas() {
      
      // Solicitud GET a la API de TMDB
      fetch(`${url_recomendada}`)
        .then(response => response.json())  // respuesta de la lista seleccionada en JSON
        .then(datos => {
          // Obtener solo los primeros 30 resultados
          const movies = datos.results.slice(0, 30);

          // Dividir las películas en grupos de tres
          const grupos = [];
          for (let i = 0; i < movies.length; i += 3) {
            grupos.push(movies.slice(i, i + 3));
          }

          // Mostrar los grupos de películas con una frecuencia de 30 seg
          let indexGrupo = 0;
          muestraGrupo();

          function muestraGrupo() {
            const grupoActual = grupos[indexGrupo];

            // Limpiar el contenido anterior
            
            document.getElementById('recomendada').innerHTML = '';

            //limpia la muestra
            let peliculas = ''
            // Mostrar las películas del grupo actual
            grupoActual.forEach(pelicula => {

              peliculas += `
                    <article>
                      <a href="#" onclick="detalles(${pelicula.id})">
                        <img src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                        <h1>${pelicula.title} </h1>
                      </a>
                    </article> 
                  `;
 
            });
            document.getElementById('recomendada').innerHTML = peliculas;
            // Mostrar las imagenes suavemente a los 1 segundos
            setTimeout(fadeIn, 1000);
            // Desvanecer la imagen a los 9 segundos para que el cambio sea suave
            setTimeout(fadeOut, 9000);

            // Incrementar el índice del grupo
            indexGrupo = (indexGrupo + 1) % grupos.length;
            // será un valor entre 0 y "grupos.length - 1". 
            //Esto asegura que el nuevo valor de "indexGrupo" no exceda el rango válido de índices en el arreglo.

            // De esta manera se itera ciclicamente en la lista de elementos recomendados

            // Esperar 10 segundos y actualizar al siguiente grupo de 3 pelis
            setTimeout(muestraGrupo, 10000);
            
          }
        })
        .catch(error => {
          console.log('Error al obtener los datos:', error);
        });
    }
   
// ----------- CARGA DE PELICULAS EN EL MAIN ---------------------------------------------------

//  una funcion asincronica para que espere la respuesta de la promesa 
// para seguir la ejecucion mediante los comandos await.    
    
// funcion que busca segun la "url_actual"
    async function mostrarPeliculas() {
          
      try{
          // espera la promesa de la direccion asignada y una separacion de pagina en grupos de 20 items
          const respuesta = await fetch(url_actual + `${pagina}`);
                
          if(respuesta.status === 200){ // Consulta si la respuesta fue correcta
  
              const datos = await respuesta.json(); // espera que la promesa de ejecute a tiempo de modo asincronico
  
              let peliculas = ""; // inicializa la variable que contendra los div de cada elemento en el MAIN
              datos.results.forEach(pelicula => {

                // en caso que no tenga imagen la pelicula se le asigna una predeterminada
                if (! pelicula.poster_path){
                  poster="./img/peliDefecto.png"
                }else{
                  poster="https://image.tmdb.org/t/p/w500/" + pelicula.poster_path;
                }

                  peliculas += `
                    <article>
                      <a href="#" onclick="detalles(${pelicula.id})">
                        <img src="${poster}">
                        <h1>${pelicula.title} </h1>
                      </a>
                    </article> 
                  `;
              });
              desvanece();
              setTimeout(actualiza, 500); // retraso de 0,5 segundos para que tenga tiempo de desvanecer
              function actualiza() {
                document.getElementById("muestraPelis").innerHTML = peliculas; // asignacion al elemento en HTML
              }
                           
          }
          // algunos errores para detectear fallas en el uso, la API pfrece muchos mas pero estos fueron necesarios
          // para la depuración.
          else if(respuesta.status === 401){ console.log("Key incorrecta");}
          else if(respuesta.status === 404){ console.log("no disponible");}
          else { console.log("Error desconocido");}
      }
  
      catch(error){
          console.log(error.message);
      }
    
    }
 
// --------------  REDIRECCION A LA PAGINA DETALLES.HTML ------------------------------------
// al seleccionar con el evento click sobre una pelicula en el main o aside por medio del "id" 
// se consultan los detalles exclusivos 

// ref:  https://developer.themoviedb.org/reference/find-by-id
    function detalles(id) {
        const url = `detalles.html?id=${id}`;
        window.open(url, '_blank'); // abre una nueva ventana de detalles.html
    }

// ---- -------- OBTENER OPCIONES DE GENERO PARA EL MENU DE SELECCION -------------------------- 

// busca en la API los generos actuales para poder filtrar y los agrega al elemento "generos" del tipo option en el NAV
// ref: https://developer.themoviedb.org/reference/genre-movie-list

    async function obtenerGeneros() {
       
      try {
        const respuesta = await fetch(url_lista);
        const datos = await respuesta.json();
        
        // datos de los generos disponibles
        const generos = datos.genres;
  
        const generosElemento = document.getElementById('generos');
        // agregar los generos al elemento desplegable del menu NAV
        generos.forEach((genero) => {
          const option = document.createElement('option');

          option.value = genero.id;  // id del genero para la busqueda
          option.textContent = genero.name; // nombre del genero a mostrar
          generosElemento.appendChild(option); // agrega al ultimo d ela lista
        });
      } catch (error) {
        console.log('Error:', error);
      }
    }

//  ------  LISTA DE PELICULAS FILTRADAS POR GENERO ---------------------------

// con la seleccion de un genero en el menu se ejecuta esta funcion que devolvera solos los titulos en referencia a ese 
// genero segun la API

    function obtenerPeliculasPorGenero() {
      const generoSeleccionado = document.getElementById('generos').value; // capturo el genero seleccionado del menu
      
      // se utiliza el filtro de la API basado en la siguiente direccion
 
      url_actual = `${url_basica}discover/movie${apiKey}&with_genres=${generoSeleccionado}&language=es-AR&page=`;
      pagina = 1; // inicio en pagina 1
      botones(); // reacomoda los botones
      mostrarPeliculas();  // muestra en el main usando la url_actual
    }
  
// -------- FILTRO POR BUSQUEDA DE TEXTO ----------------------------------------

// https://developer.themoviedb.org/reference/search-movie

const btnBuscar = document.getElementById('btn-buscar');  // funcion del boton buscar
const inputTexto = document.getElementById('textoBusqueda'); // texto ingresado 

pagina = 1; // reinicio a la pagina 1

btnBuscar.addEventListener('click', () => {  // Accion de click en el boton buscar
  const inputTextoLimpio = inputTexto.value.trim();  // elimina los espacios en blanco
  
  if (inputTextoLimpio !== '') { // verifica si no es una cadena de filtro esta vacia
    // cadena con filtro, esta cadena reemplaza a la inicial de mas populares
    url_actual = `${url_basica}search/movie${apiKey}&&language=es-AR&query=${encodeURIComponent(inputTextoLimpio)}&page=`;
    
  }else{
     // si no hay texto reasigna el valor inicial como las mas populares
    url_actual = url_popular
  }

  mostrarPeliculas();  // muestra en el main 
});

// ----------  FUNCIONES DE DESVANECIMIENTO DE LAS VISTAS EN ASIDE Y MAIN -------------------------

// se realiza en JS para coordinar con el cambio de imagenes y que no sea tan abrupto

// -- ASIDE - Recomendadas
// desvanece las recomandadas
function fadeOut() { 
  var muestra = document.getElementById("recomendada");
  muestra.style.opacity = 0;
}

// muestra las recomendadas
function fadeIn() {
  var muestra = document.getElementById("recomendada");
  muestra.style.opacity = 1;
}

// -- MAIN - Populares y Filtradas
// desvanecimiento del MAIN para el cambio de paginacion sea suave
function desvanece() {
  mainFadeOut()
  setTimeout(mainFadeIn,500)
}
  function mainFadeOut() {
    var muestra = document.getElementById("muestraPelis");
    muestra.style.opacity = 0;
  }
  function mainFadeIn() {
    var muestra = document.getElementById("muestraPelis");
    muestra.style.opacity = 1;
  }

// ------------  EFECTO FIJO EN LOS BOTONES ANTERIOR Y SIGUIENTE EN EL MAIN

// Botones estan fijos en la ventana pero se adaptan
// al tamaño de la ventana y desaparecen con la vista del contenedor MAIN
// ubicados siempre a los lados, sin importar la resolución

// Eventos que modifican la ubicación
window.addEventListener('load', botones);  //  la carga inicial
window.addEventListener('scroll', botones); // con el cambio vertical de la ventana 
window.addEventListener('resize', botones); // cambio de tamaño o forma de la ventana



// Cambio de posicion con respecto al SCROLL, al mover la ventana en pequeñas pantallas, los botones siguen al contenedor MAIN 
// hasta el punto de desaparecer si este lo hace.

  function botones() {
    var buttonA = document.getElementById('btnAnterior'); // boton "anterior"
    var buttonS = document.getElementById('btnSiguiente');// boton " siguiente"

    var container = document.getElementById('main-pelis'); // contenedor MAIN
    var containerMain = container.getBoundingClientRect();  // devuelve las propiedades del elemento MAIN (top,left,..)

    var izquierdo = parseInt(containerMain.left); // propiedad de "left" del MAIN
    var tope = parseInt(containerMain.top); // valor del main en altura
    

    var alturaVisible = window.innerHeight; // altura de la ventana visible

    // si el MAIN se encuentra -- VISIBLE --
    if (containerMain.top < window.innerHeight ) {
      // se muestran los botones
      // si es la primer pagina no aparece el boton "anterior" ya que no se puede retroceder
      if (pagina == 1){
        buttonA.style.display = 'none';
      }else{
        buttonA.style.display = 'block';
      }
      
      // si es la pagina 1000 no aparece el boton "siguiente" ya que no se puede avanzar
      if (pagina == 1000){
        buttonS.style.display = 'none';
      }else{
        buttonS.style.display = 'block';
      }      
      //-- ubicacion HORIZONTAL ---
      // el caso del boton "siguiente" es fijo del lado derecho del contenedor
      // pero el boton "anterior" se debe ajustar al extremo izquierdo (left) del contenedor MAIN, 
      // el cual cambia con las diferentes resoluciones y no debe solaparse en el ASIDE
      
      buttonA.style.left = 0.86 * izquierdo + 'px'; // asignacion de ubicación izquierda del boton "anterior"
      

      // --ubicación VERTICAL ---
      // si el tope del MAIN esta por debajo del 80% de la ventana
      if (alturaVisible/1.2 < tope){
        // coloca los botones el tope del MAIN
        buttonA.style.top = tope + 'px';
        buttonS.style.top = tope + 'px';
      }else{
        // sino coloca los botones al 80%  de la ventana visible
        buttonA.style.top = alturaVisible/1.2 + 'px';
        buttonS.style.top = alturaVisible/1.2 + 'px';
      }
    } else {
      // si no esta el MAIN visible en la ventana oculta los botones
      buttonA.style.display = 'none';
      buttonS.style.display = 'none';
    }
  }

  // ------- CONTADOR DE VISITAS AL SITIO -----------
  // ref https://www.histats.com/

var _Hasync= _Hasync|| [];
_Hasync.push(['Histats.start', '1,4787497,4,109,150,20,00001000']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
  var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
  hs.src = ('//s10.histats.com/js15_as.js');
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();







