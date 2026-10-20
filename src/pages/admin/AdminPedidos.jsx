import { useState } from "react";

import {
  obtenerPedidos,
  actualizarEstadoPedido,
  eliminarPedido,
} from "../../data/pedidosService";

import { formatoCLP } from "../../data/datos";

const ESTADOS_PEDIDO = [
  "Pagado",
  "En preparación",
  "Enviado",
  "Entregado",
];

function AdminPedidos() {
  const [pedidos, setPedidos] = useState(
    () => obtenerPedidos()
  );

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleEstado(
    pedido,
    nuevoEstado
  ) {
    setError("");
    setMensaje("");

    try {
      actualizarEstadoPedido(
        pedido.id,
        nuevoEstado
      );

      setPedidos(
        obtenerPedidos()
      );

      setMensaje(
        `Estado del pedido ${pedido.id} actualizado correctamente.`
      );
    } catch (error) {
      setError(error.message);
    }
  }

  function handleEliminar(pedido) {
    const confirmar = window.confirm(
      `¿Deseas eliminar el pedido ${pedido.id}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      eliminarPedido(pedido.id);

      setPedidos(
        obtenerPedidos()
      );

      setError("");

      setMensaje(
        "Pedido eliminado correctamente."
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>

      <h2 className="mb-3">
        Gestión de pedidos
      </h2>

      <p className="text-muted">
        Administración de pedidos de TechStore.
      </p>

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

      {pedidos.length === 0 ? (

        <div className="alert alert-info">
          No existen pedidos registrados.
        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-striped table-hover align-middle">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Entrega</th>
                <th>Total</th>
                <th>Productos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {pedidos.map((pedido) => (

                <tr key={pedido.id}>

                  <td>
                    {pedido.id}
                  </td>

                  <td>
                    {pedido.fecha}
                  </td>

                  <td>
                    {pedido.cliente}
                  </td>

                  <td>
                    {pedido.correo}
                  </td>

                  <td>
                    {pedido.entrega}
                  </td>

                  <td>
                    {formatoCLP(
                      Number(pedido.total) || 0
                    )}
                  </td>

                  <td>
                    {pedido.items?.reduce(
                      (total, item) =>
                        total +
                        Number(
                          item.cantidad || 0
                        ),
                      0
                    ) || 0}
                  </td>

                  <td>

                    <select
                      className="form-select form-select-sm"
                      value={pedido.estado}
                      onChange={(event) =>
                        handleEstado(
                          pedido,
                          event.target.value
                        )
                      }
                    >

                      {ESTADOS_PEDIDO.map(
                        (estado) => (
                          <option
                            key={estado}
                            value={estado}
                          >
                            {estado}
                          </option>
                        )
                      )}

                    </select>

                  </td>

                  <td>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleEliminar(pedido)
                      }
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminPedidos;