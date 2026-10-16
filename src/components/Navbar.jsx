import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

function Navbar() {
  const { usuario, logout } = useAuth();
  const { cantidadTotal } = useCarrito();
  const esStaff = usuario && ['Administrador', 'Vendedor'].includes(usuario.tipo);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">TechStore</NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/categorias">Categorías</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ofertas">Ofertas</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito">
                Carrito
                <span className="badge bg-primary ms-1">{cantidadTotal}</span>
              </NavLink>
            </li>

            {usuario ? (
              <>
                {esStaff && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">Admin</NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <span className="navbar-text mx-lg-2">Hola, {usuario.nombre}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={logout}>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Ingresar</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/registro">Registrarse</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;