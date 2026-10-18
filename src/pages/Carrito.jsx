import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { formatoCLP } from '../data/datos';
import CarritoItem from '../components/CarritoItem';

function Carrito() {
  const { items, cambiarCantidad, quitar, vaciar, total } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="container py-4">
        <h1 className="mb-4">Carrito</h1>
        <div className="alert alert-info">Tu carrito está vacío.</div>
        <Link to="/productos" className="btn btn-primary">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Carrito</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {items.map((item) => (
            <CarritoItem
              key={item.codigo}
              item={item}
              onCambiarCantidad={cambiarCantidad}
              onQuitar={quitar}
            />
          ))}
          <button className="btn btn-outline-danger btn-sm" onClick={vaciar}>
            Vaciar carrito
          </button>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen</h5>
              <p className="d-flex justify-content-between">
                <span>Total</span>
                <strong>{formatoCLP(total)}</strong>
              </p>
              <Link to="/checkout" className="btn btn-success w-100">
                Ir a pagar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;