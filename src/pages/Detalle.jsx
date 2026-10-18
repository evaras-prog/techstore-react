import { useParams, Link } from 'react-router-dom';
import { obtenerProductoPorCodigo } from '../data/productosService';
import { formatoCLP } from '../data/datos';
import { useCarrito } from '../context/CarritoContext';

function Detalle() {
  const { codigo } = useParams();
  const { agregar } = useCarrito();
  const producto = obtenerProductoPorCodigo(codigo);

  if (!producto) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Producto no encontrado.</div>
        <Link to="/productos" className="btn btn-primary">
          Volver a productos
        </Link>
      </div>
    );
  }

  const sinStock = producto.stock <= 0;
  const stockBajo = producto.stock > 0 && producto.stock <= producto.stockCritico;

  return (
    <div className="container py-4">
      <Link to="/productos" className="btn btn-link px-0 mb-3">
        &larr; Volver a productos
      </Link>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded border p-3"
          />
        </div>

        <div className="col-12 col-md-6">
          <span className="badge bg-secondary mb-2">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>
          <p className="text-muted">{producto.descripcion}</p>

          {producto.oferta ? (
            <p>
              <span className="text-decoration-line-through text-muted me-2">
                {formatoCLP(producto.precio)}
              </span>
              <span className="fw-bold fs-3 text-danger">
                {formatoCLP(producto.precioOferta)}
              </span>
            </p>
          ) : (
            <p className="fw-bold fs-3">{formatoCLP(producto.precio)}</p>
          )}

          {sinStock && <p className="text-danger fw-semibold">Sin stock</p>}
          {stockBajo && (
            <p className="text-warning fw-semibold">
              Últimas {producto.stock} unidades
            </p>
          )}

          <button
            className="btn btn-primary btn-lg"
            disabled={sinStock}
            onClick={() => agregar(producto)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detalle;