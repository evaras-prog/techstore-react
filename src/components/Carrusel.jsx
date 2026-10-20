import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Carrusel({ slides, intervalo = 5000 }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return undefined;
    }
    const temporizador = setInterval(() => {
      setIndice((actual) => (actual + 1) % slides.length);
    }, intervalo);
    return () => clearInterval(temporizador);
  }, [slides.length, intervalo, indice]);

  if (slides.length === 0) {
    return null;
  }

  const anterior = () =>
    setIndice((actual) => (actual - 1 + slides.length) % slides.length);
  const siguiente = () => setIndice((actual) => (actual + 1) % slides.length);

  const slide = slides[indice];

  return (
    <section className="bg-dark text-white rounded-3 overflow-hidden mb-5">
      <div className="row g-0 align-items-center">
        <div className="col-12 col-md-6 p-4 p-md-5">
          <h2 className="display-6 fw-bold">{slide.titulo}</h2>
          <p className="lead">{slide.texto}</p>
          <Link to={slide.enlace} className="btn btn-primary btn-lg">
            {slide.boton}
          </Link>
        </div>
        <div className="col-12 col-md-6 text-center bg-light p-3">
          <img
            src={slide.imagen}
            alt={slide.titulo}
            className="img-fluid"
            style={{ maxHeight: '260px', objectFit: 'contain' }}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center p-3">
        <button
          className="btn btn-outline-light btn-sm"
          aria-label="Slide anterior"
          onClick={anterior}
        >
          &larr;
        </button>
        <div>
          {slides.map((s, i) => (
            <button
              key={s.titulo}
              className={`btn btn-sm rounded-circle mx-1 p-0 ${
                i === indice ? 'btn-light' : 'btn-outline-light'
              }`}
              style={{ width: '12px', height: '12px' }}
              aria-label={`Ir al slide ${i + 1}`}
              onClick={() => setIndice(i)}
            />
          ))}
        </div>
        <button
          className="btn btn-outline-light btn-sm"
          aria-label="Slide siguiente"
          onClick={siguiente}
        >
          &rarr;
        </button>
      </div>
    </section>
  );
}

export default Carrusel;