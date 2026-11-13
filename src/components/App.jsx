import { useState, useRef } from 'react';
import { catalogoCine } from '../datos';
import '../css/App.css';

export default function App() {
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroGenero, setFiltroGenero] = useState('todos');
  const [mostrarMenuGeneros, setMostrarMenuGeneros] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  const modalRef = useRef(null);

  const generosDisponibles = ['Todos', 'Ciencia ficción', 'Animación', 'Drama', 'Acción'];

  const catalogoFiltrado = catalogoCine.filter(item => {
    const coincideTipo = filtroTipo === 'todas' || item.tipo === filtroTipo;
    const coincideGenero = filtroGenero === 'todos' || item.genero.toLowerCase() === filtroGenero.toLowerCase();
    const coincideBusqueda = 
      item.titulo.toLowerCase().includes(textoBusqueda.toLowerCase()) || 
      item.genero.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideTipo &&  coincideGenero && coincideBusqueda;
  });

  const abrirModal = (item) => {
    setPeliculaSeleccionada(item);
    if (modalRef.current) modalRef.current.showModal();
  };

  const cerrarModal = () => {
    if (modalRef.current) modalRef.current.close();
    setPeliculaSeleccionada(null);
  };

  const toggleFavorito = (idItem) => {
    if (favoritos.includes(idItem)) {
      setFavoritos(favoritos.filter(id => id !== idItem));
    } else {
      setFavoritos([...favoritos, idItem]);
    }
  };

  const seleccionarGenero = (genero) => {
    setFiltroGenero(genero === 'Todos' ? 'todos' : genero);
    setMostrarMenuGeneros(false);
  };

  const listaFavoritos = catalogoCine.filter(item => favoritos.includes(item.id));

  const esFavoritoActual = peliculaSeleccionada ? favoritos.includes(peliculaSeleccionada.id) : false;

  return (
    <div>
      <header className="navbar">
        <div className="nav-left-group">
          <div className="nav-brand">
            <h1>CineSpot</h1>
          </div>

          <div className="nav-search-bar">
            <i className="fa-solid fa-magnifying-glass search-icon-font" aria-label="Buscar"></i>
            <input 
              type="text" 
              placeholder="Buscar películas o series..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Botón de la estrella principal para abrir el desplegable de favoritos */}
        <div className="nav-icon" onClick={() => setMostrarFavoritos(!mostrarFavoritos)} style={{ position: 'relative', cursor: 'pointer' }}>
          <i className={`fa-solid fa-star icon-estrellita ${favoritos.length > 0 ? 'activo' : ''}`} aria-label="Favoritos"></i>
          {favoritos.length > 0 && <span className="badge-contador">{favoritos.length}</span>}
        </div>
      </header>

      {mostrarFavoritos && (
        <div className="dropdown-favoritos">
          <div className="dropdown-header">
          <h3>
              <i className="fa-solid fa-star" style={{ color: '#D7B9FF', marginRight: '8px' }}></i>
              Mis Favoritos
            </h3>
            <button className="btn-cerrar-dropdown" onClick={() => setMostrarFavoritos(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="dropdown-body">
            {listaFavoritos.length === 0 ? (
              <p className="vacio-texto">No hay películas o series marcadas como favoritas todavía.</p>
            ) : (
              listaFavoritos.map(fav => (
                <div key={fav.id} className="fav-item" onClick={() => { abrirModal(fav); setMostrarFavoritos(false); }}>
                  <img src={fav.imagen} alt={fav.titulo} />
                  <div className="fav-info">
                    <h4>{fav.titulo}</h4>
                    <span>{fav.genero}</span>
                  </div>
                  <button 
                    className="btn-quitar-fav" 
                    onClick={(e) => { e.stopPropagation(); toggleFavorito(fav.id); }}
                    title="Eliminar de favoritos"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <main className="main-container">
      {/* Una sola barra horizontal limpia y estilizada */}
      <section className="filters-section">
          <button 
            className={`filter-btn ${filtroTipo === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('todas')}
          >
            Todas
          </button>
          <button 
            className={`filter-btn ${filtroTipo === 'pelicula' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('pelicula')}
          >
            Películas
          </button>
          <button 
            className={`filter-btn ${filtroTipo === 'serie' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('serie')}
          >
            Series
          </button>
          <div className="filter-divider"></div>

          {/* Botón único desplegable para Géneros */}
          <div className="genre-dropdown-wrapper">
            <button 
              className={`filter-btn genre-trigger ${filtroGenero !== 'todos' ? 'active' : ''}`}
              onClick={() => setMostrarMenuGeneros(!mostrarMenuGeneros)}
            >
              <i className="fa-solid fa-filter" style={{ marginRight: '8px', fontSize: '0.85rem' }}></i>
              {filtroGenero === 'todos' ? 'Géneros' : filtroGenero}
              <i 
                className={`fa-solid fa-chevron-${mostrarMenuGeneros ? 'up' : 'down'}`} 
                style={{ marginLeft: '10px', fontSize: '0.8rem' }}
              ></i>
            </button>

            {mostrarMenuGeneros && (
              <div className="genre-dropdown-menu">
                {generosDisponibles.map((genero) => {
                  const esSeleccionado = 
                    (genero === 'Todos' && filtroGenero === 'todos') || 
                    genero.toLowerCase() === filtroGenero.toLowerCase();
                  return (
                    <button
                      key={genero}
                      className={`genre-option ${esSeleccionado ? 'selected' : ''}`}
                      onClick={() => seleccionarGenero(genero)}
                    >
                      <span>{genero}</span>
                      {esSeleccionado && <i className="fa-solid fa-check"></i>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="catalog-grid">
          {catalogoFiltrado.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>
              No se encontraron resultados.
            </p>
          ) : (
            catalogoFiltrado.map(item => (
              <article 
                key={item.id} 
                className="movie-card" 
                onClick={() => abrirModal(item)}
              >
                <div className="card-image-container">
                  <img src={item.imagen} alt={item.titulo} />
                  <div className="card-overlay">
                    <span className={`card-badge ${item.tipo}`}>
                      {item.tipo === 'pelicula' ? 'Película' : 'Serie'}
                    </span>
                  </div>
                </div>
                <div className="card-info">
                  <h3 className="card-title">{item.titulo}</h3>
                  <p className="card-genre">{item.genero}</p>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <dialog ref={modalRef} className="modal-pelicula" onClick={(e) => {
        if (e.target === modalRef.current) cerrarModal();
      }}>
        {peliculaSeleccionada && (
          <div className="modal-contenedor-horizontal">
            <div className="modal-imagen-container">
              <img src={peliculaSeleccionada.imagen} alt={peliculaSeleccionada.titulo} />
            </div>
            
            <div className="modal-detalles">
              <div className="modal-top-row">
                <span className="modal-badge-tipo">
                  {peliculaSeleccionada.tipo === 'pelicula' ? 'Película' : 'Serie'}
                </span>
                
                <div className="modal-acciones-derecha">
                  <button 
                    className={`btn-modal-estrella ${esFavoritoActual ? 'activo' : ''}`}
                    onClick={() => toggleFavorito(peliculaSeleccionada.id)}
                    title={esFavoritoActual ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <i className="fa-solid fa-star"></i>
                  </button>
                  <button className="btn-cerrar" onClick={cerrarModal}>×</button>
                </div>
              </div>
              
              <div className="modal-header-content">
                <h2>{peliculaSeleccionada.titulo}</h2>
              </div>
              
              <div className="modal-info-grupo">
                <p><strong>Género:</strong> {peliculaSeleccionada.genero}</p>
                <p><strong>Año:</strong> {peliculaSeleccionada.anio}</p>
                <p>
                    <strong>{peliculaSeleccionada.tipo === 'pelicula' ? 'Duración:' : 'Temporadas:'}</strong> {peliculaSeleccionada.duracion}
                </p>
                <p><strong>Sinopsis:</strong> {peliculaSeleccionada.sinopsis}</p>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}