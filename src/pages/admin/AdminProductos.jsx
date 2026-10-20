import { useState } from "react";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../data/productosService";

import { formatoCLP } from "../../data/datos";

const PRODUCTO_INICIAL = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  stockCritico: "",
  categoria: "",
  imagen: "",
  oferta: false,
  precioOferta: "",
};

function AdminProductos() {
  const [productos, setProductos] = useState(
    () => obtenerProductos()
  );

  const [formulario, setFormulario] = useState(
    PRODUCTO_INICIAL
  );

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [codigoEdicion, setCodigoEdicion] = useState(null);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));
  }

  function handleEditar(producto) {
    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      stock: String(producto.stock),
      stockCritico: String(producto.stockCritico),
      categoria: producto.categoria,
      imagen: producto.imagen,
      oferta: producto.oferta,
      precioOferta: producto.precioOferta
        ? String(producto.precioOferta)
        : "",
    });

    setCodigoEdicion(producto.codigo);
    setError("");
    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelarEdicion() {
    setCodigoEdicion(null);
    setFormulario(PRODUCTO_INICIAL);
    setError("");
    setMensaje("");
  }

  function handleEliminar(producto) {
    const confirmar = window.confirm(
      `¿Deseas eliminar el producto ${producto.nombre}?`
    );

    if (!confirmar) {
      return;
    }

    eliminarProducto(producto.codigo);

    setProductos(obtenerProductos());

    if (codigoEdicion === producto.codigo) {
      setCodigoEdicion(null);
      setFormulario(PRODUCTO_INICIAL);
    }

    setError("");
    setMensaje("Producto eliminado correctamente.");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMensaje("");

    const nuevoProducto = {
      ...formulario,
      codigo: formulario.codigo
        .trim()
        .toUpperCase(),
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      stockCritico: Number(
        formulario.stockCritico
      ),
      categoria: formulario.categoria.trim(),
      imagen: formulario.imagen.trim(),
      oferta: formulario.oferta,
      precioOferta: formulario.oferta
        ? Number(formulario.precioOferta)
        : 0,
    };

    if (nuevoProducto.precio <= 0) {
      setError("El precio debe ser mayor a 0.");
      return;
    }

    if (
      nuevoProducto.stock < 0 ||
      nuevoProducto.stockCritico < 0
    ) {
      setError("El stock no puede ser negativo.");
      return;
    }

    if (
      nuevoProducto.oferta &&
      nuevoProducto.precioOferta <= 0
    ) {
      setError(
        "Debes ingresar un precio de oferta válido."
      );
      return;
    }

    try {
      if (codigoEdicion) {
        actualizarProducto(
          codigoEdicion,
          nuevoProducto
        );

        setMensaje(
          "Producto actualizado correctamente."
        );
      } else {
        crearProducto(nuevoProducto);

        setMensaje(
          "Producto creado correctamente."
        );
      }

      setProductos(obtenerProductos());
      setFormulario(PRODUCTO_INICIAL);
      setCodigoEdicion(null);

    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>

      <h2 className="mb-3">
        Gestión de productos
      </h2>

      <p className="text-muted">
        Administración de productos de TechStore.
      </p>

      <div className="card mb-4">

        <div className="card-body">

          <h3 className="h5 mb-3">
            {codigoEdicion
              ? `Editar producto ${codigoEdicion}`
              : "Nuevo producto"}
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-12 col-md-4 mb-3">

                <label
                  htmlFor="codigo"
                  className="form-label"
                >
                  Código
                </label>

                <input
                  id="codigo"
                  name="codigo"
                  className="form-control"
                  value={formulario.codigo}
                  onChange={handleChange}
                  placeholder="Ej: TEC007"
                  disabled={codigoEdicion !== null}
                  required
                />

              </div>

              <div className="col-12 col-md-8 mb-3">

                <label
                  htmlFor="nombre"
                  className="form-label"
                >
                  Nombre
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 mb-3">

                <label
                  htmlFor="descripcion"
                  className="form-label"
                >
                  Descripción
                </label>

                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  value={formulario.descripcion}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 col-md-4 mb-3">

                <label
                  htmlFor="precio"
                  className="form-label"
                >
                  Precio
                </label>

                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="1"
                  className="form-control"
                  value={formulario.precio}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-6 col-md-4 mb-3">

                <label
                  htmlFor="stock"
                  className="form-label"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  className="form-control"
                  value={formulario.stock}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-6 col-md-4 mb-3">

                <label
                  htmlFor="stockCritico"
                  className="form-label"
                >
                  Stock crítico
                </label>

                <input
                  id="stockCritico"
                  name="stockCritico"
                  type="number"
                  min="0"
                  className="form-control"
                  value={formulario.stockCritico}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 col-md-6 mb-3">

                <label
                  htmlFor="categoria"
                  className="form-label"
                >
                  Categoría
                </label>

                <input
                  id="categoria"
                  name="categoria"
                  className="form-control"
                  value={formulario.categoria}
                  onChange={handleChange}
                  placeholder="Ej: Accesorios"
                  required
                />

              </div>

              <div className="col-12 col-md-6 mb-3">

                <label
                  htmlFor="imagen"
                  className="form-label"
                >
                  Ruta de imagen
                </label>

                <input
                  id="imagen"
                  name="imagen"
                  className="form-control"
                  value={formulario.imagen}
                  onChange={handleChange}
                  placeholder="/img/producto.jpg"
                  required
                />

              </div>

              <div className="col-12 mb-3">

                <div className="form-check">

                  <input
                    id="oferta"
                    name="oferta"
                    type="checkbox"
                    className="form-check-input"
                    checked={formulario.oferta}
                    onChange={handleChange}
                  />

                  <label
                    htmlFor="oferta"
                    className="form-check-label"
                  >
                    Producto en oferta
                  </label>

                </div>

              </div>

              {formulario.oferta && (

                <div className="col-12 col-md-4 mb-3">

                  <label
                    htmlFor="precioOferta"
                    className="form-label"
                  >
                    Precio oferta
                  </label>

                  <input
                    id="precioOferta"
                    name="precioOferta"
                    type="number"
                    min="1"
                    className="form-control"
                    value={formulario.precioOferta}
                    onChange={handleChange}
                    required
                  />

                </div>

              )}

            </div>

            {error && (
              <div
                className="alert alert-danger"
                role="alert"
              >
                {error}
              </div>
            )}

            {mensaje && (
              <div
                className="alert alert-success"
                role="alert"
              >
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
            >
              {codigoEdicion
                ? "Guardar cambios"
                : "Crear producto"}
            </button>

            {codigoEdicion && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={handleCancelarEdicion}
              >
                Cancelar
              </button>
            )}

          </form>

        </div>

      </div>

      <div className="table-responsive">

        <table className="table table-striped table-hover align-middle">

          <thead className="table-dark">

            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Stock crítico</th>
              <th>Oferta</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {productos.map((producto) => (

              <tr key={producto.codigo}>

                <td>{producto.codigo}</td>

                <td>{producto.nombre}</td>

                <td>{producto.categoria}</td>

                <td>
                  {formatoCLP(producto.precio)}
                </td>

                <td>
                  {producto.stock <=
                  producto.stockCritico ? (
                    <span className="badge bg-danger">
                      {producto.stock}
                    </span>
                  ) : (
                    producto.stock
                  )}
                </td>

                <td>
                  {producto.stockCritico}
                </td>

                <td>
                  {producto.oferta ? (
                    <span className="badge bg-success">
                      Sí
                    </span>
                  ) : (
                    <span className="badge bg-secondary">
                      No
                    </span>
                  )}
                </td>

                <td>

                  <div className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        handleEditar(producto)
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleEliminar(producto)
                      }
                    >
                      Eliminar
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminProductos;