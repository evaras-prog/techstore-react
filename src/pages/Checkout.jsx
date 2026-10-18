import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { formatoCLP } from '../data/datos';
import { regionesComunas, obtenerComunas } from '../data/regiones';
import { validarCheckout } from '../data/validacionesCheckout';
import { procesarPago } from '../data/pagoService';
import { crearPedido } from '../data/pedidosService';
import CampoFormulario from '../components/CampoFormulario';

function Checkout() {
  const { usuario } = useAuth();
  const { items, total, vaciar } = useCarrito();
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    entrega: 'despacho',
    direccion: usuario?.direccion ?? '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    tarjeta: '',
  });
  const [errores, setErrores] = useState({});

  if (items.length === 0) {
    return (
      <div className="container py-4">
        <h1 className="mb-4">Checkout</h1>
        <div className="alert alert-info">No tienes productos en el carrito.</div>
        <Link to="/productos" className="btn btn-primary">
          Ver productos
        </Link>
      </div>
    );
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === 'region') {
      setDatos({ ...datos, region: value, comuna: '' });
    } else {
      setDatos({ ...datos, [name]: value });
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    const nuevosErrores = validarCheckout(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const pago = procesarPago(datos.tarjeta);
    if (!pago.exito) {
      navigate('/pago-fallido');
      return;
    }

    const despacho = datos.entrega === 'despacho';
    const pedido = crearPedido({
      cliente: `${datos.nombre} ${datos.apellidos}`,
      correo: datos.correo,
      total,
      entrega: datos.entrega,
      direccion: despacho ? datos.direccion : '',
      region: despacho ? datos.region : '',
      comuna: despacho ? datos.comuna : '',
      items: items.map((i) => ({
        codigo: i.codigo,
        nombre: i.nombre,
        cantidad: i.cantidad,
        precioUnitario: i.oferta ? i.precioOferta : i.precio,
      })),
    });

    vaciar();
    navigate('/compra-exitosa', { state: { pedido } });
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Checkout</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form onSubmit={manejarEnvio} noValidate>
            <h5 className="mb-3">Tus datos</h5>
            <div className="row">
              <div className="col-md-6">
                <CampoFormulario
                  label="Nombre"
                  name="nombre"
                  value={datos.nombre}
                  onChange={manejarCambio}
                  error={errores.nombre}
                />
              </div>
              <div className="col-md-6">
                <CampoFormulario
                  label="Apellidos"
                  name="apellidos"
                  value={datos.apellidos}
                  onChange={manejarCambio}
                  error={errores.apellidos}
                />
              </div>
            </div>
            <CampoFormulario
              label="Correo"
              name="correo"
              type="email"
              value={datos.correo}
              onChange={manejarCambio}
              error={errores.correo}
            />

            <h5 className="mb-3 mt-4">Entrega</h5>
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="entrega"
                  id="entrega-despacho"
                  value="despacho"
                  checked={datos.entrega === 'despacho'}
                  onChange={manejarCambio}
                />
                <label className="form-check-label" htmlFor="entrega-despacho">
                  Despacho a domicilio
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="entrega"
                  id="entrega-retiro"
                  value="retiro"
                  checked={datos.entrega === 'retiro'}
                  onChange={manejarCambio}
                />
                <label className="form-check-label" htmlFor="entrega-retiro">
                  Retiro en tienda
                </label>
              </div>
            </div>

            {datos.entrega === 'despacho' && (
              <>
                <CampoFormulario
                  label="Dirección"
                  name="direccion"
                  value={datos.direccion}
                  onChange={manejarCambio}
                  error={errores.direccion}
                />
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="region" className="form-label">
                      Región
                    </label>
                    <select
                      id="region"
                      name="region"
                      className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                      value={datos.region}
                      onChange={manejarCambio}
                    >
                      <option value="">Selecciona región</option>
                      {regionesComunas.map((r) => (
                        <option key={r.region} value={r.region}>
                          {r.region}
                        </option>
                      ))}
                    </select>
                    {errores.region && (
                      <div className="invalid-feedback">{errores.region}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="comuna" className="form-label">
                      Comuna
                    </label>
                    <select
                      id="comuna"
                      name="comuna"
                      className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                      value={datos.comuna}
                      onChange={manejarCambio}
                    >
                      <option value="">Selecciona comuna</option>
                      {obtenerComunas(datos.region).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errores.comuna && (
                      <div className="invalid-feedback">{errores.comuna}</div>
                    )}
                  </div>
                </div>
              </>
            )}

            <h5 className="mb-3 mt-4">Pago</h5>
            <CampoFormulario
              label="Número de tarjeta"
              name="tarjeta"
              value={datos.tarjeta}
              onChange={manejarCambio}
              error={errores.tarjeta}
              placeholder="4111 1111 1111 1111"
            />
            <div className="form-text mb-3">
              Para simular un pago rechazado, usa una tarjeta que termine en 0000.
            </div>

            <button type="submit" className="btn btn-success btn-lg w-100">
              Pagar {formatoCLP(total)}
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen de tu compra</h5>
              <ul className="list-group list-group-flush mb-3">
                {items.map((i) => (
                  <li
                    key={i.codigo}
                    className="list-group-item d-flex justify-content-between px-0"
                  >
                    <span>
                      {i.nombre} x {i.cantidad}
                    </span>
                    <span>
                      {formatoCLP((i.oferta ? i.precioOferta : i.precio) * i.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="d-flex justify-content-between fs-5 mb-0">
                <span>Total</span>
                <strong>{formatoCLP(total)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;