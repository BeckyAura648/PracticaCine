// Arreglo de datos dinámicos
const catalogoCine = [
  {
    id: 1,
    titulo: 'Interstellar',
    genero: 'Ciencia ficción',
    tipo: 'pelicula', // 'pelicula' o 'serie'
    imagen: 'img/MyMelodycute4.jpg'
  },
  {
    id: 2,
    titulo: 'Coco',
    genero: 'Animación',
    tipo: 'pelicula',
    imagen: 'img/MyMelodycute4.jpg'
  },
  {
    id: 3,
    titulo: 'Stranger Things',
    genero: 'Misterio',
    tipo: 'serie',
    imagen: 'img/MyMelodycute4.jpg'
  },
  {
    id: 4,
    titulo: 'Inception',
    genero: 'Acción / Sci-Fi',
    tipo: 'pelicula',
    imagen: 'img/MyMelodycute4.jpg'
  }
];
const contenedor = document.getElementById("contenedorCatalogo");
const inputBuscador = document.getElementById("inputBuscador");

function renderizarCatalogo(lista) {
  if (!contenedor) return;

  if (lista.length === 0) {
    contenedor.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">No se encontraron resultados.</p>`;
    return;
  }

  contenedor.innerHTML = lista.map(item => `
    <article class="movie-card" data-id="${item.id}">
      <div class="card-image-container">
        <img src="${item.imagen}" alt="${item.titulo}">
        <div class="card-overlay">
          <span class="card-badge ${item.tipo}">${item.tipo === 'pelicula' ? 'Película' : 'Serie'}</span>
        </div>
      </div>
      <div class="card-info">
        <h3 class="card-title">${item.titulo}</h3>
        <p class="card-genre">${item.genero}</p>
      </div>
    </article>
  `).join('');
}

// Listener para el buscador en tiempo real
if (inputBuscador) {
  inputBuscador.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase().trim();

    const resultados = catalogoCine.filter(item => {
      const coincideTitulo = item.titulo.toLowerCase().includes(texto);
      const coincideGenero = item.genero.toLowerCase().includes(texto);
      return coincideTitulo || coincideGenero;
    });

    renderizarCatalogo(resultados);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCatalogo(catalogoCine);
});

inputBuscador.addEventListener("input", function(e) {
  const textoBusqueda = e.target.value.toLowerCase().trim();

  const catalogoFiltrado = catalogoCine.filter(item => {
    const coincideTitulo = item.titulo.toLowerCase().includes(textoBusqueda);
    const coincideGenero = item.genero.toLowerCase().includes(textoBusqueda);

    return coincideTitulo || coincideGenero;
  });

  renderizarCatalogo(catalogoFiltrado);
});

//Botón de filtro
let filtroTipoActual = 'todas';
let textoBusquedaActual = '';

function obtenerCatalogoFiltrado() {
  return catalogoCine.filter(item => {
    const coincideTipo = filtroTipoActual === 'todas' || item.tipo === filtroTipoActual;
    const coincideBusqueda = item.titulo.toLowerCase().includes(textoBusquedaActual.toLowerCase()) || 
                             item.genero.toLowerCase().includes(textoBusquedaActual.toLowerCase());
    
    return coincideTipo && coincideBusqueda;
  });
}

//Cambiar animación de "active"
const botonesFiltro = document.querySelectorAll(".filter-btn");

botonesFiltro.forEach(boton => {
  boton.addEventListener("click", (e) => {
    
    botonesFiltro.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    
    const idBoton = e.target.id;
    if (idBoton === "peliculas") {
      filtroTipoActual = "pelicula";
    } else if (idBoton === "series") {
      filtroTipoActual = "serie";
    } else {
      filtroTipoActual = "todas";
    }

    const catalogoFiltrado = obtenerCatalogoFiltrado();
    renderizarCatalogo(catalogoFiltrado);
  });
});



