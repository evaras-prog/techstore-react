import { formatoCLP } from '../data/datos';

function CarritoItem({ item, onCambiarCantidad, onQuitar }) {
  const precioUnitario = item.oferta ? item.precioOferta : item.precio;

  return (
    <div className="card mb-3">
      <div className="row g-0 align-items-center">
        <div className="col-4 col-md-2">
          <img src={item.imagen} alt={item.nombre} className="img-fluid p-2" />
        </div>

        <div className="col-8 col-md-4">
          <div className="card-body py-2">
            <h6 className="card-title mb-1">{item.nombre}</h6>
            <p className="card-text text-muted small mb-0">
              {formatoCLP(precioUnitario)} c/u
            </p>
          </div>
        </div>

        <div className="col-6 col-md-3 text-center">
          <div className="btn-group" role="group" aria-label="Cantidad">
            <button
              className="btn btn-outline-secondary btn-sm"
              aria-label="Disminuir cantidad"
              onClick={() => onCambiarCantidad(item.codigo, item.cantidad - 1)}
            >
              -
            </button>
            <span className="btn btn-light btn-sm disabled">{item.cantidad}</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              aria-label="Aumentar cantidad"
              onClick={() => onCambiarCantidad(item.codigo, item.cantidad + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="col-6 col-md-3 text-end pe-3">
          <p className="fw-bold mb-1">
            {formatoCLP(precioUnitario * item.cantidad)}
          </p>
          <button
            className="btn btn-link btn-sm text-danger p-0"
            onClick={() => onQuitar(item.codigo)}
          >
            Quitar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarritoItem;