import {
  NavLink,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

import AdminProductos from "./admin/AdminProductos";
import AdminUsuarios from "./admin/AdminUsuarios";
import AdminPedidos from "./admin/AdminPedidos";

function Admin() {
  return (
    <ProtectedRoute>
      <div className="container py-4">

        <h1 className="mb-4">
          Panel de Administración
        </h1>

        <div className="row">

          <div className="col-12 col-md-3 mb-4">
            <div className="list-group">

              <NavLink
                to="/admin/productos"
                className="list-group-item list-group-item-action"
              >
                Productos
              </NavLink>

              <NavLink
                to="/admin/usuarios"
                className="list-group-item list-group-item-action"
              >
                Usuarios
              </NavLink>

              <NavLink
                to="/admin/pedidos"
                className="list-group-item list-group-item-action"
              >
                Pedidos
              </NavLink>

            </div>
          </div>

          <div className="col-12 col-md-9">

            <Routes>

              <Route
                index
                element={
                  <Navigate
                    to="/admin/productos"
                    replace
                  />
                }
              />

              <Route
                path="productos"
                element={<AdminProductos />}
              />

              <Route
                path="usuarios"
                element={<AdminUsuarios />}
              />

              <Route
                path="pedidos"
                element={<AdminPedidos />}
              />

            </Routes>

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}

export default Admin;