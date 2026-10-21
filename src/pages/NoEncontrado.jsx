import { Link } from 'react-router-dom';

function NoEncontrado() {
  return (
    <div className="container py-5 text-center">
      <p className="display-1 fw-bold text-muted mb-0">404</p>
      <h1 className="h3 mb-3">Página no encontrada</h1>
      <p className="text-muted">La dirección que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}

export default NoEncontrado;