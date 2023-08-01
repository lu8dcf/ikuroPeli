async function obtenerDetallesPelicula() {
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('id'); // recuperacion del ID a detallar

    // No se proporcionó ningún ID en la URL, mostrar mensaje de error
    if (!peliculaId) {
      const detallesPelicula = document.getElementById('resultado');
      detallesPelicula.textContent = 'No se ha proporcionado un ID de película válido.';
      return;  // detiene la funcion
    }

    // datos de busqueda en la API
    const apiKey = 'a0ccce9a73d0c8b0f5eb545f766b33a5'; //  API key de TMDB
    const url = `https://api.themoviedb.org/3/movie/${peliculaId}?api_key=${apiKey}&language=es-AR`;
    const url_trailer = `https://api.themoviedb.org/3/movie/${peliculaId}/videos?api_key=${apiKey}&language=es-AR`;
    // Construccion
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json(); // espera que la promesa de ejecute a tiempo de modo asincronico

        
        //--- DETALLES ----
        // Reacomodo de FECHA para cambiar  AAAA-MM-DD  como DD de MES de AAAA
        // Crear un objeto de fecha a partir de la cadena original
        var fecha = new Date(datos.release_date);  // fecha de estreno crea el objeto

        // Obtener el día del mes y el mes a partir del objeto de fecha
        var dia = fecha.getDate();
        var mes = fecha.toLocaleString('es', { month: 'long' });

        // Construir la cadena de fecha en el formato deseado
        var fechaFormateada = dia + ' de ' + mes + ' de ' + fecha.getFullYear(); 

        // VALORIZACION - obtener el valor entero para la discriminacion del color de fondo en css

        let valorReal = datos.vote_average.toString().split('.')[0];
        let valorDecimal  = datos.vote_average.toString().slice(0,3); //solo un decimal
        
            
       
        // carga del elemento detalles a mostrar formateado
        detallesPelicula = `
          <img src="https://image.tmdb.org/t/p/w500/${datos.poster_path}" alt="Poster">
          <article>
            <h1>${datos.title}</h1>
            <p class="resumen">${datos.overview}</p>
            <p class="fecha"> Estreno:  ${fechaFormateada}</p>
            <p class="valorarizacion" entero="${valorReal}" real="${valorDecimal}"></p>
            <a href="${datos.homepage}" target="_blank" >${datos.homepage}</a>
          </article>
        `;

        //----- VIDEOS -------
        const respVideos = await fetch(url_trailer);  // consulta de los enlaces de videos en la API
        const datoVideo = await respVideos.json();  // obtencion de datos JSON

        // Funcion generica para mostrar los videos en los diferentes contenedores
        function muestraVideos(contenedor,filtro){
          var contenedorElegido = document.getElementById(contenedor);
          // de los datos se filtraran los que corresponden a "filtro"
          var filtrados = datoVideo.results.filter(video => video.type === filtro); 
          
          // si la pelicula no tiene lo filtrado, oculta el contenedor completo
          if (filtrados.length>0){
            // agrega todos los videos en el contenedor
            filtrados.forEach(video => {
              const iframe = document.createElement('iframe');
              iframe.src = `https://www.youtube.com/embed/${video.key}`;
              iframe.title = `video de youtube`
              contenedorElegido.appendChild(iframe);
            })
          }else{
            contenedorElegido.style.display = 'none'; // oculta el contenedor
          }

        }
        
        muestraVideos('trailers','Trailer') // Trailers
        muestraVideos('detrasCam','Behind the Scenes')  // Detras de Escena
        muestraVideos('reportaje','Featurette')  // Reportajes
        muestraVideos('blooper','Bloopers')  // Bloppers
        
  
        // --- PRODUCTORAS --------

        //inicializa vacio
        var companias = '<h1>Productoras</h1>';
        var logo = '';

        // recorre el array de las companias productoras de esa pelicula
        datos.production_companies.forEach((compania) => {
          //-- LOGO--
          // en caso que no exista el logo se carga uno generico
          if (! compania.logo_path){
              logo="./img/prodDefecto.png"  // generico
          }else{
              logo="https://image.tmdb.org/t/p/w500/" + compania.logo_path;
          }

          //-- Nombre
          companias += `
            <article>
              <p>${compania.name}</p>
              <img src=${logo} alt="Logo Compania">
              <p>${compania.origin_country}</p>
            </article> 
          `;
      
        });

        document.getElementById("detalles").innerHTML = detallesPelicula;  // elemendo donde se publicara los detalles
        document.getElementById("productoras").innerHTML = companias;  // elemento de las productoras
       
      
      } catch (error) {
      console.log('No se pudo cargar:', error);
    }
    

}
obtenerDetallesPelicula(); // ejecuta la funcion

  