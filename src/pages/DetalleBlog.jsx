import { useParams, Link } from 'react-router-dom';
import { obtenerArticuloPorId } from '../data/blogs';

function DetalleBlog() {
  const { id } = useParams();
  const articulo = obtenerArticuloPorId(id);

  if (!articulo) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Artículo no encontrado.</div>
        <Link to="/blog" className="btn btn-primary">
          Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <article className="container py-4" style={{ maxWidth: '800px' }}>
      <span className="badge bg-secondary mb-2">{articulo.categoria}</span>
      <h1 className="mb-2">{articulo.titulo}</h1>
      <p className="text-muted">
        {articulo.fecha} · {articulo.autor}
      </p>

      <img
        src={articulo.imagen}
        alt={articulo.titulo}
        className="img-fluid rounded mb-4"
      />

      <p className="lead">{articulo.introduccion}</p>

      {articulo.secciones.map((seccion) => (
        <section key={seccion.titulo} className="mb-3">
          <h2 className="h4">{seccion.titulo}</h2>
          <p>{seccion.texto}</p>
        </section>
      ))}

      <p>
        <strong>Conclusión:</strong> {articulo.conclusion}
      </p>

      <Link to="/blog" className="btn btn-outline-secondary mt-3">
        &larr; Volver al blog
      </Link>
    </article>
  );
}

export default DetalleBlog;