import { NavLink } from "react-router-dom";

function Navbar() {
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
                <ul className="navbar-nav ms-auto">
                   <li className="nav-item">
                    <NavLink className="nav-link" to="/">Inicio</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/productos">Productos</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/ofertas">Ofertas</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/carrito">Carrito</NavLink>
                    </li>
                </ul>
            </div>
        </div>
       </nav> 
    ); 
}
export default Navbar;