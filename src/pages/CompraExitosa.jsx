import { Link, useLocation } from 'react-router-dom';
import { formatoCLP } from '../data/datos';

function CompraExitosa() {
  const { state } = useLocation();
  const pedido = state?.pedido;

  if (!pedido) {
    return (
      <div className="container py-4">
        <div className="alert alert-info">
          No hay una compra reciente para mostrar.
        </div>
        <Link to="/productos" className="btn btn-primary">
          Ir a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="alert alert-success">
        <h1 className="h3 mb-1">¡Compra exitosa!</h1>
        <p className="mb-0">
          Gracias, {pedido.cliente}. Enviamos el comprobante a {pedido.correo}.
        </p>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Resumen del pedido</h5>
          <p className="mb-1">
            <strong>N° de pedido:</strong> {pedido.id}
          </p>
          <p className="mb-1">
            <strong>Fecha:</strong> {pedido.fecha}
          </p>
          <p className="mb-3">
            <strong>Entrega:</strong>{' '}
            {pedido.entrega === 'despacho'
              ? `Despacho a ${pedido.direccion}, ${pedido.comuna}, ${pedido.region}`
              : 'Retiro en tienda'}
          </p>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-end">Cantidad</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.items.map((i) => (
                  <tr key={i.codigo}>
                    <td>{i.nombre}</td>
                    <td className="text-end">{i.cantidad}</td>
                    <td className="text-end">{formatoCLP(i.precioUnitario)}</td>
                    <td className="text-end">
                      {formatoCLP(i.precioUnitario * i.cantidad)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3" className="text-end">
                    Total
                  </th>
                  <th className="text-end">{formatoCLP(pedido.total)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <Link to="/productos" className="btn btn-primary">
        Seguir comprando
      </Link>
    </div>
  );
}

export default CompraExitosa;