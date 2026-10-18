import { Link } from 'react-router-dom';

function PagoFallido() {
  return (
    <div className="container py-4">
      <div className="alert alert-danger">
        <h1 className="h3 mb-1">No se pudo realizar el pago</h1>
        <p className="mb-0">
          Tu tarjeta fue rechazada. No se realizó ningún cobro y tu carrito
          sigue intacto.
        </p>
      </div>

      <Link to="/checkout" className="btn btn-primary me-2">
        Intentar nuevamente
      </Link>
      <Link to="/carrito" className="btn btn-outline-secondary">
        Volver al carrito
      </Link>
    </div>
  );
}

export default PagoFallido;