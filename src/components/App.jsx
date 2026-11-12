import { useState, useRef } from 'react';
import { catalogoCine } from '../datos';
import '../css/App.css';

export default function App() {
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  const modalRef = useRef(null);

  const catalogoFiltrado = catalogoCine.filter(item => {
    const coincideTipo = filtroTipo === 'todas' || item.tipo === filtroTipo;
    const coincideBusqueda = 
      item.titulo.toLowerCase().includes(textoBusqueda.toLowerCase()) || 
      item.genero.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  const abrirModal = (item) => {
    setPeliculaSeleccionada(item);
    if (modalRef.current) modalRef.current.showModal();
  };

  const cerrarModal = () => {
    if (modalRef.current) modalRef.current.close();
    setPeliculaSeleccionada(null);
  };

  return (
    <div>
      <header className="navbar">
        <div className="nav-brand">
          <h1>CineSpot</h1>
        </div>
        <div className="nav-icon">
          <i className="fa-solid fa-star icon-estrellita" aria-label="Favoritos"></i>
        </div>
      </header>

      <main className="main-container">
        <section className="search-section">
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass search-icon-font" aria-label="Buscar"></i>
            <input 
              type="text" 
              placeholder="Buscar películas o series..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
            />
          </div>
        </section>

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
        <button className="btn-cerrar" onClick={cerrarModal}>×</button>
        
        <span className="modal-badge-tipo">
          {peliculaSeleccionada.tipo === 'pelicula' ? 'Película' : 'Serie'}
        </span>
        
        <h2>{peliculaSeleccionada.titulo}</h2>
        
        <div className="modal-info-grupo">
          <p><strong>Género:</strong> {peliculaSeleccionada.genero}</p>
          <p><strong>Sinopsis:</strong> {peliculaSeleccionada.sinopsis}</p>
        </div>
      </div>
    </div>
      )}
</dialog>
    </div>
  );
}