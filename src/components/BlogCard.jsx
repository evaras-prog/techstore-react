import { Link } from 'react-router-dom';

function BlogCard({ articulo }) {
  return (
    <article className="card h-100 shadow-sm">
      <img
        src={articulo.imagen}
        alt={articulo.titulo}
        className="card-img-top"
        style={{ height: '220px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary align-self-start mb-2">
          {articulo.categoria}
        </span>
        <h2 className="h5 card-title">{articulo.titulo}</h2>
        <p className="card-text text-muted">{articulo.resumen}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">{articulo.fecha}</small>
          <Link
            to={`/blog/${articulo.id}`}
            className="btn btn-outline-primary btn-sm"
          >
            Leer más
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;